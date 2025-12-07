import {
  Tree,
  createProjectGraphAsync,
  ProjectGraph,
  ProjectGraphProjectNode,
} from '@nx/devkit';
import { SyncGeneratorResult } from 'nx/src/utils/sync-generators';
import { join, relative, dirname } from 'path';
import { UpdateTailwindGlobsGeneratorSchema } from './schema';

const START_MARKER = '/* nx-tailwind-sources:start */';
const END_MARKER = '/* nx-tailwind-sources:end */';

const DEFAULT_STYLE_PATHS = ['src/styles.css', '.storybook/styles.css'];

const VITE_CONFIG_PATTERNS = [
  'vite.config.ts',
  'vite.config.mts',
  'vite.config.js',
  'vite.config.mjs',
  'vitest.config.ts',
  'vitest.config.mts',
  'vitest.config.storybook.ts',
];

/**
 * Find CSS file with @import 'tailwindcss' in project
 */
function findTailwindCssFile(
  tree: Tree,
  projectRoot: string,
  additionalPaths: string[] = []
): string | undefined {
  const searchPaths = [...DEFAULT_STYLE_PATHS, ...additionalPaths];
  for (const relPath of searchPaths) {
    const fullPath = join(projectRoot, relPath);
    const content = tree.read(fullPath)?.toString();
    if (content?.match(/@import\s+['"]tailwindcss['"]/)) {
      return fullPath;
    }
  }
  return undefined;
}

/**
 * Find any styles.css file in project (for Vite plugin projects)
 */
function findAnyStylesFile(
  tree: Tree,
  projectRoot: string,
  additionalPaths: string[] = []
): string | undefined {
  const searchPaths = [...DEFAULT_STYLE_PATHS, ...additionalPaths];
  for (const relPath of searchPaths) {
    const fullPath = join(projectRoot, relPath);
    if (tree.exists(fullPath)) {
      return fullPath;
    }
  }
  return undefined;
}

/**
 * Check if project uses @tailwindcss/vite plugin
 */
function projectUsesVitePlugin(tree: Tree, projectRoot: string): boolean {
  for (const configFile of VITE_CONFIG_PATTERNS) {
    const configPath = join(projectRoot, configFile);
    const content = tree.read(configPath)?.toString();
    if (content) {
      // Check for tailwindcss import from @tailwindcss/vite and usage
      if (
        content.includes('@tailwindcss/vite') &&
        content.match(/tailwindcss\s*\(\s*\)/)
      ) {
        return true;
      }
    }
  }
  return false;
}

interface TailwindProject {
  project: ProjectGraphProjectNode;
  cssFile: string | undefined;
  usesVitePlugin: boolean;
}

/**
 * Find all projects using Tailwind v4
 */
function findTailwindProjects(
  projectGraph: ProjectGraph,
  tree: Tree,
  additionalStylePaths: string[] = []
): TailwindProject[] {
  const results: TailwindProject[] = [];

  for (const project of Object.values(projectGraph.nodes)) {
    if (!project.data.root) continue;

    // First check for CSS file with @import 'tailwindcss'
    let cssFile = findTailwindCssFile(
      tree,
      project.data.root,
      additionalStylePaths
    );
    const usesVitePlugin = projectUsesVitePlugin(tree, project.data.root);

    // For Vite plugin projects without @import 'tailwindcss', look for any styles.css
    if (!cssFile && usesVitePlugin) {
      cssFile = findAnyStylesFile(
        tree,
        project.data.root,
        additionalStylePaths
      );
    }

    if (cssFile || usesVitePlugin) {
      results.push({ project, cssFile, usesVitePlugin });
    }
  }

  return results;
}

/**
 * Collect all transitive dependencies for a project
 */
function collectDependencies(
  projectName: string,
  projectGraph: ProjectGraph
): Set<string> {
  const dependencies = new Set<string>();
  const queue = [projectName];
  const visited = new Set<string>();

  while (queue.length > 0) {
    const current = queue.shift();
    if (!current) continue;
    if (visited.has(current)) continue;
    visited.add(current);

    const deps = projectGraph.dependencies[current] || [];
    deps.forEach((dep) => {
      dependencies.add(dep.target);
      queue.push(dep.target);
    });
  }

  return dependencies;
}

/**
 * Update @source directives in a CSS file
 */
function updateSourceDirectives(
  tree: Tree,
  projectName: string,
  cssFilePath: string,
  projectGraph: ProjectGraph
): boolean {
  const dependencies = collectDependencies(projectName, projectGraph);

  // Generate @source directives for each dependency
  const sourceDirectives: string[] = [];
  const cssDir = dirname(cssFilePath);

  dependencies.forEach((dep) => {
    const project = projectGraph.nodes[dep];
    if (project && project.data.root) {
      // Calculate relative path from CSS file directory to dependency root
      const relativePath = relative(cssDir, project.data.root);
      sourceDirectives.push(`@source "${relativePath}";`);
    }
  });

  // Sort for consistency
  sourceDirectives.sort();

  // Read current CSS content
  const currentContent = tree.read(cssFilePath)?.toString() || '';

  // Build the managed block
  const managedBlock = [START_MARKER, ...sourceDirectives, END_MARKER].join(
    '\n'
  );

  // Check if markers already exist
  const hasMarkers =
    currentContent.includes(START_MARKER) &&
    currentContent.includes(END_MARKER);

  if (hasMarkers) {
    // Extract existing managed section content for comparison
    const markerRegex = new RegExp(
      `${escapeRegex(START_MARKER)}[\\s\\S]*?${escapeRegex(END_MARKER)}`
    );
    const existingBlock = currentContent.match(markerRegex)?.[0] || '';

    if (existingBlock === managedBlock) {
      return false; // No changes needed
    }

    // Replace content between markers
    const newContent = currentContent.replace(markerRegex, managedBlock);
    tree.write(cssFilePath, newContent);
    return true;
  }

  // No markers yet - need to insert them
  // Remove any existing bare @source directives (migration from old format)
  const cleanedContent = currentContent.replace(
    /\n@source\s+["'][^"']*packages\/[^"']+["'];/g,
    ''
  );

  // Try to find @import 'tailwindcss' first
  const tailwindImportRegex = /@import\s+['"]tailwindcss['"];/;
  const tailwindImportMatch = cleanedContent.match(tailwindImportRegex);

  // If not found, look for any @import statement
  const anyImportRegex = /@import\s+['"][^'"]+['"];/;
  const anyImportMatch = cleanedContent.match(anyImportRegex);

  const importMatch = tailwindImportMatch || anyImportMatch;

  let newContent: string;
  if (importMatch && importMatch.index !== undefined) {
    // Insert after the import line
    const importEndIndex = cleanedContent.indexOf('\n', importMatch.index) + 1;
    const beforeImport = cleanedContent.substring(0, importEndIndex);
    const afterImport = cleanedContent.substring(importEndIndex);
    newContent = beforeImport + '\n' + managedBlock + '\n' + afterImport;
  } else {
    // No imports found, prepend to file
    newContent = managedBlock + '\n\n' + cleanedContent;
  }

  tree.write(cssFilePath, newContent);
  return true;
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export async function updateTailwindGlobsGenerator(
  tree: Tree,
  options: UpdateTailwindGlobsGeneratorSchema = {}
): Promise<SyncGeneratorResult> {
  const projectGraph = await createProjectGraphAsync();
  const updatedProjects: string[] = [];

  // Find all Tailwind v4 projects
  const tailwindProjects = findTailwindProjects(
    projectGraph,
    tree,
    options.additionalStylePaths
  );

  // Update @source directives for each project with a CSS file
  for (const { project, cssFile } of tailwindProjects) {
    if (cssFile) {
      const updated = updateSourceDirectives(
        tree,
        project.name,
        cssFile,
        projectGraph
      );
      if (updated) {
        updatedProjects.push(project.name);
      }
    }
  }

  if (updatedProjects.length === 0) {
    return {};
  }

  return {
    outOfSyncMessage: `Tailwind @source directives updated for: ${updatedProjects.join(
      ', '
    )}`,
  };
}

export default updateTailwindGlobsGenerator;
