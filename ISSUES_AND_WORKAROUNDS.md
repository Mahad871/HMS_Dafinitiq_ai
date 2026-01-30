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

## Notes and Workarounds (Global)

-

## Recommendations (Optional)

-
