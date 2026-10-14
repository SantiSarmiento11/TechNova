---
name: Lumina Support
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#464555'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#777587'
  outline-variant: '#c7c4d8'
  surface-tint: '#4d44e3'
  primary: '#3525cd'
  on-primary: '#ffffff'
  primary-container: '#4f46e5'
  on-primary-container: '#dad7ff'
  inverse-primary: '#c3c0ff'
  secondary: '#0051d5'
  on-secondary: '#ffffff'
  secondary-container: '#316bf3'
  on-secondary-container: '#fefcff'
  tertiary: '#005338'
  on-tertiary: '#ffffff'
  tertiary-container: '#006e4b'
  on-tertiary-container: '#67f4b7'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#0f0069'
  on-primary-fixed-variant: '#3323cc'
  secondary-fixed: '#dbe1ff'
  secondary-fixed-dim: '#b4c5ff'
  on-secondary-fixed: '#00174b'
  on-secondary-fixed-variant: '#003ea8'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.025em
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: -0.005em
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0em
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: -0.005em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.04em
  code-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

The design system establishes a high-precision, low-cognitive-load environment engineered for support teams, triage leads, and operations managers. It merges modern Scandinavian minimalism with subtle, high-performance glassmorphism.

### Aesthetic Principles
- **Clarity over Decoration:** White and ultra-light neutrals serve as a quiet canvas, ensuring complex multi-state ticket tables and triage queues remain instantly readable.
- **Controlled Translucency:** Subtle backdrop filters and faint translucent boundaries are used exclusively on persistent navigation, overlays, and floating control bars to indicate depth without distracting from data density.
- **Intentional Contrast:** Vibrant indigo accents guide focus to primary workflows (e.g., ticket resolution, triage assignments), while purposeful emerald, amber, and rose status colors anchor urgency without visual noise.
- **Target Emotional Response:** Calm precision, operational mastery, and frictionless efficiency during peak ticket volume.

## Colors

The palette relies on stark structural discipline: clean, luminous backgrounds paired with calibrated semantic tokens.

### Background & Surface Layers
- **App Canvas Base:** `#F8FAFC` (Slate 50) — Used for full-page backgrounds and structural backdrops.
- **Surface Elevation 0 (Pure Card / Canvas):** `#FFFFFF` — Primary container surface for cards, detail panels, and tables.
- **Surface Translucent (Glass Panels):** `rgba(255, 255, 255, 0.75)` with `backdrop-filter: blur(12px)`.
- **Subtle Row/Hover Surface:** `#F1F5F9` (Slate 100) — Row hovers, empty states, and inactive tab tracks.

### Brand & Interaction Accents
- **Primary Indigo:** `#4F46E5` (Indigo 600) — Primary CTAs, active selection rings, and high-priority filters.
- **Primary Hover/Deep Indigo:** `#4338CA` (Indigo 700).
- **Secondary Vivid Blue:** `#2563EB` (Blue 600) — Informational states, secondary actions, and metric highlights.

### Semantic Status Tokens
- **Resolved / Open (Success):** Surface `#ECFDF5`, Border `#A7F3D0`, Text `#047857` (Emerald 700).
- **Pending / Waiting on Customer (Warning):** Surface `#FFFBEB`, Border `#FDE68A`, Text `#B45309` (Amber 700).
- **Escalated / Critical (Urgent):** Surface `#FEF2F2`, Border `#FECACA`, Text `#B91C1C` (Rose 700).
- **Triaged / New (Neutral State):** Surface `#F1F5F9`, Border `#CBD5E1`, Text `#475569` (Slate 600).

### Text Hierarchy
- **Text Primary:** `#0F172A` (Slate 900) — Maximum contrast for titles, ticket keys, and metrics.
- **Text Secondary:** `#475569` (Slate 600) — Body copy, metadata, and assigned agent names.
- **Text Muted:** `#94A3B8` (Slate 400) — Timestamps, input placeholders, and secondary icons.
- **Border Subtle:** `#E2E8F0` (Slate 200) — 1px dividers and card boundaries.

## Typography

The type scale is anchored by **Plus Jakarta Sans**, combining geometric rigor with open apertures that remain crisp in compact table rows, dense sidebars, and rapid triage lists.

### Typographic Guidelines
- **Tabular Numerics:** For ticket metrics, SLAs, times-to-resolution, and IDs, enforce `font-feature-settings: "tnum" 1` to prevent visual jitter when values update in real time.
- **Caps & Micro-Labels:** `label-sm` is reserved for ticket tags, SLA trackers, and metadata headers. It must always be set in uppercase with `letterSpacing: 0.04em`.
- **Hierarchical Reading:** Use weight contrasts (`fontWeight: 600` vs `fontWeight: 400`) within identical font sizes (14px) to separate ticket submitters from email subjects without introducing excessive scale variations.

## Layout & Spacing

The layout utilizes a fluid, density-aware structural grid optimized for dashboard-heavy SaaS workflows.

### Grid & Canvas Structure
- **Desktop (1280px+):** Fixed collateral navigation (260px), flexible multi-pane triage layout (list view 400px–500px, detail view remaining space), or a 12-column analytical grid with `1.5rem` gutters and `2rem` outer page margins.
- **Tablet (768px - 1279px):** Sidebar collapses into an icon rail (64px). Ticket queue and conversation view split 50/50 or switch to a full-screen stacked tab view with `1rem` gutters.
- **Mobile (< 768px):** Single-column stack. Bottom persistent action bar replaces floating drawers. Outer page margins contract to `1rem`.

