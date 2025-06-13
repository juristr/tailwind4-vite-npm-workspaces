# AI Shop - Nx Workspace with Tailwind Sync Generator

This workspace demonstrates an efficient Tailwind CSS setup using Nx Sync Generators to automatically manage glob patterns based on project dependencies.

## Overview

The workspace contains an e-commerce application (`@aishop/shop`) with multiple feature libraries organized by domain (orders, products, shared). To optimize Tailwind CSS compilation, we've implemented a custom Nx Sync Generator that dynamically updates the Tailwind configuration to only scan files from libraries that are actual dependencies of the shop application.

## Key Features

- **Dynamic Tailwind Configuration**: Automatically updates glob patterns based on project dependencies
- **Nx Sync Generator**: Runs before `serve` and `build` tasks to ensure configuration is always up-to-date
- **Efficient Builds**: Only scans necessary files, reducing build times

## Tailwind Sync Generator Setup

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
3. **Updates Tailwind Config**: Modifies `apps/shop/tailwind.config.js` with the computed patterns

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

## Project Structure

```
apps/
  shop/                    # Main application
    tailwind.config.js     # Auto-updated by sync generator
packages/
  orders/                  # Order-related features
    data-access-order/
    feat-cancel-order/
    feat-create-order/
    feat-current-orders/
    feat-orders/
    feat-past-orders/
    ui-order-detail/
  products/                # Product-related features
    data-access-products/
    feat-product-detail/
    feat-product-list/
    ui-product-detail/
  shared/                  # Shared utilities and UI
    ui/
    utils/
tools/
  tailwind-sync-plugin/    # Custom Nx plugin with sync generator
```

## Benefits

1. **Performance**: Only processes files from actual dependencies, not the entire workspace
2. **Maintainability**: No manual updates needed when adding/removing dependencies
3. **Developer Experience**: Automatic synchronization reduces configuration errors
4. **Scalability**: As the workspace grows, build times remain optimized

## Commands

```bash
# Run the shop application (triggers sync generator)
nx serve @aishop/shop

# Build the shop application (triggers sync generator)
nx build @aishop/shop

# Manually sync the workspace
nx sync

# Build the sync generator plugin
nx build @aishop/tailwind-sync-plugin
```

## Further Reading

- [Nx Sync Generators](https://nx.dev/extending-nx/recipes/create-sync-generator)
- [Nx Project Graph](https://nx.dev/concepts/mental-model#the-project-graph)
- [Tailwind CSS Configuration](https://tailwindcss.com/docs/configuration)
- [Nx DevKit API](https://nx.dev/packages/devkit)