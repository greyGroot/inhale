---
status: Accepted
owner: "Project owner"
reviewers: []
updated_at: "2026-10-21"
feature_size: ""
ticket: ""
---

# 0005 — Organize features with clean architecture

- **Status:** Accepted
- **Date:** 2026-10-21
- **Deciders:** Project owner, during the survey foundation session

## Context

Inhale uses plain TypeScript/Vite with Firebase and browser capabilities. After reviewing the proposed module layout, the owner requested merging feature-based organization with clean architecture. The goal is locality within a feature and testable business logic independent of external SDKs.

## Decision drivers

- Keep changes to breathing, sessions, settings and authentication near their owning feature.
- Test timing and product rules with Vitest without DOM or network dependencies.
- Keep Firebase and browser-specific behavior behind small consumer-owned interfaces.
- Preserve a single deployable PWA and Firestore as the only application database.
- Allow future meditation, water reminders and other habits to own their behavior in separate feature modules. The owner explicitly confirmed this rationale and approved the structure. These capabilities remain future scope, not scaffold or first-release functionality.

## Considered options

1. **Feature folders with direct implementation files:** simple ownership, but dependency direction is implicit and browser/database concerns can leak into logic.
2. **Feature-first clean architecture:** each feature owns its domain, application, infrastructure and UI as needed; dependencies point inward and app bootstrap composes implementations.

## Decision outcome

**Chosen:** feature-first clean architecture, as requested by the owner. Use `src/features/{breathing,sessions,settings,auth}/` with `domain/`, `application/`, `infrastructure/`, `ui/` only where real code exists, and `index.ts` as the public feature interface.

Domain contains pure models, invariants and calculations. Application coordinates actions and declares narrow ports for I/O. Infrastructure supplies Firebase/browser adapters; UI presents state through the DOM. Neither domain nor application imports Firebase, DOM, Workbox or browser adapter implementations. Dependencies are supplied explicitly through functions/factories; a DI framework is not required.

Features do not import each other's internals. Initially cross-feature workflows live in `src/app/`, which uses public feature interfaces. For stopping/completing practice, breathing produces an outcome; app orchestration checks account identity and calls sessions to save an account-owned record. Guest results are not saved. Account-change behavior during practice remains a specification detail; this structure does not select a policy.

Shared code contains reusable Glass UI, tokens, translations and Firebase client setup, not feature business rules or a general-purpose services bucket. Firebase initialization is imported only by bootstrap and outer adapters. Workbox remains in `src/pwa/`.

Future features can follow the same convention, for example `src/features/meditation/` or `src/features/water-reminders/`. Add shared abstractions only after multiple real features need the same behavior; no generic habits engine, reminder scheduler or empty future feature directories are selected now. The architecture does not establish that reliable scheduled reminders are feasible in an installed PWA; evaluate that when the reminder feature is specified.

## Consequences

**Positive**

- Feature behavior and its adapters remain locally discoverable.
- Logic tests can use controlled clocks and in-memory repository adapters.
- SDK document shapes and browser lifecycle details stay outside inner logic.

**Negative**

- Some flows require explicit composition and mapping between outcome DTOs and session models.
- Dependency direction needs lint/import checks and review; folders alone do not enforce it.

**Neutral**

- Do not generate empty layers, base entities, generic repositories or one-method pass-through use cases without behavior. Introduce ports where production and test adapters actually vary.
- Colocate Vitest tests with source; keep browser and Firebase integration checks in `tests/browser/` and `tests/firebase/`.
- This records a planned structure only. No production code or scaffold is created.

## Links

- [Architecture map](../architecture-map.md).
- [Product brief](../idea-brief.md).
- [Frontend stack](0003-use-vanilla-typescript-and-vite.md).
- [Firebase persistence](0002-use-firebase-auth-and-firestore.md).
- Feature spec and SAD: not yet created.
