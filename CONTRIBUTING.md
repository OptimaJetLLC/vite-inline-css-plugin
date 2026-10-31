# Contributing

Thank you for contributing to `vite-inline-css-plugin`.

## Prerequisites

- Node.js `^20.19.0` or `>=22.12.0`
- npm

## Local setup

Fork and clone the repository, then install the locked dependencies:

```bash
npm ci
```

Create a branch from `main` before making changes.

## Development checks

Run the complete validation suite before opening a pull request:

```bash
npm test
```

This checks formatting, TypeScript, ESLint, the package build, integration tests, and the
published tarball contents. You can also check for unused files and dependencies separately:

```bash
npm run knip
```

Changes to plugin behavior should include an integration test under `tests/`. Update the README
when behavior, compatibility, or the public API changes.

## Pull requests

1. Open an issue first for substantial features or behavior changes.
2. Push your branch to your fork.
3. Open a pull request against `main` and explain what changed and why.
4. Keep the pull request focused and ensure all CI checks pass.

Maintainers handle package versioning and npm publication after a pull request is merged.
