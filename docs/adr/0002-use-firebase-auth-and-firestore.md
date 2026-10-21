---
status: Accepted
owner: "Project owner"
reviewers: []
updated_at: "2026-10-21"
feature_size: ""
ticket: ""
---

# 0002 — Use Firebase Authentication and Cloud Firestore

- **Status:** Accepted
- **Date:** 2026-10-21
- **Deciders:** Project owner, during the survey foundation session

## Context

Inhale is a PWA requiring personal Google accounts, offline breathing and session/settings synchronization across devices. The owner selected Firebase: “we will have google acount login so i think firebase firestore will fit.” Authentication and document storage are separate Firebase services; Google sign-in is handled by Firebase Authentication.

## Decision drivers

- Preserve separate Google accounts and app-user privacy from the accepted brief.
- Keep online session records available for the owner's direct administrator inspection.
- Reduce custom online/offline synchronization plumbing while retaining explicit ownership and conflict rules.

## Considered options

1. **Supabase with a local browser database:** managed PostgreSQL and Google authentication, with application-owned synchronization.
2. **Firebase Authentication and Cloud Firestore:** managed identity and document storage with configurable web offline persistence.

## Decision outcome

**Chosen:** Firebase Authentication with the Google provider, plus Cloud Firestore as the single application database for signed-in session and settings records. Enable Firestore's SDK-managed persistent browser cache for offline use. The owner subsequently removed guest persistence during this foundation session: guests may practice with transient state, but their sessions/settings are not saved or imported later. No separate application-managed IndexedDB/idb database or parallel session store is selected.

The project, region, SDK versions, document schema and detailed cache/account lifecycle are not yet fixed. Hosting on Spark and GitHub release policy are covered by ADR 0004. No cloud resources are created by this decision.

## Consequences

**Positive**

- Integrated Google sign-in support and Firestore client synchronization reduce infrastructure work.
- The owner can inspect online records through the Firebase console with administrator privileges.

**Negative**

- Web persistent caching must be enabled/configured; an offline cache does not supply the entire offline application shell or audio.
- Firestore synchronization does not define safe account switching, deduplication or the product's settings conflict semantics. Those require design and tests. Guest import is out of scope.
- Browser storage eviction, provider quotas and service availability remain limitations.

**Neutral**

- Firestore uses documents rather than SQL tables. No SQL migration tool is implied.
- Security Rules must restrict app-user access by authenticated ownership. Owner administrator access remains outside the app; no administrator credentials belong in the client.
- First-time offline-before-auth practice uses memory only after app resources have been cached. Do not create a cloud anonymous account to retain guest data. Initial Google sign-in requires connectivity; previously signed-in offline operation must be tested.
- Firestore may internally use IndexedDB for persistent caching. This does not introduce a separately maintained application database. Service-worker file/audio caching has a different purpose and remains necessary for offline loading.
- Hosting and free-plan decisions are in [ADR 0004](0004-use-firebase-hosting-and-github-actions.md); no paid plan or payment commitment is authorized.

## Links

- [Architecture map](../architecture-map.md).
- [Accepted product scope](../idea-brief.md).
- [PWA decision](0001-use-pwa-distribution.md).
- [Firebase Google sign-in](https://firebase.google.com/docs/auth/web/google-signin).
- [Firestore offline persistence](https://firebase.google.com/docs/firestore/manage-data/enable-offline).
- Feature spec and SAD: not yet created.
