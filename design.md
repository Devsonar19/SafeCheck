# Visual Design System & UX Specification — SafeCheck

> Ready to adapt: this specification defines SafeCheck's calm, high-contrast baseline design system and can be updated cleanly whenever additional UI/UX references are provided.

## 1. Design Philosophy
SafeCheck adopts a **calm, utilitarian security workbench** aesthetic. People inspecting a suspected scam are often anxious—the interface must feel clear, factual, and grounded, never alarmist or gimmicky.

### Core Restraint Principles
- **Show the product immediately**: Opening SafeCheck lands directly inside the working Threat Inspector with zero marketing filler.
- **No decorative clutter**: Zero pill-wrapped metadata tags, zero pulsing green status dots, zero fake telemetry tickers, zero thick left accent borders (`border-l-4`), and zero nested cards inside cards.
- **Single-elevation depth**: Flat panels separated by crisp `1px` hairline borders and generous whitespace.
- **Radius math**: Nested interactive controls follow `r_inner = r_outer - padding` (e.g., `rounded-xl` outer `12px` container with `p-1` `4px` wraps `rounded-lg` `8px` controls).

## 2. Color System (60-30-10 Discipline)
Supports Light mode (default) and high-contrast Dark mode via Tailwind v4 `@custom-variant dark`.

| Role | Light Mode | Dark Mode | Usage |
| --- | --- | --- | --- |
| **60% Canvas** | `#F8FAFC` (`slate-50`) | `#020617` (`slate-950`) | Main application background |
| **30% Surface** | `#FFFFFF` (`white`) | `#0F172A` (`slate-900`) | Workbench panels, sidebar, header |
| **Hairline Border** | `#E2E8F0` (`slate-200`) | `#1E293B` (`slate-800`) | 1px structural dividers |
| **Primary Text** | `#0F172A` (`slate-900`) | `#F1F5F9` (`slate-100`) | Headlines, body copy (WCAG AAA) |
| **Secondary Text** | `#475569` (`slate-600`) | `#94A3B8` (`slate-400`) | Supporting labels, inline metadata |
| **10% Accent CTA** | `#1D4ED8` (`blue-700`) | `#3B82F6` (`blue-500`) | Primary action buttons, active states |

### Semantic Threat Signaling (Never Color-Only)
Every threat verdict pairs color + icon + explicit text label:
- **Safe**: Emerald (`#15803D` light / `#4ADE80` dark) + Check Shield icon + `"Safe"`
- **Caution**: Amber (`#B45309` light / `#FBBF24` dark) + Alert Triangle icon + `"Caution"`
- **High Risk**: Crimson (`#B91C1C` light / `#F87171` dark) + Octagon Alert icon + `"High Risk"`

## 3. Typography (2 + 1 Font Rule)
- **Display & Headings**: `Plus Jakarta Sans` (SemiBold 600 / Bold 700, `text-wrap: balance`).
- **Body Prose**: `Public Sans` (Regular 400 / Medium 500, 15–16px, line-height 1.6).
- **Technical Data & Scores**: `JetBrains Mono` with `font-variant-numeric: tabular-nums` used strictly for inspected URLs, Unicode/Punycode highlights, and numeric scores.

## 4. Layout & Responsiveness
- **Desktop (1440px baseline)**: Fixed `248px` left navigation rail + single-row `56px` contextual top bar (`Breadcrumb` on left, `Theme Toggle` + single `New Scan` action on right) + spacious two-column workspace split for Input and Verdict.
- **Mobile**: Collapsible accessible drawer navigation; sticky top bar strictly `<= 15%` viewport height; minimum `44px` touch targets.

## 5. Motion & State Completeness
- Compositor-only transitions (`transform`, `opacity`) settling in `<= 150ms`, fully disabled under `prefers-reduced-motion: reduce`.
- Every view implements complete **Empty**, **Loading Skeleton**, **Populated**, and **Error Recovery** states.
