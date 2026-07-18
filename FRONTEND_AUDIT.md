# Frontend & UI/UX audit

## 1. Component inventory
| File Path | Role Served | What It Renders | Wired to Real Data |
|---|---|---|---|
| `src/components/ErrorBoundary.tsx` | All | Global error fallback UI | No |
| `src/components/ManagerMenu.tsx` | Manager | Weekly menu planner, publish UI | Yes |
| `src/components/ManagerSettings.tsx` | Manager | Organization configs & KPI thresholds | Yes |
| `src/components/NotificationInbox.tsx` | Staff, Student | Alerts list (stock, waste, RSVP reminders) | Yes |
| `src/components/SignIn.tsx` | All | Role selection and auth mock | No (Auth is mocked) |
| `src/components/StaffDashboard.tsx` | Staff | Quick operations overview, metrics, receiving | Yes |
| `src/components/StaffLaunchHub.tsx` | Manager/Staff | High-level metrics launchpad | Yes |
| `src/components/StaffManagement.tsx` | Manager | Staff scheduling and performance stats | Yes |
| `src/components/StaffOps.tsx` | Staff | Kitchen prep tracking and activity feed | Yes |
| `src/components/StaffReports.tsx` | Manager/Staff | Advanced charts and predictive insights | Yes |
| `src/components/StaffStock.tsx` | Staff | Inventory lists, active orders, vendor stats | Yes |
| `src/components/StudentCheckIn.tsx` | Student | QR check-in and active dining pass | Yes |
| `src/components/StudentOptIn.tsx` | Student | Weekly meal selection and choices | Yes |
| `src/components/StudentProfile.tsx` | Student | RSVP history and preferences | Yes |
| `src/components/TimeAndCalendarHub.tsx` | All | Date picker and time travel utility | Yes |

**Duplication flags:**
- **Staff operations overlap**: `StaffDashboard.tsx` and `StaffOps.tsx` both render recent activity feeds and operational metrics.
- **Reporting overlap**: `StaffLaunchHub.tsx` and `StaffReports.tsx` share metric logic and some chart presentations.

## 2. Styling audit

### Student Role
- **Styling approach used**: Tailwind utility classes directly applied in `StudentOptIn.tsx` and `StudentProfile.tsx`.
- **Design system consistency**: Card-based UI with strong theme accents. Uses consistent gradient backgrounds (`bg-gradient-to-b from-[#EAF5E4] to-white`).
- **Actual color palette in use**: Dark green (`#16321F`), lime green (`#D9E96B`), and Tailwind's Emerald (`emerald-400`).
- **Corner radius / border / spacing consistency**: Large borders (`rounded-2xl`, `rounded-xl`), generous padding (`p-4`, `p-6`).
- **Literal element-by-element description**: (Student Opt-In) Date carousel at the top. A vertical sequence of meal cards (Breakfast, Lunch, Dinner). Each card contains an absolute-positioned background image (`object-cover`), a glassmorphic title tag (`backdrop-blur-md bg-white/95 text-[#0A170E]`), dietary icons, nutritional info, and a large toggle/picker button at the bottom.

### Staff Role
- **Styling approach used**: Tailwind utility classes, explicit skeleton loaders (`animate-skeleton-pulse`) in `StaffDashboard.tsx`.
- **Design system consistency**: Functional, dense dashboard layout. Explicit dark mode classes used heavily (`dark:bg-[#121212]`, `dark:border-gray-800`).
- **Actual color palette in use**: White/Gray-50 backgrounds, Amber for warnings (`amber-500`, `amber-900/20`), Red for alerts (`red-500`), Blue for receiving action (`blue-500`).
- **Corner radius / border / spacing consistency**: Slightly sharper corners (`rounded-[16px]`), tighter gaps (`gap-2`, `gap-3`).
- **Literal element-by-element description**: (Staff Dashboard) Top row contains a responsive grid of quick stats (Expected Diners, Prep Completion, Recent Deliveries). The next row shows Active Deliveries cards featuring a progress bar, ETA text, and a "Receive" button. Below that are Waste alerts and a Recent Activity feed list.

