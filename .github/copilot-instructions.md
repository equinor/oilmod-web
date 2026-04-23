# GitHub Copilot Instructions - oilmod-web

## What This Is

oilmod-web is a **reusable Angular component library** (@ngx-stoui) providing Equinor's design system components. This is NOT an application but a **publishable library monorepo** built with Nx and distributed as npm packages.

## Repository Structure

```
oilmod-web/
├── libs/
│   ├── core/              # Foundation: themes, utilities, base components
│   ├── common/            # Shared models, services, utilities
│   ├── datatable/         # Data table components
│   ├── drawer/            # Drawer/sidebar components
│   ├── error-handler/     # Error handling utilities
│   ├── form/              # Form components and utilities
│   ├── popover/           # Popover/tooltip components
│   └── testing/           # Test utilities and mocks
├── apps/
│   └── oilmod-web/        # Storybook application for component showcase
└── package.json           # Workspace config (bun + Angular 20+)
```

## Library Dependency Graph

- `core` → Foundation (no internal dependencies)
- `common` → Depends on `core`
- `datatable`, `drawer`, `form`, `popover` → Depend on `core` and `common`
- Each lib is published independently to npm as `@ngx-stoui/{name}`

## Technology Stack

- **Angular**: 21.x (standalone components, signals, modern control flow)
- **Package Manager**: bun
- **Build System**: Nx 22.x
- **UI Foundation**: Angular Material 21.x (Material 3 / M3 theming API)
- **Testing**: Jest
- **Storybook**: 10.x for component documentation and visual testing
- **Styling**: SCSS with Material 3 theming + EDS (Equinor Design System) tokens
- **Chrome DevTools MCP**: Available via `.vscode/mcp.json` for visual debugging in Storybook

## Key Commands

```bash
bun run build          # Build all publishable libraries
bun run dev            # Watch mode + yalc push for local development
bun run test           # Run all tests
bun run storybook      # Run Storybook
nx build <lib>         # Build specific library
nx test <lib>          # Test specific library
```

## Consumer Projects

Projects like BioCertificateManagement and InventoryManagementValuation import these libs:

```typescript
import { StoButtonComponent } from '@ngx-stoui/core';
import { StoDataTableComponent } from '@ngx-stoui/datatable';
```

## Detailed Guidelines

Specialized instructions and skills cover specific topics — they load automatically or on-demand:

- **Angular patterns** → see `angular.instructions.md` (auto-loads for .ts/.html files)
- **Theming/SCSS** → see `theming.instructions.md` (auto-loads for .scss files)
- **Library publishing** → see `library-architecture.instructions.md` (auto-loads for libs/)
- **Creating components** → use the `component-development` skill (on-demand)
- **Build/publish/yalc** → use the `build-and-publish` skill (on-demand)
- **Post-task review** → use the `retrospective` skill (on-demand)

## Knowledge Base

The `.github/knowledge/` folder contains the externalized mental model for
this codebase — descriptive notes about how subsystems work, what they own,
their invariants, design decisions, and known tensions. Files use a strict
schema (OWNS / READS FROM / WRITES TO / INVARIANT / FLOW / TENSION /
DECIDED) — see any existing knowledge file for the format.

