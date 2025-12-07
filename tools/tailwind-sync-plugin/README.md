# tailwind-sync-plugin

Nx sync generator that auto-manages `@source` directives in CSS files for Tailwind v4 monorepos.

## Problem

Tailwind v4 [requires to define `@source` directives](https://tailwindcss.com/docs/detecting-classes-in-source-files#explicitly-registering-sources) for dependencies that might be outside its own project configuration. Something that is common in monorepos. Manually maintaining these in a monorepo is error-prone.

## Solution

This plugin traverses the Nx project graph and generates `@source` directives for all transitive dependencies.

## Detection

A project is detected as using Tailwind v4 if:

1. Has a CSS file with `@import 'tailwindcss'`
2. Has a Vite config using `tailwindcss()` from `@tailwindcss/vite`

## CSS File Search Paths

Default locations checked:

- `src/styles.css`
- `.storybook/styles.css`

Additional paths can be configured via the `additionalStylePaths` option.

## Output

The generator inserts/updates a managed block in CSS files:

```css
@import 'tailwindcss';

/* nx-tailwind-sources:start */
@source "../../../packages/shared/daypulse-ui";
@source "../../../packages/daypulse/styles";
/* nx-tailwind-sources:end */
```

## Usage

Register the sync generator on tasks that need it (e.g., `build`, `dev`):

```json
{
  "nx": {
    "targets": {
      "build": {
        "syncGenerators": ["@aishop/tailwind-sync-plugin:update-tailwind-globs"]
      }
    }
  }
}
```

Run manually:

```bash
pnpm nx sync
```

## Options

| Option                 | Type       | Description                                   |
| ---------------------- | ---------- | --------------------------------------------- |
| `additionalStylePaths` | `string[]` | Extra relative paths to search for styles.css |

## Building

```bash
nx build tailwind-sync-plugin
```
