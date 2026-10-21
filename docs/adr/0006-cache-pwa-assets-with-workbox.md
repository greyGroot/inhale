---
status: Accepted
owner: "Project owner"
reviewers: []
updated_at: "2026-10-21"
feature_size: ""
ticket: ""
---

# 0006 — Cache PWA assets with Workbox and defer activation during practice

- **Status:** Accepted
- **Date:** 2026-10-21
- **Deciders:** Project owner, during the survey foundation session

## Context

Firestore provides account data persistence but does not cache the HTML, styles, scripts and audio needed to open Inhale offline. The owner accepted Workbox and then confirmed activation of app updates only between practices. Automatic hosting deployment and client update activation are separate operations.

## Decision drivers

- Open the installed PWA offline after initial online loading/caching.
- Keep Firestore as the only application database, with guest practice transient.
- Prevent an application update from reloading an active breathing practice.

## Considered options

1. **Handwritten service-worker caching:** fewer helper dependencies, more cache lifecycle and update code to maintain.
2. **Workbox service worker:** established caching tooling, with app-specific update coordination still required.

For update timing: immediate activation can interrupt practice; deferral until there is no active practice preserves continuity. The owner approved deferral.

## Decision outcome

**Chosen:** Workbox to precache versioned app-shell assets and bundled offline audio. Firestore remains responsible for account records. A cache of downloaded files is not a second application database.

Download new resources while the existing app remains usable. Activate the waiting service worker and reload only when no practice is active. Starting, running and paused practice all block activation. Coordinate all open app clients before activating a worker; one idle tab must not force a version change in another active tab. Exact implementation belongs to scaffold/feature tasks, but no unconditional `skipWaiting` or forced reload is permitted.

## Consequences

**Positive**

- The installed shell and bundled audio can load without the network after caching.
- Product data stays in one database and one synchronization system.
- Published updates do not interrupt practice.

**Negative**

- Cache completeness, old/new versions and cross-tab activation need explicit tests.
- Initial installation/loading requires connectivity; browser eviction can remove cached files.

**Neutral**

- Workbox is not a background timer and cannot guarantee scheduled offline reminders.
- Deploying to Hosting does not force every installed client to reload immediately.
- No service worker or production code is created by this planning decision.

## Links

- [Architecture map](../architecture-map.md).
- [PWA distribution](0001-use-pwa-distribution.md).
- [Firestore persistence](0002-use-firebase-auth-and-firestore.md).
- [Automatic deployment](0004-use-firebase-hosting-and-github-actions.md).
- [Workbox documentation](https://developer.chrome.com/docs/workbox/).
- Feature spec and SAD: not yet created.