| File                                             | Domain    | When to read                                                                                                                                   |
| ------------------------------------------------ | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| [knowledge/workspace.md](knowledge/workspace.md) | workspace | Editing build/release/CI config, `nx.json`, `release-please-config.json`, root scripts, yalc, tooling                                          |
| [knowledge/theming.md](knowledge/theming.md)     | theming   | Editing any `.scss` under `libs/core/src/styles/` or consuming theme tokens; M3 + EDS coexistence                                              |
| [knowledge/core.md](knowledge/core.md)           | core      | Editing directives/pipes in `libs/core/` or anything in `@ngx-stoui/core` TS surface                                                           |
| [knowledge/common.md](knowledge/common.md)       | common    | Editing `libs/common/` (action footer, app header, breadcrumbs, confirm dialog, filter base, message panel, preference manager, theme service) |
| [knowledge/datatable.md](knowledge/datatable.md) | datatable | Editing `libs/datatable/` (sto-datatable + body/header/header-group/actions, columns, sort, virtual scroll)                                    |
| [knowledge/form.md](knowledge/form.md)           | form      | Editing `libs/form/` (number input, slide toggle, select-filter, select-all, WYSIWYG, FormFieldDirective, form utils)                          |
| [knowledge/drawer.md](knowledge/drawer.md)       | drawer    | Editing `libs/drawer/` (sto-drawer + slots, nav-drawer, animations)                                                                            |
| [knowledge/popover.md](knowledge/popover.md)     | popover   | Editing `libs/popover/` (CDK overlay anchor pattern)                                                                                           |

> **Knowledge files — read before editing, write after learning:**
>
> - **Read gate:** Before editing any file in `libs/**` or `apps/**`, or
>   making a non-trivial change anywhere, you MUST first read the knowledge
>   files that cover the affected domain. This rebuilds the mental model —
>   state ownership, invariants, design rationale — so you can spot when a
>   proposed change contradicts an earlier `DECIDED` entry and push back
>   rather than silently regress it. Trivial edits (typos, comments,
>   formatting) are exempt.
> - **Write gate:** During or after any task, if you discover a new
>   invariant, state-ownership fact, data-flow edge, design decision, or
>   tension that is not already in a knowledge file, you MUST add it to the
>   correct file using the structured notation (OWNS / READS FROM /
>   WRITES TO / INVARIANT / FLOW / TENSION / DECIDED). These files are your
>   externalized mental model — if you don't write it down, the next session
>   will rediscover it from scratch.
> - **Rule of thumb:** If the user argues for a change that contradicts a
>   `DECIDED` entry, cite the entry and ask them to justify overriding it
>   before implementing. Past decisions have context; don't silently reverse
>   them.

## Commit Conventions

This repo uses **release-please** to automate changelogs and npm releases per library. Commit messages directly drive versioning, so they must follow [Conventional Commits](https://www.conventionalcommits.org/).

**Format:** `type(scope): message`

- **type** — one of: `feat`, `fix`, `perf`, `revert`, `docs`, `style`, `chore`, `refactor`, `test`, `build`, `ci`
  - `feat` and `fix` appear in changelogs; `feat` triggers a minor bump, `fix` a patch bump.
  - Add `!` after scope for breaking changes: `feat(core)!: remove deprecated API`
- **scope** — one or more library names from `libs/`: `core`, `common`, `datatable`, `drawer`, `error-handler`, `form`, `popover`. Use comma-separated scopes for multi-lib changes: `fix(core,common): ...`
- **message** — short imperative description of what was done (appears in CHANGELOG)

**Rules:**

1. Keep commits small and focused — one logical change per commit.
2. After completing a task or fix, always suggest a commit point and a ready-to-use commit message.
3. If a change spans multiple libraries, either use multiple scopes or split into separate commits per library.
4. For changes outside `libs/` (CI, tooling, storybook app), use `chore`, `ci`, `build`, or `docs` without a library scope, or scope to the relevant area (e.g., `chore(storybook): ...`).

**Examples:**

```
fix(form): preserve cursor position in number-input during editing
feat(datatable): add column reordering support
refactor(core,common): extract shared utility functions
chore(ci): update Node version in GitHub Actions
docs(drawer): add usage examples to README
feat(popover)!: change positioning API to use anchor elements
```

## Chrome DevTools MCP

A Chrome DevTools MCP server is configured in `.vscode/mcp.json` (CDP on `localhost:9222`). Use it to:

- Visually inspect rendered Storybook components (`bun run storybook` first)
- Debug layout, spacing, and theming issues in the browser
- Take screenshots for visual regression checks
- Inspect accessibility properties of rendered components

Launch Chrome with remote debugging: `chrome --remote-debugging-port=9222`
