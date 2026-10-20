# Confirmed product decisions

- Current approved visual direction: Glass v2, both light and dark themes. See `approved-design.md`. Glass is the only design; the previous prototype has been removed.

- Platform: mobile-first for iPhone and Android. Choose the implementation technology later.
- Keep the current continuous breathing-screen layout and session logic.
- Bottom controls: +1 minute, Play/Pause, Stop.
- Before starting, +1 minute is disabled and does not change the timer. Set the initial duration in Settings (1–30 minutes); duration rounds to a full breathing cycle.
- During practice, +1 minute extends by the smallest whole number of cycles totaling at least one minute.
- Pause freezes the phase and clocks; show a quiet pause symbol on the chart.
- Stop resets to ready; elapsed practice remains in the simple journal.
- Keep whole/half-second timing units, live timing calculations and English/Ukrainian language selection.
- No notes or activity heatmap.

These decisions supersede older exploratory wording in ux-flows.md. Latest automated checks could not execute because of host launcher error HRESULT 0x80070020; device/browser verification is still required.
