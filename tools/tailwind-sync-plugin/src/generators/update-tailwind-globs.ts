import { Tree, createProjectGraphAsync, joinPathFragments } from '@nx/devkit';
import { SyncGeneratorResult } from 'nx/src/utils/sync-generators';

export async function updateTailwindGlobsGenerator(
  tree: Tree
): Promise<SyncGeneratorResult> {
  const projectGraph = await createProjectGraphAsync();
  const shopProject = projectGraph.nodes['@aishop/shop'];
  
  if (!shopProject) {
    return {
      outOfSyncMessage: 'Shop project not found in project graph'
    };
  }

  // Get all dependencies of the shop app
  const dependencies = new Set<string>();
  const queue = ['@aishop/shop'];
  const visited = new Set<string>();

  while (queue.length > 0) {
    const current = queue.shift()!;
    if (visited.has(current)) continue;
    visited.add(current);

    const deps = projectGraph.dependencies[current] || [];
    deps.forEach(dep => {
      if (dep.target.startsWith('@aishop/')) {
        dependencies.add(dep.target);
        queue.push(dep.target);
      }
    });
  }

  // Generate glob patterns for shop app and its dependencies
  const globPatterns: string[] = [];
  
  // Add shop app's own patterns
  globPatterns.push(
    "join(__dirname, '{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html,jsx}')"
  );

  // Add patterns for each dependency
  dependencies.forEach(dep => {
    const project = projectGraph.nodes[dep];
    if (project && project.data.root) {
      const relativePath = joinPathFragments(
        '../..',
        project.data.root,
        '{src,lib,components}/**/*!(*.stories|*.spec).{ts,tsx,html,jsx}'
      );
      globPatterns.push(`join(__dirname, '${relativePath}')`);
    }
  });

  // Read current tailwind config
  const tailwindConfigPath = 'apps/shop/tailwind.config.js';
  const currentContent = tree.read(tailwindConfigPath)?.toString() || '';
  
  // Generate new content array
  const contentArray = globPatterns.map((pattern, index) => {
    return index === 0 ? `    ${pattern}` : `,\n    ${pattern}`;
  }).join('');

  // Replace content array in config
  const newContent = currentContent.replace(
    /content:\s*\[[\s\S]*?\]/,
    `content: [\n${contentArray}\n  ]`
  );

  // Only update if content has changed
  if (newContent !== currentContent) {
    tree.write(tailwindConfigPath, newContent);
    return {
      outOfSyncMessage: 'Tailwind config glob patterns updated based on dependencies',
    };
  }

  return {};
}

export default updateTailwindGlobsGenerator;