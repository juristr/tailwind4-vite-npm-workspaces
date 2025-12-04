import { Tree, createProjectGraphAsync } from '@nx/devkit';
import { SyncGeneratorResult } from 'nx/src/utils/sync-generators';
import { join } from 'path';

const START_MARKER = '/* nx-tailwind-sources:start */';
const END_MARKER = '/* nx-tailwind-sources:end */';

export async function updateTailwindGlobsGenerator(
  tree: Tree
): Promise<SyncGeneratorResult> {
  const appName = '@aishop/shop';

  const projectGraph = await createProjectGraphAsync();
  const shopProject = projectGraph.nodes[appName];

  if (!shopProject) {
    return {
      outOfSyncMessage: 'Shop project not found in project graph',
    };
  }

  // Get all dependencies of the shop app
  const dependencies = new Set<string>();
  const queue = [appName];
  const visited = new Set<string>();

  while (queue.length > 0) {
    const current = queue.shift()!;
    if (visited.has(current)) continue;
    visited.add(current);

    const deps = projectGraph.dependencies[current] || [];
    deps.forEach((dep) => {
      dependencies.add(dep.target);
      queue.push(dep.target);
    });
  }

  // Generate @source directives for each dependency
  const sourceDirectives: string[] = [];

  // Add patterns for each dependency
  dependencies.forEach((dep) => {
    const project = projectGraph.nodes[dep];
    if (project && project.data.root) {
      const relativePath = join('../../../', project.data.root);
      sourceDirectives.push(`@source "${relativePath}";`);
    }
  });

  // Sort for consistency
  sourceDirectives.sort();

  // Read current styles.css
  const stylesPath = 'apps/shop/src/styles.css';
  const currentContent = tree.read(stylesPath)?.toString() || '';

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
      return {}; // No changes needed
    }

    // Replace content between markers
    const newContent = currentContent.replace(markerRegex, managedBlock);
    tree.write(stylesPath, newContent);
    return {
      outOfSyncMessage: `Tailwind @source directives updated. ${sourceDirectives.length} sources synced.`,
    };
  }

  // No markers yet - need to insert them after @import 'tailwindcss'
  const importRegex = /@import\s+['"]tailwindcss['"];/;
  const importMatch = currentContent.match(importRegex);
  if (!importMatch || importMatch.index === undefined) {
    return {
      outOfSyncMessage:
        'Could not find @import "tailwindcss"; or @import \'tailwindcss\'; in styles.css',
    };
  }

  // Remove any existing bare @source directives (migration from old format)
  const cleanedContent = currentContent.replace(
    /\n@source\s+["'][^"']*packages\/[^"']+["'];/g,
    ''
  );

  // Find import line position in cleaned content
  const cleanImportMatch = cleanedContent.match(importRegex);
  if (!cleanImportMatch || cleanImportMatch.index === undefined) {
    return {
      outOfSyncMessage: 'Could not find import line after cleaning',
    };
  }
  const importEndIndex =
    cleanedContent.indexOf('\n', cleanImportMatch.index) + 1;

  // Insert managed block after import
  const beforeImport = cleanedContent.substring(0, importEndIndex);
  const afterImport = cleanedContent.substring(importEndIndex);
  const newContent = beforeImport + '\n' + managedBlock + '\n' + afterImport;

  tree.write(stylesPath, newContent);
  return {
    outOfSyncMessage: `Tailwind @source directives initialized. ${sourceDirectives.length} sources synced.`,
  };
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export default updateTailwindGlobsGenerator;
