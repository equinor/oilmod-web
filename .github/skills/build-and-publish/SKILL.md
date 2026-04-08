---
name: build-and-publish
description: 'Build, publish, and locally link oilmod-web libraries. USE WHEN building libs, publishing to npm, setting up yalc, or troubleshooting build issues. Trigger words: build, publish, yalc, npm, release, version, deploy, link, clean, cache, troubleshoot.'
---

# Build & Publish — oilmod-web

## When to Use

- Building one or all libraries
- Publishing to npm or yalc
- Setting up local development with a consumer project
- Troubleshooting build or dependency issues

## Building Libraries

```bash
# Build all publishable libraries
bun run build

# Build specific library
nx build core
nx build datatable

# Build in watch mode
bun run build:watch
```

## Local Development with yalc

yalc copies built files (not symlinks), avoiding module resolution issues.

### Start dev mode (auto-build + yalc push)

```bash
# In oilmod-web — builds in watch mode, pushes to yalc on changes (8s debounce)
bun run dev
```

### Link in consumer project

```bash
# In the consumer project (e.g., BioCertificateManagement/client/)
yalc add @ngx-stoui/core @ngx-stoui/common @ngx-stoui/datatable
bun install
```

### Manually push updates

```bash
# In oilmod-web — build first, then push to yalc
bun run build && bun run link:push

# Consumer project needs to rebuild to pick up changes
```

## Publishing to npm

Publishing is handled automatically by **release-please**. Do NOT publish manually.

- Merge PRs with [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `perf:`, etc.)
- release-please creates a release PR that bumps versions and updates changelogs per-library
- Merging the release PR triggers the publish pipeline

See `release-please-config.json` for per-library configuration.

### Anti-pattern: `bun run publish:all`

The `publish:all` script exists but should **never** be run manually. It bypasses release-please versioning, changelog generation, and CI checks.

## Troubleshooting

### Build Errors

```bash
# Clear Nx cache
bun run clean

# Reset Nx daemon
nx reset

# Clean install
rm -rf node_modules && bun install
```

### Peer Dependency Conflicts

Ensure consumer projects use compatible Angular versions — `@ngx-stoui/core@21.x` requires `@angular/core@^21.0.0`.
