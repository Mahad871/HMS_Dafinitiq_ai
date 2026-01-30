
# Issues and Workarounds Tracker

Use this document to record issues found and solutions implemented while bringing the platform to a fully working state.
This template follows the assessment requirements from the project PDF.

## Severity Levels

- **Critical**: Exploitable security issues, data loss, or system-wide failure.
- **High**: Major broken functionality, auth failures, or severe performance problems.
- **Medium**: Incorrect behavior or reliability issues with limited impact.
- **Low**: Minor bugs, UI inconsistencies, or non-blocking improvements.

## Issue Log (Quick View)

| ID | Severity | Area | Type | Description | Impact | Workaround | Fix Summary | Files Changed | Status | Date |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| HF-001 | Medium | Frontend | Bug | Analytics link visible to patients in Navbar | Patients could access analytics page incorrectly | N/A | Changed Navbar so only doctors see analytics link | task/frontend/src/components/Navbar.tsx | Fixed | 2026-01-30 |
| HF-002 | High | Backend | Security | Chat actions lack participant checks | Any authed user can mark/read or send messages in other chats | N/A | Enforce participant checks for chat actions | task/backend/src/controllers/chatController.ts | Fixed | 2026-01-30 |
| HF-003 | Medium | Backend | Security | Chat creation does not verify appointment relationship | Patients can create chats with any doctor | N/A | Require a valid appointment between patient and doctor | task/backend/src/controllers/chatController.ts | Fixed | 2026-01-30 |
| HF-004 | Medium | Frontend | TypeScript | Duplicate identifier `getHealthTips` in AIHealthAssistant | Build fails in Vite React Babel | N/A | Renamed/removed duplicate declaration to resolve build error | task/frontend/src/pages/AIHealthAssistant.tsx | Fixed | 2026-01-30 |
| HF-005 | High | Backend | TypeScript | Null/incorrectly typed populated appointment in doctorController | Backend fails to compile and crashes on startup | N/A | Added null/type guards before accessing populated patient/doctor fields | task/backend/src/controllers/doctorController.ts | Fixed | 2026-01-30 |
| HF-006 | High | Backend | TypeScript | Possible null patient/doctor in appointmentController | Backend fails to compile and crashes on startup | N/A | Added null checks before emailing and return 404 if missing | task/backend/src/controllers/appointmentController.ts | Fixed | 2026-01-30 |
| HF-007 | High | Frontend | Bug | TDZ error calling fetchAppointments before initialization in DoctorDashboard | Doctor dashboard crashes on render | N/A | Wrapped fetchAppointments in useCallback and moved effect dependency to avoid TDZ | task/frontend/src/pages/DoctorDashboard.tsx | Fixed | 2026-01-30 |
| HF-008 | High | Frontend | Bug | doctorService.getAppointments returned array instead of object | Doctor dashboard crashed on `appointments.map` | N/A | Return response data object and default to empty array | task/frontend/src/services/doctorService.ts; task/frontend/src/pages/DoctorDashboard.tsx | Fixed | 2026-01-30 |
| HF-009 | Medium | Backend | Config | dotenv not loaded before passport config | Google OAuth always reported as not configured | N/A | Load dotenv in passport config before checking env vars | task/backend/src/config/passport.ts | Fixed | 2026-01-30 |
| HF-010 | High | Backend | Config | Gemini model `gemini-pro` not available | AI endpoints fail with 404 from Gemini API | N/A | Switch to stable model `gemini-2.5-flash` in service | task/backend/src/services/geminiService.ts | Fixed | 2026-01-30 |
| HF-011 | Medium | Frontend | Bug | Login button stuck in loading state on failed auth | User cannot retry login without refresh | N/A | Reset loading state in a `finally` block | task/frontend/src/pages/Login.tsx | Fixed | 2026-01-30 |
| HF-012 | High | Frontend | Bug | Doctor users not visible because no doctor profile created | Patients see empty doctor list | N/A | Collect doctor profile fields on signup and create profile after register | task/frontend/src/pages/Register.tsx | Fixed | 2026-01-30 |
| HF-013 | High | Frontend | Performance | Doctor list API called on every render | Rate limit triggered on backend | N/A | Memoize fetch and add effect dependencies | task/frontend/src/pages/Home.tsx | Fixed | 2026-01-30 |
| HF-014 | Low | Frontend | UI/UX | Doctor signup inputs lacked suggestions and currency picker | Harder data entry during doctor signup | N/A | Added datalist suggestions and searchable currency input | task/frontend/src/pages/Register.tsx | Fixed | 2026-01-30 |
| HF-015 | Medium | Frontend | Bug | Doctor dashboard status changes not reflected without refresh | Users see stale appointment statuses | N/A | Update appointment status in local state after API success | task/frontend/src/pages/DoctorDashboard.tsx | Fixed | 2026-01-30 |
| HF-016 | Medium | Frontend | Bug | Analytics charts not rendering reliably | Analytics cards/charts show blank or incorrect data | N/A | Fix effect deps and add safe defaults for analytics datasets | task/frontend/src/pages/Analytics.tsx | Fixed | 2026-01-30 |
| HF-017 | Low | Frontend | UI/UX | Pie chart labels overlap in analytics | Chart labels are unreadable | N/A | Replace inline labels with legend | task/frontend/src/pages/Analytics.tsx | Fixed | 2026-01-30 |
| HF-018 | Medium | Frontend | UX | Doctor dashboard tabs have no loading feedback | Users unsure if filter change is working | N/A | Trigger loading when switching filters | task/frontend/src/pages/DoctorDashboard.tsx | Fixed | 2026-01-30 |
| HF-019 | Medium | Frontend | UX | Notifications panel cannot be closed easily | Dropdown stays open and blocks UI | N/A | Add close button and click-outside handler | task/frontend/src/components/NotificationBell.tsx | Fixed | 2026-01-30 |
| HF-031 | Medium | Frontend | UI/UX | Navbar not responsive on mobile | Navigation links not accessible on small screens | N/A | Add mobile menu toggle and collapsible links | task/frontend/src/components/Navbar.tsx | Fixed | 2026-01-30 |
| HF-032 | Low | Frontend | UI/UX | AI Assistant tabs overflow on mobile | Tabs and content wrap poorly on small screens | N/A | Make tabs grid-based and adjust spacing/text sizes | task/frontend/src/pages/AIHealthAssistant.tsx | Fixed | 2026-01-30 |
| HF-033 | Low | Docs | Formatting | Issues table formatting broken by blank lines | Table renders incorrectly in Markdown | N/A | Remove blank lines within table block | ISSUES_AND_WORKAROUNDS.md | Fixed | 2026-01-30 |
| HF-034 | Low | Frontend | UI/UX | Notifications dropdown overflows on mobile | Panel goes off-screen and is hard to use | N/A | Make dropdown width responsive and center on small screens | task/frontend/src/components/NotificationBell.tsx | Fixed | 2026-01-30 |
| HF-020 | Critical | Backend | Security | Role escalation allowed on registration | Users can register as admin | N/A | Restrict registration roles to patient/doctor | task/backend/src/controllers/authController.ts | Fixed | 2026-01-30 |
| HF-021 | High | Backend | Security | CORS allows any origin with credentials | Cross-origin abuse risk | N/A | Restrict CORS to allowed origins list | task/backend/src/server.ts | Fixed | 2026-01-30 |
| HF-022 | Medium | Backend | Config | Global rate limiter throttles auth and core APIs | Users get 429s during normal use | N/A | Split auth and general API rate limits | task/backend/src/server.ts | Fixed | 2026-01-30 |
| HF-023 | Medium | Backend | Security | Error responses expose raw error objects | Internal details leak to clients | N/A | Remove raw error objects and hide stack in prod | task/backend/src/controllers/*; task/backend/src/server.ts | Fixed | 2026-01-30 |
| HF-024 | Medium | Backend | Security | S3 uploads set public-read ACL by default | Public exposure or blocked by BPA | N/A | Remove public-read ACL from uploads | task/backend/src/services/s3Service.ts | Fixed | 2026-01-30 |
| HF-025 | High | Backend | Security | File delete endpoint lacks ownership checks | Any authed user can delete files | N/A | Namespace uploads by user and validate delete ownership | task/backend/src/controllers/uploadController.ts | Fixed | 2026-01-30 |
| HF-026 | Medium | Backend | Security | Session secret fallback + MemoryStore | Insecure for production use | N/A | Require SESSION_SECRET in prod and use MongoStore | task/backend/src/server.ts; task/backend/package.json | Fixed | 2026-01-30 |
| HF-027 | High | Backend | Data Integrity | Appointment booking not atomic | Double-booking possible under race conditions | N/A | Add partial unique index + handle duplicates | task/backend/src/models/Appointment.ts; task/backend/src/controllers/appointmentController.ts | Fixed | 2026-01-30 |
| HF-028 | Medium | Backend | Validation | Appointment status update accepts any string | Invalid statuses can be stored | N/A | Validate status against AppointmentStatus enum | task/backend/src/controllers/doctorController.ts | Fixed | 2026-01-30 |
| HF-029 | Medium | Backend | Bug/Performance | Patient analytics totalSpent uses N+1 queries and may undercount | Incorrect totals and slow analytics | N/A | Aggregate totalSpent with lookup; avoid N+1 | task/backend/src/controllers/analyticsController.ts | Fixed | 2026-01-30 |
| HF-030 | Low | Backend | Performance | Artificial delay in appointment creation | Unnecessary latency in booking flow | N/A | Remove artificial delay | task/backend/src/controllers/appointmentController.ts | Fixed | 2026-01-30 |
Suggested values:

- **Area**: Backend, Frontend, API, Auth, DB, AI, DevOps
- **Type**: Security, Bug, TypeScript, Performance, API, UI, Config
- **Status**: Open, In Progress, Fixed, Won't Fix

## Detailed Entries (One per issue)

### Issue HF-004

- Severity: Medium
- Area: Frontend
- Type: TypeScript
- What was wrong: `getHealthTips` was declared more than once in `AIHealthAssistant.tsx`, causing a build-time identifier redeclaration error.
- Impact: Frontend build failed with `[plugin:vite:react-babel] Identifier 'getHealthTips' has already been declared`.
- Workaround (if any): None.
- Fix implemented: Removed or renamed the duplicate `getHealthTips` declaration to ensure a single definition.
- Files changed: `task/frontend/src/pages/AIHealthAssistant.tsx`
- Testing evidence: Vite dev server builds without the duplicate identifier error.
- Date resolved: 2026-01-30

---

### Issue HF-005

- Severity: High
- Area: Backend
- Type: TypeScript
- What was wrong: `populatedAppointment` could be null and populated `patient`/`doctor` fields were typed as ObjectId, causing TS errors when accessing `email`/`name`.
- Impact: Backend failed to compile and crashed on startup (ts-node TypeScript errors).
- Workaround (if any): None.
- Fix implemented: Added null and type guards before using populated fields; only send email when valid data is present.
- Files changed: `task/backend/src/controllers/doctorController.ts`
- Testing evidence: TypeScript compilation proceeds without the reported errors.
- Date resolved: 2026-01-30

---

### Issue HF-006

- Severity: High
- Area: Backend
- Type: TypeScript
- What was wrong: `patient` and `doctor` could be null after lookup, causing TS18047 errors when accessing `email`/`name`.
- Impact: Backend failed to compile and crashed on startup (ts-node TypeScript errors).
- Workaround (if any): None.
- Fix implemented: Added null checks for doctor/patient and return a 404 if either is missing before sending emails.
- Files changed: `task/backend/src/controllers/appointmentController.ts`
- Testing evidence: TypeScript compilation proceeds without the reported errors.
- Date resolved: 2026-01-30

---

### Issue HF-007

- Severity: High
- Area: Frontend
- Type: Bug
- What was wrong: `fetchAppointments` was referenced in the `useEffect` dependency array before its initialization, triggering a TDZ ReferenceError.
- Impact: Doctor dashboard crashed on render (`Cannot access 'fetchAppointments' before initialization`).
- Workaround (if any): None.
- Fix implemented: Wrapped `fetchAppointments` in `useCallback` and used it as the effect dependency after definition.
- Files changed: `task/frontend/src/pages/DoctorDashboard.tsx`
- Testing evidence: Page renders without the ReferenceError.
- Date resolved: 2026-01-30

---

### Issue HF-008

- Severity: High
- Area: Frontend
- Type: Bug
- What was wrong: `doctorService.getAppointments` returned an array but callers expected an object with `appointments`, causing `appointments` to be undefined.
- Impact: Doctor dashboard crashed on render (`Cannot read properties of undefined (reading 'map')`).
- Workaround (if any): None.
- Fix implemented: Return the response data object and default to an empty array when setting state.
- Files changed: `task/frontend/src/services/doctorService.ts`, `task/frontend/src/pages/DoctorDashboard.tsx`
- Testing evidence: Doctor dashboard renders and lists appointments without the `map` error.
- Date resolved: 2026-01-30

---

### Issue HF-009

- Severity: Medium
- Area: Backend
- Type: Config
- What was wrong: `passport` config ran before `.env` was loaded, so `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET` were undefined.
- Impact: Backend always logged "Google OAuth not configured" even when env vars existed.
- Workaround (if any): None.
- Fix implemented: Call `dotenv.config()` in `task/backend/src/config/passport.ts` before checking env vars.
- Files changed: `task/backend/src/config/passport.ts`
- Testing evidence: Startup log no longer shows the Google OAuth warning when env vars are set.
- Date resolved: 2026-01-30

---

### Issue HF-010

- Severity: High
- Area: Backend
- Type: Config
- What was wrong: Service requested `gemini-pro`, which is no longer available for the `generateContent` API.
- Impact: AI endpoints failed with `404 Not Found` from Gemini.
- Workaround (if any): None.
- Fix implemented: Switched to a stable Gemini model (`gemini-2.5-flash`) in the service without requiring a new env var.
- Files changed: `task/backend/src/services/geminiService.ts`
- Testing evidence: Gemini requests succeed when a valid `GEMINI_API_KEY` is set.
- Date resolved: 2026-01-30

---

### Issue HF-011

- Severity: Medium
- Area: Frontend
- Type: Bug
- What was wrong: On failed login, `loading` was never reset, leaving the button stuck on "Logging in...".
- Impact: User could not retry login without refreshing the page.
- Workaround (if any): Refresh page.
- Fix implemented: Move `setLoading(false)` into a `finally` block so it runs on success or failure.
- Files changed: `task/frontend/src/pages/Login.tsx`
- Testing evidence: After a failed login, the button returns to "Login" and is clickable.
- Date resolved: 2026-01-30

---

### Issue HF-012

- Severity: High
- Area: Frontend
- Type: Bug
- What was wrong: Signing up as a doctor only created a `User`, but the app lists doctors from the `Doctor` collection, so no doctors appeared.
- Impact: Patients could not see doctor accounts created via signup.
- Workaround (if any): Manually call `POST /api/doctors/profile` after signup.
- Fix implemented: Added doctor profile fields to the signup form and created the doctor profile after successful registration.
- Files changed: `task/frontend/src/pages/Register.tsx`
- Testing evidence: New doctor signups appear in the doctors list after registration.
- Date resolved: 2026-01-30

---

### Issue HF-013

- Severity: High
- Area: Frontend
- Type: Performance
- What was wrong: The doctors list was fetched on every render because `useEffect` had no dependency array.
- Impact: Backend rate limits were triggered due to repeated API calls.
- Workaround (if any): None.
- Fix implemented: Wrapped fetch in `useCallback` and added proper dependencies so it only runs when specialization changes.
- Files changed: `task/frontend/src/pages/Home.tsx`
- Testing evidence: Network shows a single call on load and on specialization change only.
- Date resolved: 2026-01-30

---

### Issue HF-014

- Severity: Low
- Area: Frontend
- Type: UI/UX
- What was wrong: Doctor signup fields had plain inputs with no suggestions or currency selector.
- Impact: Slower, error‑prone data entry for specialization/qualification and fee.
- Workaround (if any): Manual typing.
- Fix implemented: Added datalist suggestions for specialization/qualification and a searchable currency input next to fee.
- Files changed: `task/frontend/src/pages/Register.tsx`
- Testing evidence: Signup shows suggestion dropdowns and currency picker for doctors.
- Date resolved: 2026-01-30

---

### Issue HF-015

- Severity: Medium
- Area: Frontend
- Type: Bug
- What was wrong: After status updates, the UI did not update the appointment list until a page refresh.
- Impact: Doctors saw stale statuses after confirming/completing appointments.
- Workaround (if any): Refresh the page.
- Fix implemented: Optimistically update the appointment status in local state after a successful API call.
- Files changed: `task/frontend/src/pages/DoctorDashboard.tsx`
- Testing evidence: Status badge updates immediately after clicking Confirm/Complete.
- Date resolved: 2026-01-30

---

### Issue HF-016

- Severity: Medium
- Area: Frontend
- Type: Bug
- What was wrong: Analytics fetch ran on every render and charts assumed data always existed, leading to blank/incorrect renders.
- Impact: Analytics cards/charts did not display properly.
- Workaround (if any): Refresh page.
- Fix implemented: Added effect dependencies, safe defaults, normalized status data, and fallback counts from appointments when needed.
- Files changed: `task/frontend/src/pages/Analytics.tsx`
- Testing evidence: Charts render consistently once data loads.
- Date resolved: 2026-01-30

---

### Issue HF-017

- Severity: Low
- Area: Frontend
- Type: UI/UX
- What was wrong: Pie chart labels overlapped and were hard to read.
- Impact: Analytics chart text was cluttered.
- Workaround (if any): None.
- Fix implemented: Added a corner legend with hover highlighting and dimming of non-active slices.
- Files changed: `task/frontend/src/pages/Analytics.tsx`
- Testing evidence: Pie chart labels no longer overlap.
- Date resolved: 2026-01-30

---

### Issue HF-002

- Severity: High
- Area: Backend
- Type: Security
- What was wrong: `sendMessage` and `markMessagesAsRead` do not verify the requester is a chat participant.
- Impact: Any authenticated user can interact with arbitrary chats if they know the chat ID.
- Workaround (if any): None.
- Fix implemented: Added participant checks before sending messages or marking reads.
- Files changed: `task/backend/src/controllers/chatController.ts`
- Testing evidence: Non-participants receive 403 on chat actions.
- Date resolved: 2026-01-30

---

### Issue HF-003

- Severity: Medium
- Area: Backend
- Type: Security
- What was wrong: `createChat` does not verify a valid appointment between patient and doctor.
- Impact: Patients can create unsolicited chats with any doctor ID.
- Workaround (if any): None.
- Fix implemented: Require a valid appointment between patient and doctor before creating a chat.
- Files changed: `task/backend/src/controllers/chatController.ts`
- Testing evidence: Chat creation is rejected without a matching appointment.
- Date resolved: 2026-01-30

---

### Issue HF-027

- Severity: High
- Area: Backend
- Type: Data Integrity
- What was wrong: Appointment booking checks availability then creates a record without an atomic constraint.
- Impact: The same time slot can be double-booked under concurrent requests.
- Workaround (if any): None.
- Fix implemented: Added a partial unique index and handled duplicate key errors.
- Files changed: `task/backend/src/controllers/appointmentController.ts`, `task/backend/src/models/Appointment.ts`
- Testing evidence: Concurrent duplicate bookings return 400.
- Date resolved: 2026-01-30

---

### Issue HF-028

- Severity: Medium
- Area: Backend
- Type: Validation
- What was wrong: Status updates accept any string and do not validate against `AppointmentStatus`.
- Impact: Invalid statuses can be saved and break UI assumptions.
- Workaround (if any): None.
- Fix implemented: Validate status against `AppointmentStatus` before updating.
- Files changed: `task/backend/src/controllers/doctorController.ts`
- Testing evidence: Invalid status updates return 400.
- Date resolved: 2026-01-30

---

### Issue HF-029

- Severity: Medium
- Area: Backend
- Type: Bug/Performance
- What was wrong: Patient analytics totals compute `Doctor.findOne` per appointment and may miss matches when doctor is populated.
- Impact: Incorrect totals and slower analytics due to N+1 queries.
- Workaround (if any): None.
- Fix implemented: Aggregate totalSpent with a lookup and use countDocuments for completed appointments.
- Files changed: `task/backend/src/controllers/analyticsController.ts`
- Testing evidence: totalSpent matches expected and query count is reduced.
- Date resolved: 2026-01-30

---

### Issue HF-030

- Severity: Low
- Area: Backend
- Type: Performance
- What was wrong: Artificial `setTimeout(100)` in appointment creation adds latency.
- Impact: Slower booking flow without functional benefit.
- Workaround (if any): None.
- Fix implemented: Removed the artificial delay.
- Files changed: `task/backend/src/controllers/appointmentController.ts`
- Testing evidence: Booking responds immediately without extra delay.
- Date resolved: 2026-01-30

---

### Issue HF-018

- Severity: Medium
- Area: Frontend
- Type: UX
- What was wrong: Switching tabs on Doctor Dashboard didn't show loading state.
- Impact: Users had no feedback while filtered appointments were loading.
- Workaround (if any): Wait or refresh.
- Fix implemented: Set loading state immediately when filter changes.
- Files changed: `task/frontend/src/pages/DoctorDashboard.tsx`
- Testing evidence: Spinner appears briefly when switching filters.
- Date resolved: 2026-01-30

---

### Issue HF-019

- Severity: Medium
- Area: Frontend
- Type: UX
- What was wrong: Notification dropdown lacked a close button and did not close on outside click.
- Impact: Dropdown could obstruct UI.
- Workaround (if any): Reload page.
- Fix implemented: Added close button and click-outside handler.
- Files changed: `task/frontend/src/components/NotificationBell.tsx`
- Testing evidence: Dropdown closes via close button or outside click.
- Date resolved: 2026-01-30

---

### Issue HF-031

- Severity: Medium
- Area: Frontend
- Type: UI/UX
- What was wrong: Navbar lacked a mobile layout and links were hidden on small screens.
- Impact: Mobile users could not access navigation links.
- Workaround (if any): None.
- Fix implemented: Added hamburger toggle and a mobile nav panel with all links.
- Files changed: `task/frontend/src/components/Navbar.tsx`
- Testing evidence: Menu opens/closes on mobile and links are accessible.
- Date resolved: 2026-01-30

---

### Issue HF-032

- Severity: Low
- Area: Frontend
- Type: UI/UX
- What was wrong: AI Assistant tab bar and text did not fit on mobile screens.
- Impact: Tabs overflowed and content was hard to use on small screens.
- Workaround (if any): None.
- Fix implemented: Converted tabs to a responsive grid and reduced text/icon sizes on mobile.
- Files changed: `task/frontend/src/pages/AIHealthAssistant.tsx`
- Testing evidence: Tabs fit within the viewport on mobile.
- Date resolved: 2026-01-30

---

### Issue HF-033

- Severity: Low
- Area: Docs
- Type: Formatting
- What was wrong: Extra blank lines inside the issues table broke Markdown table rendering.
- Impact: Table appeared split or misaligned.
- Workaround (if any): None.
- Fix implemented: Removed blank lines within the table block.
- Files changed: `ISSUES_AND_WORKAROUNDS.md`
- Testing evidence: Table renders as a single continuous Markdown table.
- Date resolved: 2026-01-30

---

### Issue HF-034

- Severity: Low
- Area: Frontend
- Type: UI/UX
- What was wrong: Notifications dropdown was positioned with a fixed width and right offset, causing overflow on mobile.
- Impact: Notification panel went off-screen and was hard to read.
- Workaround (if any): None.
- Fix implemented: Made dropdown width responsive and centered it on small screens.
- Files changed: `task/frontend/src/components/NotificationBell.tsx`
- Testing evidence: Notification panel stays within the viewport on mobile.
- Date resolved: 2026-01-30

### Issue HF-020

- Severity: Critical
- Area: Backend
- Type: Security
- What was wrong: Registration accepts any `role`, including `admin`, without server-side restriction.
- Impact: Users can self-register with elevated privileges.
- Workaround (if any): None.
- Fix implemented: Restrict allowed roles to patient/doctor and default invalid roles to patient.
- Files changed: `task/backend/src/controllers/authController.ts`
- Testing evidence: Registering with `admin` is rejected or defaults to patient.
- Date resolved: 2026-01-30

---

### Issue HF-021

- Severity: High
- Area: Backend
- Type: Security
- What was wrong: CORS is configured with `origin: '*'` and `credentials: true`.
- Impact: Cross-origin requests can be abused; browsers also block credentialed requests with wildcard origins.
- Workaround (if any): None.
- Fix implemented: Restrict CORS to an allowed-origins list from env.
- Files changed: `task/backend/src/server.ts`
- Testing evidence: Requests from non-allowed origins are blocked.
- Date resolved: 2026-01-30

---

### Issue HF-022

- Severity: Medium
- Area: Backend
- Type: Config
- What was wrong: Global rate limiter applies to all routes, including auth and analytics.
- Impact: Users hit 429 during normal usage (login, page refreshes).
- Workaround (if any): Wait for window reset.
- Fix implemented: Split auth and general API rate limits and skip auth in the general limiter.
- Files changed: `task/backend/src/server.ts`
- Testing evidence: Normal login flows no longer hit 429 as quickly.
- Date resolved: 2026-01-30

---

### Issue HF-023

- Severity: Medium
- Area: Backend
- Type: Security
- What was wrong: Several controllers return raw error objects in responses.
- Impact: Internal stack traces or error details can be exposed to clients.
- Workaround (if any): None.
- Fix implemented: Remove raw error objects from responses and hide stack traces in production.
- Files changed: `task/backend/src/controllers/*`, `task/backend/src/server.ts`
- Testing evidence: 500 responses no longer include raw error details.
- Date resolved: 2026-01-30

---

### Issue HF-024

- Severity: Medium
- Area: Backend
- Type: Security
- What was wrong: S3 uploads set `ACL: 'public-read'` by default.
- Impact: Files can become publicly accessible or fail if Block Public Access is enabled.
- Workaround (if any): None.
- Fix implemented: Removed public-read ACL from uploads.
- Files changed: `task/backend/src/services/s3Service.ts`
- Testing evidence: Uploaded objects are not forced public via ACL.
- Date resolved: 2026-01-30

---

### Issue HF-025

- Severity: High
- Area: Backend
- Type: Security
- What was wrong: File delete endpoint accepts any `fileUrl` without ownership checks.
- Impact: Any authenticated user can delete arbitrary files if they know the URL.
- Workaround (if any): None.
- Fix implemented: Namespaced uploads by user ID and validate ownership before delete.
- Files changed: `task/backend/src/controllers/uploadController.ts`
- Testing evidence: Delete requests for files outside user namespace return 403.
- Date resolved: 2026-01-30

---

### Issue HF-026

- Severity: Medium
- Area: Backend
- Type: Security
- What was wrong: Session secret falls back to a hardcoded value and uses default MemoryStore.
- Impact: Insecure session handling in production.
- Workaround (if any): None.
- Fix implemented: Require SESSION_SECRET in production and use MongoStore when MONGODB_URI is available.
- Files changed: `task/backend/src/server.ts`, `task/backend/package.json`
- Testing evidence: Server throws on missing SESSION_SECRET in production; sessions use MongoStore.
- Date resolved: 2026-01-30

---

## Notes and Workarounds (Global)

-

## Recommendations (Optional)

-