### Spacing Principles
- **Macro-Spacing (Sectional):** Use `space-xl` (`2rem`) to separate analytics panels, queue header controls, and message thread modules.
- **Micro-Spacing (Component Internal):** Use `space-xs` (`4px`) and `space-sm` (`8px`) inside badges, button icon-text pairings, and table cell vertical paddings to preserve data density while preventing crowding.

## Elevation & Depth

Visual hierarchy combines low-opacity colored ambient shadows, pure white base planes, and controlled translucent glass surfaces.

### Surface Tiers
- **Tier 0 (App Canvas):** Base background `#F8FAFC`. Zero elevation, zero shadows.
- **Tier 1 (Resting Cards & Table Rows):** Surface `#FFFFFF`, border `1px solid #E2E8F0`. Shadow: `0 1px 3px 0 rgba(15, 23, 42, 0.04), 0 1px 2px -1px rgba(15, 23, 42, 0.02)`.
- **Tier 2 (Interactive Hover & Popovers):** Elevated surface `#FFFFFF` with border `1px solid rgba(226, 232, 240, 0.8)`. Shadow: `0 10px 15px -3px rgba(15, 23, 42, 0.05), 0 4px 6px -4px rgba(15, 23, 42, 0.03)`.
- **Tier 3 (Floating Command Bars & Overlays):** Translucent surface `rgba(255, 255, 255, 0.82)` with `backdrop-filter: blur(16px)` and border `1px solid rgba(255, 255, 255, 0.6)`. Shadow: `0 20px 25px -5px rgba(79, 70, 229, 0.06), 0 8px 10px -6px rgba(15, 23, 42, 0.04)`.

### Ambient Glows
- Modals and primary status highlights feature an ultra-soft, low-opacity ambient drop shadow tinted with Indigo: `box-shadow: 0 0 32px -8px rgba(79, 70, 229, 0.12)`.

## Shapes

The design system uses a balanced rounding scale to combine a precise software feel with approachable, ergonomic curves.

### Rounding Hierarchy
- **Containers, Cards & Modals (`rounded-xl`):** `1.5rem` (24px) for full page cards, conversational chat containers, and modal sheets.
- **Interactive Controls (`rounded-lg`):** `0.75rem` (12px) for input fields, textareas, and primary buttons.
- **Badges, Status Indicators & Avatars (`rounded-full`):** Full pill rounding (`9999px`) for ticket status chips, urgency pills, SLA tags, and agent presence rings.

## Components

### Buttons
- **Primary:** Background `#4F46E5`, text `#FFFFFF`, radius `0.75rem`. Hover: `#4338CA` with subtle shadow `0 4px 12px rgba(79, 70, 229, 0.25)`. Active: `#3730A3`.
- **Secondary (Outlined):** Background `#FFFFFF`, border `1px solid #E2E8F0`, text `#0F172A`. Hover: background `#F8FAFC`, border `#CBD5E1`.
- **Ghost:** Background `transparent`, text `#475569`. Hover: background `#F1F5F9`, text `#0F172A`.

### Status Chips & Priority Badges
- **Height & Spacing:** `24px` height, `8px` horizontal padding, text `label-sm` (11px uppercase).
- **Style:** Subtle tinted background with matching 1px semi-opaque border and high-contrast text.
  - *Open / Low:* Emerald (`#ECFDF5`, border `#A7F3D0`, text `#047857`).
  - *In Progress / Medium:* Sky/Blue (`#EFF6FF`, border `#BFDBFE`, text `#1D4ED8`).
  - *Pending / Urgent:* Amber (`#FFFBEB`, border `#FDE68A`, text `#B45309`).
  - *Critical / Blocker:* Rose (`#FEF2F2`, border `#FECACA`, text `#B91C1C`).

### Cards & Container Panels
- **Structure:** Background `#FFFFFF`, border `1px solid #E2E8F0`, border-radius `1.5rem` (`rounded-xl`), padding `1.5rem`.
- **Glass Card Variant (Floating Inspector):** Background `rgba(255, 255, 255, 0.8)`, `backdrop-filter: blur(12px)`, border `1px solid rgba(226, 232, 240, 0.6)`.

### Form Inputs & Filters
- **Text Inputs & Search:** Background `#FFFFFF`, border `1px solid #CBD5E1`, text `#0F172A`, placeholder `#94A3B8`, radius `0.75rem`.
- **Focus State:** Border `#4F46E5`, box-shadow `0 0 0 3px rgba(79, 70, 229, 0.15)`, outline `none`.

### Checkboxes & Radios
- **Control Base:** `18px x 18px`, border `1.5px solid #CBD5E1`, border-radius `4px` (checkbox) or `9999px` (radio).
- **Selected:** Background `#4F46E5`, border `#4F46E5`, glyph/dot white. Focus ring `0 0 0 3px rgba(79, 70, 229, 0.15)`.

### Ticket List Rows
- **Layout:** Flex row, `56px` minimum height, borders bottom `1px solid #F1F5F9`.
- **Hover Transition:** Background `#F8FAFC` transitioning over `120ms ease`.
- **Selected State:** Background `rgba(79, 70, 229, 0.04)`, left indicator bar `3px solid #4F46E5`.

### SLA Countdown Pill
- **Structure:** Monospaced tabular numerals, pill radius `9999px`, padding `2px 8px`.
- **Normal:** Text `#475569`, background `#F1F5F9`.
- **Breaching (< 30 min):** Text `#DC2626`, background `#FEF2F2`, pulsing 6px warning dot.