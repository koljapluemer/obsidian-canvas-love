# Obsidian Canvas Love

An Obsidian plugin I started to make Canvas more useful.

Very much **WIP**.

## Functionality

### Export to HTML

Goal: Export Obsidian Canvas to responsive HTML that's usable on all common devices.

#### Concept

1. `AbstractGrid` is made, noting the required nodes and edges from `JSON Canvas` data
2. `ConfiguredGrid` is generated with random configuration params based on this abstract grid
3. A `DrawnGrid` is made step-by-step, actuall drawing in nodes and edges

A meta-algo can call all these to hillclimb the optimal parameters for export.

## Development

### Test Scripts

- `npm run test:abstract`: Generates an AbstractGrid from a canvas file and saves it as JSON for inspection

### Automated Testing Note

- For automated tests to work, `tsconfig.json` uses `"module": "CommonJS"` for compatibility with Mocha and ts-node. If you need ES modules, you may need to adjust your test runner configuration or revert this change.

## Resources

- [Open JSON Canvas Spec](https://github.com/obsidianmd/jsoncanvas/blob/main/spec/1.0.md)
- [ts JSON Canvas](https://github.com/t128n/jsoncanvas)
