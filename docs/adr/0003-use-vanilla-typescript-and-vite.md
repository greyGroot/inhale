---
status: Accepted
owner: "Project owner"
reviewers: []
updated_at: "2026-10-21"
feature_size: ""
ticket: ""
---

# 0003 — Build the PWA with plain TypeScript and Vite

- **Status:** Accepted
- **Date:** 2026-10-21
- **Deciders:** Project owner, during the survey foundation session

## Context

The accepted platform is PWA with Firebase Authentication and Cloud Firestore. The approved prototype uses HTML, CSS and JavaScript. The owner selected option 2, plain TypeScript and Vite, when asked which frontend tools to use.

## Decision drivers

- Stay close to the existing approved web prototype and its Glass design.
- Introduce static type checking and build tooling without a UI framework.
- Preserve the offline, account and synchronization requirements from the brief.

## Considered options

1. **React + TypeScript + Vite:** reusable component framework, with conversion of existing markup and additional dependencies.
2. **Plain TypeScript + Vite:** direct DOM/HTML/CSS composition and explicit state updates, with fewer framework abstractions.

## Decision outcome

**Chosen:** plain TypeScript and Vite. No React dependency is selected. The completed architecture map defines command scripts, module structure, test tools, Workbox integration policy and vanilla CSS organization. Exact compatible package versions are pinned during scaffold.

## Consequences

**Positive**

- Existing HTML/CSS design patterns can be reused directly when implementing the production UI.
- TypeScript supports checked interfaces for sessions, settings and browser adapters.

**Negative**

- Rendering, event lifecycle and state updates need explicit organization and tests as account/sync states grow.
- Vite alone does not implement service-worker caching, installation metadata or offline data ownership.

**Neutral**

- Optional libraries remain possible; selecting this stack does not select or install any device API library.
- Keep the approved prototype unchanged; production source structure is a later foundation choice.

## Links

- [Architecture map](../architecture-map.md).
- [Product brief](../idea-brief.md).
- [PWA decision](0001-use-pwa-distribution.md).
- [Firebase decision](0002-use-firebase-auth-and-firestore.md).
- [Vite documentation](https://vite.dev/guide/).
- Feature spec and SAD: not yet created.
