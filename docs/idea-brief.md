---
status: Draft
owner: "Project owner (parent and intended user)"
updated_at: "2026-10-21"
depth: medium
---

# Idea brief — mindful-breathing

## 1. Raw idea

Read the existing project docs first. Interview me about mindfull breathing,
reuse documented decisions, and flag anything outdated or contradictory.

Initial owner elaboration, verbatim:

> I am creating this for my daughter. she is doing the mindfull breathing. in the future we will add different types of breathing, not only square: inhale, hold, exhale, hold. there are many of them. Also i want in the future to add diferent practices like meditation, reminder to drink water, reminder to take pills. i see this as a family app, where i could track my mindfull, health habits and see what is my daughter is doing, skipping, etc. But first is just to track and practice breathing.

## 2. Problem

**owner-reported:** The owner's daughter already practices mindful breathing. The owner wants an app for her and also intends to use it personally. The immediate need is to practice breathing and keep a session history. The same person's sessions and personal settings must be available across devices, while breathing remains fully usable offline, including before first sign-in.

**owner-reported desired outcome:** The experience should be relaxing and pleasant, easy to start and use. The owner wants to verify that new sessions appear in the online database by inspecting it directly. No numeric usage target or health benefit is claimed. These are owner acceptance goals, not independently demonstrated usability outcomes.

The current workaround, frequency of use and dissatisfaction with existing tools are **unknown**. No measured demand is claimed. The solution direction is owner-requested; it is not independently validated evidence of benefit to the daughter.

## 3. Users

**owner-reported, accepted:** Initial users are the owner and the owner's daughter, each using their own Google account and private sessions and settings within the app. The owner may inspect the daughter's full session records directly as database administrator. This explicit exception qualifies the earlier statement of no cross-account access; it does not add a parent-monitoring UI or shared session history. The daughter's age, preferences and direct feedback have not been established; her parent supplied the requirements.

**source-verified:** The target is an installable app for Android and iPhone; the existing browser prototype is an approved UX reference, not a selected production stack. See `Plan Phase.md`, “Контекст для нового чату,” and `features/mindful-breathing/approved-design.md`, “Source of truth.”

## 4. Why now

**owner-reported:** The owner is creating the app for the daughter's existing breathing practice and personal use. No deadline, external trigger, cost of waiting or usage target has been established.

## 5. Out of scope

**owner-reported, accepted:** Other breathing patterns, meditation, water and medication reminders, and an in-app family-monitoring feature belong to future direction. First-release accounts have private data within the app; the owner's direct database-administrator inspection of the daughter's full session records is allowed. These future ideas do not select an architecture or establish their eventual requirements.

**source-verified existing constraints:** Preserve Glass v2, light/dark themes, English/Ukrainian, one continuous breathing screen, +1 minute / Play-Pause / Stop, whole-cycle duration rounding, whole/half-second timing units, live timing calculations, simple Sessions list and no notes or activity heatmap. Stop saves elapsed practice when applicable and returns to ready; natural completion opens summary. Sources: `features/mindful-breathing/product-decisions.md` and `approved-design.md`.

This interview does not implement or alter the prototype, select a technology stack, or produce detailed requirements. Medical outcomes are not established.

**owner-reported terminology correction:** The product term is **Sessions**, not “Journal,” because the app records practices rather than notes. References to “Journal” in the existing docs and prototype are legacy terminology to reconcile during specification and later UI work; they do not introduce note-taking.

## 6. Risks

The weakest consequential **assumption** is that the approved interaction and audio will be useful and comfortable for the daughter on her actual phone; her own feedback and device validation are not yet available. The owner's requested features are intent evidence, not proof of usability.

| Claim/question | Class | Source/origin | Finding/limit |
|---|---|---|---|
| First users, future scope, offline use, online database, Google accounts, private data, sync and audio | owner-reported | Owner's answers in the 2026-10-21 interview | Accepted product choices; not independently validated capability or demand. |
| Approved design and session controls | source-verified | `features/mindful-breathing/product-decisions.md`; `approved-design.md`, “Breathing screen” | Existing constraints reused. Device/browser visual validation is still outstanding. |
| Stop destination and settled saving/rounding | source-verified | `ux-flows.md`, story 2, SCR-08 and “Open review decisions,” versus `product-decisions.md` | Older flows lead Stop to partial summary and reopen settled decisions. Newer decision says save elapsed practice and return to ready. Do not reopen the decision from the old diagram. |
| No accounts/cloud/sound; timing reset on reload | source-verified | `ux-flows.md`, “Platform and review assumptions” and story 4; `prototype-glass/README.md`; `prototype-glass/app.js`, initial settings and persistence | These describe exploratory/prototype scope. This interview explicitly adds accounts, online sync, persistent personal settings and offline audio to the intended product. |
| Existing rhythm | source-verified | `ux-flows.md`, “Platform and review assumptions”; `prototype-glass/app.js`, settings and cycleLength | Prototype defaults to 3/6/3/6 seconds, ratio 1:2:1:2. Owner's term “square” must not silently change it to equal phases; current session logic is the reused baseline. |
| Background behavior | source-verified | `prototype-glass/app.js`, visibilitychange handler | Browser pauses on hiding the tab. This does not verify keep-awake or lifecycle behavior on phones. |
| Runtime validation status | source-verified | `ux-flows.md`, “Verification and handoff” and “Continuous breathing screen”; `approved-design.md`, “Accessibility and verification limits” | Historical passing checks and later launcher failures describe different runs. No fresh tests or device validation were performed by this interview. |

