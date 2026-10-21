---
status: Accepted
owner: "Project owner"
reviewers: []
updated_at: "2026-10-21"
feature_size: ""
ticket: ""
---

# 0001 — Distribute Inhale as a PWA

- **Status:** Accepted
- **Date:** 2026-10-21
- **Deciders:** Project owner, during the survey foundation session

## Context

Inhale needs an installable experience on iPhone and Android for the owner and daughter. The existing browser prototype is the approved UX reference, not a production architecture. The owner considered native distribution costs and free testing limits, then explicitly chose PWA: “then it's pwa.”

## Decision drivers

- Home-screen launch on one or two family iPhones and Android.
- Avoid Apple Developer membership costs and weekly free-development reinstallation for ordinary family use.
- Preserve Glass v2, offline breathing and personal session history with cross-device sync (`../idea-brief.md`).

## Considered options

1. **PWA:** install through the browser and host the application over HTTPS.
2. **React Native + Expo + TypeScript:** build signed mobile applications; paid Apple membership for TestFlight/ad hoc distribution, or Mac/Xcode personal testing with seven-day provisioning.
3. **Flutter + Dart:** another shared mobile codebase, with Apple native signing/distribution requirements still applicable; not explored in detail after the owner raised PWA.

## Decision outcome

**Chosen:** PWA. Distribute Inhale through a website with a home-screen installation experience. This decision chooses the platform and distribution route only; subsequent foundation choices are recorded separately in ADRs 0002 through 0006.

## Consequences

**Positive**

- Browser installation does not require paid Apple Developer membership.
- The approved browser design can inform production web components directly.
- One web distribution route serves iPhone and Android.

**Negative**

- Browser lifecycle and storage policies constrain background execution and durability of unsynchronized local records.
- Offline behavior, audio and keep-awake need explicit implementation and physical-device checks.
- Parental controls and supervised Google account permissions can affect access; installation alone does not prove account sign-in works.

**Neutral**

- The first online visit must load/cache offline resources; first use before authentication stays supported.
- This decision adds no future reminders or native wrapper requirement.
- Hosting/backend costs remain separate decisions. Product implementation has not started.

## Links

- Foundation: [Architecture map](../architecture-map.md).
- Product scope: [Idea brief](../idea-brief.md).
- Prior planning context: [Plan Phase](../Plan%20Phase.md).
- Browser installation: [Apple guide](https://support.apple.com/guide/iphone/iphea86e5236/ios), [Chrome guide](https://support.google.com/chrome/answer/9658361?co=GENIE.Platform%3DAndroid&hl=en).
- Storage limits: [WebKit storage policy](https://webkit.org/blog/14403/updates-to-storage-policy/).
- Related foundation ADRs: [Firebase](0002-use-firebase-auth-and-firestore.md), [TypeScript/Vite](0003-use-vanilla-typescript-and-vite.md), [Hosting/CI](0004-use-firebase-hosting-and-github-actions.md), [feature-first clean architecture](0005-organize-features-with-clean-architecture.md), [Workbox/updates](0006-cache-pwa-assets-with-workbox.md).
- Feature spec and SAD: not yet created.
