# Approved design — Glass v2

Status: current approved visual direction. Approved by the user after comparing the initial dark prototype with the Glass variant. Incorporates the requested centered timing preview and styled language/theme controls.

## Source of truth

- Current prototype: `prototype-glass/index.html`.
- Visual styling: `prototype-glass/glass.css`, applied over the prototype's base layout.
- Interaction behavior: `prototype-glass/app.js`.
- Glass is the only approved design. The previous prototype has been removed.
- Platform: mobile-first for iPhone and Android. Desktop includes review annotations outside the app. Those annotations are not part of the mobile product.

## Shared visual character

Rounded, translucent surfaces sit over a static, softly blended background. Frosted glass uses backdrop blur, fine reflective borders and restrained shadows to separate layers. The screen keeps a quiet hierarchy: breathing guide first, timing second, understated controls below. No decorative motion competes with the breathing marker.

The app container has a 42px corner radius on desktop preview and 34px on narrow screens. A thin highlight defines the glass edge. Typography uses the platform system sans-serif, with light-to-regular headings and tabular timing digits. The bottom navigation floats inside a rounded glass capsule, with a soft inset surface for the selected destination.

## Light theme appearance

The background blends pale lavender, sea-glass teal and a muted peach accent into a cool near-white base. The app panel is translucent white with a brighter upper rim. Text is charcoal and muted slate; purple-grey accents keep controls gentle. The breathing path moves from lavender toward blue-grey, while inactive segments stay faint. The timer is clear without a heavy weight.

## Dark theme appearance

The background blends deep plum, dark teal and muted warm charcoal into a near-black blue base. The app panel becomes smoked glass with a thin cool highlight. Text is soft off-white; secondary information is muted lavender-grey. The breathing guide uses pale lavender and subdued blue, and the phase highlight is a low-opacity violet surface. Navigation and controls remain translucent rather than switching to opaque black blocks.

Light and dark use the same geometry, content hierarchy and behavior. Theme applies to the whole preview, settings inputs, journal and summary. It persists when local storage is available, defaults to light, and restores before initial paint.

## Breathing screen

One persistent layout holds ready, starting, breathing and paused states. Heading and phase/countdown stay above the chart. A thin progress track, remaining time and four phase cards remain in fixed positions. Cards show Inhale, Hold, Exhale, Hold, with the active phase softly highlighted.

The bottom control row is Add-minute, Play/Pause, square Stop. Add-minute and Stop are disabled before starting. A faint, noninteractive pause mark appears in the chart only while paused. Stop saves elapsed practice and resets to ready; natural completion opens the summary. All controls have accessible labels and touch targets; focus remains visible for keyboard users.

## Settings

The four phase cards and calculated cycle summary are centered. Their values update immediately when duration or timing changes. Timing units accept only whole or half seconds.

Language and theme use two-segment glass controls, not native dropdown menus. Each segment is a real radio input with keyboard support. Language offers English / Українська. Theme offers Light / Dark, localized as Світла / Темна in Ukrainian. A subtle raised glass surface marks the checked segment. Both controls match the selected theme. Changes apply immediately and preserve unsaved timing drafts; timing values still use Save/Cancel.

## Journal and summary

The journal remains a simple chronological list of translucent session cards. The summary uses quiet metric tiles. No note input or activity heatmap is included.

## Accessibility and verification limits

Keep mobile safe-area spacing, readable 16px form inputs, 44–48px minimum action targets, labeled controls and visible keyboard focus. Blur has an opaque fallback; reduced-transparency and reduced-motion preferences have CSS treatment.

Automated checks cover the session state machine, timing validation, persistence, language/theme changes and draft preservation. Visual rendering and contrast on actual iPhone/Android screens still require device verification. This document describes the implemented CSS and approved direction; no new screenshot attachments were supplied with this request.