### Manager Role
- **Styling approach used**: Complex grids and Recharts integrations (in `StaffReports.tsx` and `ManagerMenu.tsx`).
- **Design system consistency**: Dense data tables, chart containers, and modal overlays for deep edits.
- **Actual color palette in use**: Theme colors applied to charts (`grid: isDarkMode ? '#475569' : '#eee'`). Purple/Emerald alerts for AI insights and confirmations.
- **Corner radius / border / spacing consistency**: Standard Tailwind `rounded-xl`, tight padding inside tables and chart wrappers (`py-2`, `px-3`).
- **Literal element-by-element description**: (Staff Reports) Top segmented controls to switch views. A bento grid of charts below. Left panel holds KPI sparklines (Efficiency Score, Total Waste Cost). Center area contains a large dual-axis BarChart (Yield vs Waste). Right panel contains AI Insights blocks styled with `border-l-4 border-[#16321F] dark:border-[#D9E96B]`.

## 3. UX flow audit

### Student Role (RSVP / Meal Choice Flow)
- **Step count**: 1 step. Clicking "Opt In" or selecting a dish option instantly triggers the update.
- **Loading-state gaps**: No visual loading spinner during the `fetch('/api/rsvps')` call; relies purely on optimistic UI color changes.
- **Error-handling gaps**: Errors are caught and logged to console (`catch (e) { console.error(e); }`) but there is no rollback of the optimistic UI state or error toast shown to the user if the network fails.
- **Mobile/responsive status**: Highly mobile-first. Utilizes a bottom navigation bar (`fixed bottom-0 w-full z-40 ... md:hidden`). Main content uses `max-w-7xl mx-auto w-full`.

### Staff Role (Receiving Order Flow)
- **Step count**: 3 steps. Click "Receive" on PO -> Modal opens for checklist (Full/Short/Damaged) -> Select radio and enter notes -> Click "Confirm & Receive".
- **Loading-state gaps**: Missing an explicit `isSubmitting` state on the "Confirm & Receive" button; the user could potentially click it multiple times while the `PUT` request is in flight.
- **Error-handling gaps**: The `PUT` and `POST` requests are wrapped in a `try/catch` that logs to console, but the modal proceeds to close and show a success toast regardless of whether the DB update actually succeeded.
- **Mobile/responsive status**: The modal uses `max-w-md w-full` but acts as a center-screen pop-up rather than a mobile-friendly bottom sheet. Uses `sm:grid-cols-2` for layout breaks.

### Manager Role (Publishing Menu)
- **Step count**: 2 steps. Click "Publish Week" -> Toast notification confirms the action.
- **Loading-state gaps**: Lacks a disabled or spinning state on the publish button itself while `isPublishingWeek` is theoretically processed (though it might execute very fast).
- **Error-handling gaps**: The endpoint throws a generic `Failed to publish` error which is caught, but it doesn't parse or display specific validation errors (e.g. missing ingredients) back to the manager.
- **Mobile/responsive status**: The Weekly Menu layout is primarily table-based and often requires horizontal scrolling. It utilizes `grid-cols-1 md:grid-cols-2 gap-6` but struggles on extremely narrow viewports due to dense data requirements.

## 4. Known gaps and inconsistencies
- **Backend-complete features with placeholder/unstyled UI**: `SignIn.tsx` handles role switching and email assignment but remains a raw functional mock without the polished styling seen in the rest of the application.
- **Any UI still showing mocked/static data**: `ManagerSettings.tsx` still partially relies on static arrays for some initial configurations, though it syncs with `dashboard_configs`.
- **Accessibility gaps found directly in markup**: 
  - Missing `aria-label` tags on icon-only buttons (e.g., the Notification Bell in `App.tsx` has a `title` attribute but no ARIA label).
  - Certain text/background combinations in Dark Mode, such as `text-emerald-800` on `bg-[#16321F]/20` in the Reports insights panel, likely fail WCAG AA contrast ratio requirements.
