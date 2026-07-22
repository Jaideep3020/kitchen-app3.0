# Kitchen Ops Design System

This document outlines the design tokens and UI/UX paradigms extracted from the active codebase. It serves as the single source of truth for the application's visual language.

## 1. Color Palette

The application uses a highly specific, botanical/technical color palette that feels fresh and distinct.

### Primary Colors
*   **Deep Forest (`#16321F`, `#0A170E`)**: Primary dark. Used heavily for active states, sidebar backgrounds, and high-emphasis text. It provides a softer, organic alternative to pure black.
*   **Citrus/Lime (`#D9E96B`)**: The ONLY high-emphasis accent. Used sparingly for active states and key CTAs (e.g., the "UP/SP" role toggle button). Never used as a general-purpose "pop of color".
*   **Mint/Off-White (`#EAF5E4`)**: Light surface gradient. Used in the top gradient background (`bg-gradient-to-b from-[#EAF5E4]`), giving the app a fresh, airy feel.

### Surfaces (Dark Mode)
*   **Base/Cards (`#121212`, `#1a1a1a`)**: Dark mode surfaces never use pure black (`#000000`). Deep charcoal maintains depth and reduces eye strain.

### Semantic Colors
*   **Destructive/Alerts (Rose)**: e.g., `text-rose-500`, `bg-rose-50`. Used for critical alerts (e.g., plate waste alerts).
*   **Warning/Triage (Amber)**: e.g., `text-amber-500`. Used for quality complaints and high-waste insights.
*   **Success/Healthy (Emerald)**: e.g., `text-emerald-500`. Used for healthy stock levels and live sync indicators.

## 2. Typography

The typographic hierarchy is highly structured, utilizing three distinct font families to separate data from narrative.

*   **Base/Body (`font-sans` - Inter)**: Clean, highly legible, used for descriptions and standard UI labels.
*   **Display/Headers (`font-display` - Space Grotesk)**: Used for primary headers. It gives the app a slightly brutalist, modern-tech edge.
    *   *Usage Pattern*: `text-3xl font-extrabold tracking-tight`
*   **Data/Technical (`font-mono` - Fira Code)**: Heavily utilized for metadata, timestamps, and tags. Reinforces the "dashboard/ops" feel.
    *   *Usage Pattern*: `text-[9px] uppercase tracking-wider` or `text-[10px] font-mono tracking-wider`

## 3. Motion & Interaction

Motion is used to mask loading states and provide physical, tactile feedback.

*   **Standard Entrance (`AnimatePresence`)**: `initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}` transitioning over `250ms` (`ease: 'easeOut'`). Fluid, iOS-like vertical drop with blur.
*   **Haptic Compression**: Almost every interactive element utilizes `active:scale-95` or `active:scale-90`. This visual compression provides immediate tactile feedback.
*   **Skeleton Loading**: Utilizes `animate-skeleton-pulse` and `pulse-slow` keyframes to provide a high-performance feel during data fetching.

## 4. Spacing & Geometry

*   **Card Radii**: The application strongly favors soft, rounded geometry. Standard card radii are `rounded-[24px]` and `rounded-2xl`.
    *   *Audit Note / Open Question*: There is a slight inconsistency between `rounded-[24px]` and `rounded-2xl` used for main containers. We should standardize on a single value for primary surfaces.
*   **Sidebar Widths**: Left-aligned sidebars utilize `w-[240px]` (base) and `lg:w-[260px]` (large screens).

## 5. "Do Not" List (Strict Constraints)

*   **NO emojis as icons**: Always use the standardized Lucide React icon set.
*   **NO gradient-circle avatars**: Stick to clean, utilitarian representations of users or roles.
*   **NO new accent colors**: Citrus (`#D9E96B`) is the ONLY accent. Do not introduce new high-contrast colors outside the established palette.
*   **NO basic bar charts**: If a micro-chart, doughnut, or map can show a trend or distribution better and more beautifully, use that instead. Avoid generic chart templates.
*   **NO new card patterns**: All new data displays must use either the existing "Triage Center" pattern or be a direct, structurally similar variant of it.
