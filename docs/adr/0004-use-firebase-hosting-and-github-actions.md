---
status: Accepted
owner: "Project owner"
reviewers: []
updated_at: "2026-10-21"
feature_size: ""
ticket: ""
---

# 0004 — Use Firebase Hosting Spark and automatic GitHub deployments

- **Status:** Accepted
- **Date:** 2026-10-21
- **Deciders:** Project owner, during the survey foundation session

## Context

Inhale is a Vite-built PWA with Firebase Authentication and Cloud Firestore. The owner accepted the free Firebase plan and asked about GitHub CI/CD. When offered manual production releases or automatic deployment after an approved PR is merged, the owner selected “automatic”.

## Decision drivers

- Keep initial family usage on a no-cost plan without a payment card.
- Test changes before releasing them to the family.
- Avoid a separate manual release step for each merged change.

## Considered options

1. **Manual production release:** run checks and PR previews automatically, then trigger a production deployment explicitly.
2. **Automatic production release:** run checks and PR previews automatically, then deploy after an approved PR is merged and checks pass.

## Decision outcome

**Chosen:** Firebase Hosting on Spark with automatic production deployment through GitHub Actions. Use the provided Firebase domain initially. PR checks cover type checking, tests and production build; deploy a Hosting preview for trusted PRs. Merging an approved PR into the repository's production branch triggers production deployment after checks pass. The exact branch must be confirmed from repository configuration during scaffold, not invented here.

Configure previews against test backend data; a Hosting preview by itself does not isolate Authentication or Firestore. Deployment credentials are available only to trusted deployment jobs. This planning decision authorizes the intended automation policy, not an immediate deployment or merge.

## Consequences

**Positive**

- Each PR has a reviewable browser preview and checks before release.
- Successful approved merges require no separate manual release action.
- Firebase Hosting supports static PWA files without an application server.

**Negative**

- The production workflow must not deploy when required checks fail.
- Firebase quotas and GitHub Actions allowances are independent; free usage is limited.
- Test backend setup and protected deployment credentials require configuration during scaffold.

**Neutral**

- Spark can interrupt services at quota limits rather than automatically billing for overages. No Blaze upgrade is selected.
- Custom domains, Cloud Functions and Cloud Storage are not part of this decision.
- No resources, secrets, workflow files or branch protection settings have been created or changed by this planning step.

## Links

- [Architecture map](../architecture-map.md).
- [PWA decision](0001-use-pwa-distribution.md).
- [Firebase backend decision](0002-use-firebase-auth-and-firestore.md).
- [Frontend decision](0003-use-vanilla-typescript-and-vite.md).
- [Firebase GitHub integration](https://firebase.google.com/docs/hosting/github-integration).
- [Firebase pricing](https://firebase.google.com/pricing).
- [Hosting quotas](https://firebase.google.com/docs/hosting/usage-quotas-pricing).
- [GitHub Actions billing](https://docs.github.com/en/billing/concepts/product-billing/github-actions).
- Feature spec and SAD: not yet created.