Independent clean-context critique was performed in explicit interview mode by `sdd-devils-advocate`, using owner quotations and the interviewer's inspected local evidence. It identified hypothetical risks, not observed incidents: ambiguous ownership, missing/duplicate/misattributed offline sessions or overwritten settings, and a silent switch to screen-off continuation. Separate private accounts and the accepted sync policy resolve intent; detailed account-change/reconnection checks remain for specification. The conditional background fallback must remain explicit and be checked on devices.

**owner-reported accepted access boundary:** In-app privacy does not exclude the owner's administrator access to the daughter's full session records. This is an explicit product decision, not evidence that production access controls exist. Specification must preserve personal account ownership and distinguish app-user access from privileged administrator access; no administrator credentials should be exposed through the app.

No external capability or medical claims were researched. Filesystem access was intermittently blocked by launcher error `0x80070020`, delaying progressive writes; access later recovered. No production stack, service, operational cost or feasibility claim has been verified.

## 7. Recommendation

**Owner-accepted direction:** Build the first release around practicing the existing breathing rhythm and tracking personal sessions, for the daughter and parent independently. Preserve the approved UX and design while adding the following agreed capabilities:

- Offline breathing remains available before authentication after the app resources have been loaded/cached. Guest practice is transient: do not persist guest sessions or personal settings, and do not offer a later guest-data import. Owner revised this requirement during the survey foundation session on 2026-10-21 to avoid an additional application-managed database.
- Google sign-in with separate accounts and sessions and settings private within the app. Persist data only for signed-in accounts. The owner may inspect the daughter's full session records directly as database administrator; no parent-monitoring UI is included.
- Online storage and synchronization of sessions and personal settings across a person's devices. Combine sessions without duplicates; latest saved personal settings win. Sessions remain attached to the owning account and are never transferred merely by switching accounts.
- Use Cloud Firestore as the single application database, with its SDK-managed persistent offline cache for signed-in data. No separate guest database or custom parallel session store is required. Initial Google sign-in needs connectivity; previously signed-in offline behavior and account changes must be tested explicitly.
- Prefer keeping the screen awake during practice and pausing when the user leaves the app. Owner permits screen-off continuation as a fallback if the chosen stack cannot support the preference; do not silently substitute that fallback.
- Offline choice between spoken phase guidance and distinct gentle tones for inhale, exhale and holds, with mute. App languages remain English/Ukrainian; precise audio content and assets belong to specification.

**Tradeoff:** Accounts and cloud sync make the first release larger than the local-only prototype. The local-only alternative was offered; the owner explicitly required online storage for cross-device use instead. Family monitoring and additional practices are deferred to keep the first release focused.

**owner-reported success goal:** A relaxing, pleasant experience that is easy to start and use, with new sessions visible through the owner's direct database checks. A hands-on review by intended users and confirmation of uploaded records would test this goal; no frequency or clinical target is inferred.

**Recommendation:** Carry the accepted direction into specification without reopening the design. The owner accepted the consequential scope, synchronization and access choices in the interview, then revised guest persistence during the foundation session: save data only for signed-in accounts. The subsequent survey established a PWA foundation in `architecture-map.md` and `adr/`, plus the installable-starter plan in `features/_scaffold/tasks.json`. The install path is browser installation on iPhone and Android rather than native signing/builds. A feature spec does not yet exist; implementation and device validation have not run.

Outcome: ready-for-specify. Product intent and consequential choices are confirmed, including the administrator-access exception. Technical checks below are nonblocking for producing requirements, and do not establish implementation readiness. Use keep-awake/pause-on-leaving as the preferred requirement; if it proves infeasible, document that evidence and specify the already accepted screen-off fallback explicitly. The simpler local-only alternative does not meet the owner's accepted cross-device requirement.

## 8. Open questions

| Unknown | Consequence | Status | Verification action | Owner |
|---|---|---|---|---|
| No blocking product-intent unknown identified | Scope and access can now be specified | Nonblocking | Preserve the accepted decisions and explicitly resolve the technical details below in their owning stages | Project owner |
| Keep-awake and interruption feasibility on Android/iPhone; precise fallback trigger | Background behavior could record unintended practice time | Nonblocking for writing a spec with an explicit preferred behavior; must be verified before selecting the conditional fallback or implementing the lifecycle contract | Foundation capability check and device validation; document whether the condition for the owner-accepted fallback is met | Technical verification unassigned; fallback decision: project owner |
| PWA build/hosting prerequisites and access to physical Android/iPhone devices | Installability cannot be claimed | Nonblocking for product intent; blocking before scaffold acceptance | Follow `architecture-map.md` and `features/_scaffold/tasks.json`; verify HTTPS hosting, browser installation, cached offline shell and actual devices. PWA installation needs no Apple signing account. Do not assume Firebase/GitHub access is configured | Project owner supplies access; technical verification unassigned |
| Detailed account-change, offline reconnection, time-ordering and settings conflict semantics | Data could be duplicated, misattributed or overwritten unexpectedly | Nonblocking for intent; must be resolved in specification before implementation | Turn accepted sync rules into explicit examples for two devices, reconnection and account changes | Specification owner unassigned |
| Exact audio cues/assets and daughter's comfort/usability | Guidance may not communicate phases clearly or suit its intended user | Nonblocking for scope; required before audio acceptance | Specify offline spoken/tonal choices and review them with intended users on phones | Project owner; daughter's direct feedback not yet obtained |

