# md-share

## Description

A minimal tool that allows rendering markdown with Mermaid diagram support and sharing a link that contains the document encoded in the URL.

## Code Implementation Flow

### Pre-Development
- **Read ADRs** Before starting any development work, read all Architecture Decision Records in `docs/adrs/` to understand existing design decisions and constraints. Do not contradict or duplicate existing ADRs without explicit user approval.

### Architecture
- **TypeScript** Use TypeScript as default language, unless told otherwise
- **Domain Logic Separation** Separate domain logic from CLI/UI/WebAPI
- **CLI** Always implement a CLI with feature parity to WebAPI/UI layer. This is a tool for you as an agent to validate your work
- **PWA** Build as a Progressive WebApp for offline support
- **Language Convention** UI text visible to users is in Spanish. All code (variables, functions, types, comments), documentation, and test descriptions must be in English.
- **UI Iconography** For web interfaces, use **Heroicons** via `@heroicons/react` instead of emoji or raw Unicode glyphs for buttons, navigation, banners, and status chips. Keep icon choices consistent through a shared `src/ui/components/icons.tsx` mapping/helper.
- **In-Memory Stubs for External Integrations** For every external service integration (databases, APIs, third-party services), implement an in-memory stub that conforms to the same interface. Use a provider/factory that auto-selects the real implementation when credentials are configured, and falls back to the in-memory stub when they are not. This ensures E2E tests, CLI validation, and local development work fully offline without external dependencies.

### Git Workflow
- **Work directly on master** — solo developer, no branch overhead
- **Commit after every completed unit of work** — never leave working code uncommitted
- **Push after each work session** — remote backup is non-negotiable. Remote for this repo at https://github.com/alejandroechev/md-share.git
- **Tag milestones**: `git tag v0.1.0-mvp` when deploying or reaching a checkpoint
- **Branch only for risky experiments** you might discard — delete after merge or abandon

### Coding — TDD Workflow (strict, per-function)

1. **RED** — Write a failing test FIRST. Run it. Confirm it fails. Show the failure output.
2. **GREEN** — Write the MINIMUM implementation code to make the test pass. Run the test. Confirm it passes.
3. **REFACTOR** — Clean up if needed. Run the test again to confirm it still passes.
4. Repeat for the next behavior/function.

### Coding — E2E and CLI Tests (per-feature, not batched)

For every user-facing feature, before considering it complete:
- **E2E Test** — Write a Playwright E2E test that exercises the feature end-to-end. Run it. Confirm it passes.
- **CLI Scenario** — Write a CLI scenario AND execute it using the CLI. Confirm the output matches expectations.

### Validation — Pre-Commit Gate

```bash
# 1. All unit tests pass with coverage above 90%
npx vitest run --coverage
# STOP if coverage < 90%. Add tests until coverage ≥ 90%.

# 2. All E2E tests pass
npx playwright test
# STOP if any E2E test fails. Fix the issue.

# 3. TypeScript compiles cleanly
npx tsc -b
# STOP if there are type errors. Fix them.

# 4. Visual validation (UI features only)
# Take screenshots using Playwright MCP of every screen affected by the change.
# Review each screenshot visually. Store in screenshots/ folder.
# If Playwright MCP is not available, STOP and tell the user.
```

### Documentation
- **Docs hierarchy**: ADRs are the source of truth for architecture decisions, README is the public summary that links back to ADRs, and AGENTS.md contains process rules only. Avoid duplicating design detail across all three.
- **README** Update readme file with any relevant public change to the app
- **System Diagram** Keep always up to date a mermaid system level diagram of the app architecture in docs/system-diagram.md
- **ADR** For every major design and architecture decision add an Architecture Decision Record in docs/adrs
- **Docs sync** After every feature or fix, review `git diff --stat` against README.md, `docs/system-diagram.md`, and `docs/adrs/`. Update only what is stale, and prefer a separate `docs:` commit for doc-only follow-up changes.

### Commit Checklist

Before running `git commit`, mentally verify:
- [ ] Every new function/component was built with TDD (red → green → refactor)?
- [ ] E2E tests exist for every new user-facing feature?
- [ ] CLI scenarios exist and have been executed for every new feature?
- [ ] All tests pass with ≥ 90% statement coverage?
- [ ] Zero type/lint errors?
- [ ] Visual screenshots taken and reviewed (if UI feature)?
- [ ] **Docs sync** completed by reviewing the recent diff against README, system diagram, and ADRs?
- [ ] README updated (if public-facing change)?
- [ ] System diagram updated (if architecture changed)?
- [ ] ADR written (if major design decision)?
- [ ] **Pipeline validation** planned: after pushing, CI/CD and required build/release pipelines will be monitored until they are green?

### Release Completion Gate

After pushing a feature or fix, do **not** consider the work complete until:
- the required CI/CD pipeline passes,
- any build/release pipeline for the project passes,
- and the resulting artifact or deployment is confirmed to exist when applicable.

If the project has GitHub Actions, monitor the first run after scaffold/push and treat failures as blocking work, not as follow-up housekeeping.
