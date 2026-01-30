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

## Notes and Workarounds (Global)

-

## Recommendations (Optional)

-
