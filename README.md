# Tailwind 4 with React + Vite in an NPM Worksapce

This repo shows how to configure Tailwind 4 with Vite and React in an NPM workspace (monorepo), including

- **Configuring @source includes** to have Tailwind process additional packages in the NPM workspace
- **Automating the generation @source includes** using [Nx Sync generators](https://nx.dev/extending-nx/recipes/create-sync-generator)

Check out the video walkthrough: [https://youtu.be/tg3LnqhNNws](https://youtu.be/tg3LnqhNNws)

(Using Tailwind v3? [Check out this demo repository](https://github.com/juristr/tailwind-sync-demo))

## Commands

```bash
# Run the shop application (triggers sync generator)
nx serve shop

# Build the shop application (triggers sync generator)
nx build shop

# Manually sync the workspace (optional)
nx sync
```

## Key parts

Key parts to look at are

- `packages.json` containing the Tailwind packages
- `apps/shop/src/styles.css` containing the Tailwind directives and glob patterns to process further local workspace packages
- `apps/shop/vite.config.ts` for the Tailwind Vite plugin registration

## Automating with Nx Sync Generators

### What is an Nx Sync Generator?

Sync generators are a powerful Nx feature that ensures your workspace stays in sync by running checks and applying updates automatically. They can be triggered:

- Before specific tasks (like `build` or `serve`)
- Globally for all projects
- On-demand via `nx sync`

Learn more: [Nx Sync Generator Documentation](https://nx.dev/extending-nx/recipes/create-sync-generator)

### Implementation Details

Our sync generator (`@aishop/tailwind-sync-plugin:update-tailwind-globs`) performs the following:

1. **Analyzes Project Graph**: Uses Nx's project graph to determine all dependencies of the shop application
2. **Generates Glob Patterns**: Creates specific glob patterns for each dependency
3. **Updates styles.css**: Modifies `apps/shop/src/styles.css` with the computed `@source "..."` patterns

### How to Create a Sync Generator

1. **Install Nx Plugin Tools**:

   ```bash
   nx add @nx/plugin
   ```

2. **Create a Local Plugin**:

   ```bash
   nx g @nx/plugin:plugin tools/tailwind-sync-plugin
   ```

3. **Generate the Sync Generator**:

   ```bash
   nx g @nx/plugin:generator --name=update-tailwind-globs --path=tools/tailwind-sync-plugin/src/generators/update-tailwind-globs
   ```

4. **Implement the Generator**:
   The generator (located at `tools/tailwind-sync-plugin/src/generators/update-tailwind-globs.ts`) uses the Nx DevKit API to:

   - Access the project graph
   - Traverse dependencies
   - Generate and update configuration files

5. **Register with Tasks**:
   In `apps/shop/package.json`, add the sync generator to the `nx` configuration:
   ```json
   {
     "nx": {
       "targets": {
         "build": {
           "syncGenerators": ["@aishop/tailwind-sync-plugin:update-tailwind-globs"]
         },
         "serve": {
           "syncGenerators": ["@aishop/tailwind-sync-plugin:update-tailwind-globs"]
         }
       }
     }
   }
   ```

### Usage

The sync generator runs automatically when you:

- Run `nx serve @aishop/shop`
- Run `nx build @aishop/shop`
- Manually run `nx sync`

If the workspace is out of sync, you'll see a message indicating changes were made. The generator only updates the config when dependencies have changed.

## Further Reading

- [Nx](https://nx.dev/)
- [Nx Sync Generators](https://nx.dev/extending-nx/recipes/create-sync-generator)
- [Tailwind CSS Configuration](https://tailwindcss.com/docs/installation/using-vite)
