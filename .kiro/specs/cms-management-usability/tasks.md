# Implementation Plan: CMS Management Usability

## Overview

This plan builds the editor-experience layer bottom-up. First the test tooling is installed, then the framework-free pure-logic modules in `src/lib/admin/` are written together with their property-based tests (fast-check, ≥100 runs, single-execution mode). Next the server actions in `src/app/admin/actions.ts` are refactored onto the `ActionResult` discriminated union, then the shared notification and confirmation infrastructure, then the focused Client Components, and finally each admin module page is wired to those components. Every task that touches Next.js 16 / React 19 APIs (Server Actions, `useActionState`, `useOptimistic`, `router.refresh`, revalidation) must first read the relevant guide in `node_modules/next/dist/docs/` per the workspace AGENTS.md rule.

## Tasks

- [x] 1. Set up test tooling
  - Add `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`, and `fast-check` as dev dependencies (pin exact versions)
  - Create `vitest.config.ts` with `environment: "jsdom"`, globals enabled, and a setup file importing `@testing-library/jest-dom`
  - Add `"test": "vitest"` and `"test:run": "vitest --run"` scripts to `package.json` (property tests must run via single-execution `--run`, never watch)
  - Add a fast-check global config helper or convention setting `numRuns: 100` for property tests
  - _Requirements: supports all property/component testing_

- [x] 2. Build module-search pure logic
  - [x] 2.1 Implement `src/lib/admin/module-search.ts`
    - Implement `flattenModules(groups)`, `searchModules(query, modules)` (empty/whitespace query → `[]`; else case-insensitive substring on label), and `clampQuery(input, max)` (first `max` chars)
    - Consume `ADMIN_NAV_GROUPS` from `nav-config.ts` for the module source
    - _Requirements: 1.1, 1.2, 1.5, 1.6_
  - [x]* 2.2 Write property test for query clamping
    - **Property 1: Module query is clamped to a 100-character prefix**
    - **Validates: Requirements 1.1, 1.6**
  - [x]* 2.3 Write property test for module search matching
    - **Property 2: Module search returns exactly the case-insensitive substring matches**
    - **Validates: Requirements 1.2, 1.5**

- [x] 3. Build list-filter pure logic
  - [x] 3.1 Implement `src/lib/admin/list-filter.ts`
    - Implement `filterItems(items, query, status)`: trimmed case-insensitive title substring AND status equality (`all` = no status constraint); empty query + `all` returns the original list in original order
    - Export `StatusFilter` and `Filterable` types
    - _Requirements: 2.2, 2.4, 2.6_
  - [x]* 3.2 Write property test for list filtering
    - **Property 3: In-list filter is the conjunction of title match and status, with empty/all as identity**
    - **Validates: Requirements 2.2, 2.4, 2.6**

- [x] 4. Build status pure logic
  - [x] 4.1 Implement `src/lib/admin/status.ts`
    - Implement `toggleStatus(current)` inverting `draft`<->`published`; export `PubStatus`
    - _Requirements: 6.2, 6.3_
  - [x]* 4.2 Write property test for status toggle
    - **Property 4: Status toggle inverts and is its own inverse**
    - **Validates: Requirements 6.2, 6.3**

- [x] 5. Build reorder pure logic
  - [x] 5.1 Implement `src/lib/admin/reorder.ts`
    - Implement `move(items, id, dir)` (move one step; out-of-range move returns input unchanged; preserves all other items and the id multiset) and `canMove(index, length, dir)`
    - Export `Orderable` type
    - _Requirements: 8.1, 8.2, 8.3, 8.7_
  - [x]* 5.2 Write property test for reorder movement
    - **Property 8: Reorder moves one step and preserves the rest**
    - **Validates: Requirements 8.1, 8.7**
  - [x]* 5.3 Write property test for reorder boundaries
    - **Property 9: Reorder boundaries are correctly detected**
    - **Validates: Requirements 8.2, 8.3**

- [x] 6. Build bulk pure logic
  - [x] 6.1 Implement `src/lib/admin/bulk.ts`
    - Implement `toggleSelection(set, id)` (reversible membership flip), `applyBulkStatus(records, selectedIds, op)` (set selected records to `published`/`draft`, leave others unchanged), and `summarizeBulk(outcome)` plus the `BulkOutcome` partition contract
    - Export `BulkOutcome`, `BulkRequest`, `BulkResponse` types
    - _Requirements: 7.1, 7.5, 7.7_
  - [x]* 6.2 Write property test for selection toggle
    - **Property 5: Bulk selection toggle is a reversible membership flip**
    - **Validates: Requirements 7.1**
  - [x]* 6.3 Write property test for bulk status application
    - **Property 6: Bulk status application targets exactly the selected records**
    - **Validates: Requirements 7.5**
  - [x]* 6.4 Write property test for bulk outcome partition
    - **Property 7: Bulk outcome partitions the requested ids**
    - **Validates: Requirements 7.7**

- [x] 7. Build list-editor pure logic
  - [x] 7.1 Implement `src/lib/admin/list-editor.ts`
    - Implement `addEntry(entries, raw)` (trim; reject empty/whitespace, >200 chars, duplicate, or >100 entries with the matching reason; else append trimmed value), `removeEntry(entries, index)` (order-preserving), and `serializeEntries(entries)` (JSON array, empties excluded)
    - Export `AddResult`, `MAX_ENTRIES = 100`, `MAX_ENTRY_LEN = 200`
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7_
  - [x]* 7.2 Write property test for adding valid entries
    - **Property 10: Adding a valid entry appends its trimmed value**
    - **Validates: Requirements 9.2**
  - [x]* 7.3 Write property test for rejected entries
    - **Property 11: Rejected entries never mutate the list**
    - **Validates: Requirements 9.3, 9.4, 9.5, 9.1**
  - [x]* 7.4 Write property test for entry removal
    - **Property 12: Removing an entry preserves the order of the remainder**
    - **Validates: Requirements 9.6**
  - [x]* 7.5 Write property test for serialization round-trip
    - **Property 13: List-field serialization round-trips**
    - Use the existing `parseJsonOrLines` from `validation.ts` as the parse side
    - **Validates: Requirements 9.7, 9.8**

- [x] 8. Build json-field and media pure logic
  - [x] 8.1 Implement `src/lib/admin/json-field.ts`
    - Implement `checkJsonField(raw)`: empty → ok; length > 100,000 → `too-long`; non-empty within limit that `JSON.parse` rejects → `malformed`; else ok. Export `MAX_JSON_LEN`
    - _Requirements: 4.4, 4.5_
  - [x]* 8.2 Write property test for JSON field validation
    - **Property 14: JSON field validation classifies content correctly**
    - **Validates: Requirements 4.4, 4.5**
  - [x] 8.3 Implement `src/lib/admin/media.ts`
    - Implement `isImageMime(mime)` returning true iff the string begins with `image/`
    - _Requirements: 12.2_
  - [x]* 8.4 Write property test for image MIME classification
    - **Property 17: Image MIME classification**
    - **Validates: Requirements 12.2**

- [x] 9. Build dirty-detection pure logic
  - [x] 9.1 Implement `src/lib/admin/dirty.ts`
    - Implement `isDirty(baseline, current)`: false when maps are equal, true when any field value differs. Export `FieldMap`
    - _Requirements: 11.1, 11.6_
  - [x]* 9.2 Write property test for dirty detection
    - **Property 16: Dirty detection reflects any divergence from the baseline**
    - **Validates: Requirements 11.1, 11.6**

- [x] 10. Checkpoint - pure logic layer
  - Run `vitest --run` and ensure all property tests pass, ask the user if questions arise.

- [x] 11. Define the ActionResult contract
  - [x] 11.1 Implement `src/lib/admin/action-result.ts`
    - Define the `ActionResult` discriminated union (`ok:true` success with `message`/`module`/`record`; `ok:false, kind:"validation"` with `fieldErrors`/`values`; `ok:false, kind:"error"` with `message`) and the `FieldErrors` type
    - Add helpers to build success/validation/error results, including a helper that turns a Zod `flatten().fieldErrors` plus the submitted `FormData` into a validation result that echoes submitted values exactly
    - _Requirements: 4.1, 4.2, 4.3, 5.1, 5.4_

- [x] 12. Refactor server actions onto ActionResult
  - [x] 12.1 Refactor mutating actions in `src/app/admin/actions.ts`
    - First read `node_modules/next/dist/docs/` guides on Server Actions and cache/revalidation (`updateTag`/`revalidateTag`) before editing
    - Replace `schema.parse(...)` with `schema.safeParse(...)`; on failure return a validation `ActionResult` with `fieldErrors` and echoed `values`; pre-check JSON fields (`case_study`, `meta`, `metadata`) with `checkJsonField`
    - Wrap Supabase calls in try/catch returning `{ ok:false, kind:"error" }` with editor-friendly messages; keep `requireAdmin()` first and convert its/unexpected failures into a generic error result at the boundary
    - Build success messages naming the action, module, and record; keep `updateTag("portfolio")` on success; remove in-place `redirect(...?saved=1)` (retain `redirect` only for new-record navigation)
    - _Requirements: 3.6, 4.1, 4.2, 4.3, 4.6, 5.1, 5.4, 6.6, 8.6_
  - [x] 12.2 Add bulk and status-toggle server actions
    - Read the relevant `node_modules/next/dist/docs/` Server Actions guide before editing
    - Add a status-toggle action (uses `toggleStatus`) and a bulk action that attempts each id independently using `applyBulkStatus`/delete, collects the `succeeded`/`failed` partition, and returns it; persist reorder via the existing adjacent-swap using `move()` to compute new order
    - _Requirements: 6.2, 6.3, 7.5, 7.7, 8.1, 8.4_
  - [x]* 12.3 Write property test for validation value preservation
    - **Property 15: Validation failure preserves submitted values exactly**
    - Drive the validation-result builder with arbitrary submitted field maps
    - **Validates: Requirements 4.1, 4.2**
  - [x]* 12.4 Write integration tests for actions (mocked Supabase)
    - Verify a save returns a success `ActionResult`, a mocked DB error returns `{ ok:false, kind:"error" }`, and a bulk op returns the correct partition
    - _Requirements: 4.3, 4.6, 7.7_

- [x] 13. Build notification and confirmation infrastructure
  - [x] 13.1 Implement `src/lib/admin/notify.ts` over sonner
    - `notify.success` (duration 5000ms, dismiss control), `notify.error` (duration Infinity, destructive style, dismiss control); build messages from `ActionResult`
    - Retire the legacy `?saved=1` path: remove/disable `AdminToastListener` and `AdminStatusBanner` query-param handling
    - _Requirements: 5.1, 5.2, 5.3, 5.4_
  - [x]* 13.2 Write component tests for notifications
    - Assert success auto-dismiss duration, dismiss control, distinct error styling, and persistent error toast
    - _Requirements: 5.2, 5.3, 5.4_
  - [x] 13.3 Implement `ConfirmDialog` and `DeleteButton` in `src/components/admin/`
    - Reusable confirm modal showing the record name with distinct confirm/cancel actions; `DeleteButton` invokes the delete action and fires success/failure toast; supports a bulk-count message variant
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_
  - [x]* 13.4 Write component tests for ConfirmDialog/DeleteButton
    - Assert dialog content, confirm/cancel behavior, success and failure notifications
    - _Requirements: 3.1, 3.3, 3.4, 3.6_

- [x] 14. Build module search UI
  - [x] 14.1 Implement `ModuleSearch` and mount it in `AdminTopbar`
    - Read the `node_modules/next/dist/docs/` guide covering client navigation (`useRouter`/`router.push`) before editing
    - Replace the disabled input with an enabled, debounced search box using `searchModules`/`clampQuery`; render a results dropdown with keyboard select, empty-result message, and 100-char cap; `router.push` on select
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6_
  - [x]* 14.2 Write component tests for ModuleSearch
    - Assert navigation on select and the empty-result message
    - _Requirements: 1.3, 1.4_

- [x] 15. Build list filtering and item UI
  - [x] 15.1 Implement `ListFilterBar` and `FilterableList`
    - `ListFilterBar`: text input (≤200 chars) + status select (only where the module has status), defaulting to "all"
    - `FilterableList`: holds `{query,status}` state, renders filtered `ListItemRow`s via `filterItems`, shows a no-match message that retains inputs, owns bulk selection state via `toggleSelection`, and preserves filter state across `router.refresh()`
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 8.7_
  - [x] 15.2 Implement `ListItemRow`
    - Renders one record and hosts `StatusToggle`, `ReorderControls`, `DeleteButton`, and a bulk-selection checkbox as applicable to the module
    - _Requirements: 3.1, 6.1, 7.1, 8.1_
  - [x]* 15.3 Write component tests for filtering UI
    - Assert filter renders, default `all`, and the no-match message retaining inputs
    - _Requirements: 2.1, 2.3, 2.5_

- [x] 16. Build status toggle and reorder controls
  - [x] 16.1 Implement `StatusToggle`
    - Read the `node_modules/next/dist/docs/` React 19 guide on `useOptimistic` and the cache/`router.refresh` guide before editing
    - Optimistic publish/unpublish, disabled while pending, revert + error toast on failure, success toast naming the new status
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6_
  - [x]* 16.2 Write component tests for StatusToggle
    - Assert toggle display, optimistic update, disabled-while-pending, and rollback on failure
    - _Requirements: 6.1, 6.4, 6.5, 6.6_
  - [x] 16.3 Implement `ReorderControls`
    - Read the `node_modules/next/dist/docs/` guides on `useOptimistic` and `router.refresh` before editing
    - Up/down buttons disabled at boundaries (`canMove`); optimistic reorder via `move`, calls the reorder action then `router.refresh()`; success/failure toast with ≥3s duration; preserves active filter
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7_
  - [x]* 16.4 Write tests for reorder behavior
    - Component: boundary disabling and rollback; integration: persistence and notification duration
    - _Requirements: 8.4, 8.5, 8.6_

- [x] 17. Build bulk action bar
  - [x] 17.1 Implement `BulkActionBar`
    - Read the `node_modules/next/dist/docs/` guide on invoking Server Actions from Client Components before editing
    - Shown only when ≥1 selected; displays selected count; delete / publish / unpublish (publish/unpublish only where module has status); bulk delete routes through `ConfirmDialog` stating the exact count; reports succeeded/failed counts via notification (≥3s)
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 7.8_
  - [x]* 17.2 Write component tests for BulkActionBar
    - Assert bar visibility, selected count, confirm count, cancel retains selection, and success/partial-failure counts
    - _Requirements: 7.2, 7.3, 7.4, 7.6, 7.8_

- [x] 18. Checkpoint - actions and list-level UI
  - Run `vitest --run` and ensure all tests pass, ask the user if questions arise.

- [x] 19. Build editor form, field error, and unsaved-changes guard
  - [x] 19.1 Implement `EditorForm` and `FieldError`
    - Read the `node_modules/next/dist/docs/` React 19 guide on `useActionState` (and `useFormStatus`) before editing
    - `EditorForm` wraps create/edit forms with `useActionState`, renders `FieldError`s adjacent to rejected fields, re-seeds inputs from `state.values`, shows pending/disabled controls, fires success toast (and optional navigate on create), and hosts the guard
    - `FieldError` renders a field-level validation message naming the field and reason
    - _Requirements: 4.1, 4.2, 4.3, 4.6, 5.1, 5.5_
  - [x] 19.2 Implement `UnsavedChangesGuard`
    - Read the `node_modules/next/dist/docs/` guide on client navigation/interception before editing
    - Tracks dirty state via `isDirty`; intercepts in-app navigation and `beforeunload` with a discard/cancel prompt; resets on successful save; keeps dirty on failed save
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6, 11.7_
  - [x]* 19.3 Write component tests for EditorForm and guard
    - Assert validation errors + preserved values, success toast, pending/disabled control, nav-guard prompt, discard/cancel, beforeunload, and failed-save dirty retention
    - _Requirements: 4.1, 4.2, 4.6, 5.5, 11.2, 11.3, 11.4, 11.5, 11.7_

- [x] 20. Build list editor and preview UI
  - [x] 20.1 Implement `ListEditor`
    - Structured array-field editor (add/remove discrete entries) using `addEntry`/`removeEntry`/`serializeEntries`; inline add errors (empty/too-long/duplicate/max); serializes to a hidden input; seeds from stored values in order
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7, 9.8_
  - [x]* 20.2 Write component tests for ListEditor
    - Assert inline rejection messages and order-preserving add/remove rendering
    - _Requirements: 9.3, 9.4, 9.5, 9.6_
  - [x] 20.3 Implement `PreviewPane`
    - Live preview from current form values; formats structured (array/JSON) fields rather than raw text/markup; gracefully indicates empty/invalid fields without a raw error screen
    - _Requirements: 10.1, 10.2, 10.3, 10.4_
  - [x]* 20.4 Write component tests for PreviewPane
    - Assert live update, formatted structured fields, and graceful invalid/empty handling
    - _Requirements: 10.2, 10.3, 10.4_

- [x] 21. Build media preview UI
  - [x] 21.1 Implement `MediaThumb` and `MediaUrlPreview`
    - `MediaThumb`: 150×150 thumbnail for image MIME (via `isImageMime`) preserving aspect ratio, type placeholder otherwise, placeholder on error or 10s timeout
    - `MediaUrlPreview`: debounced (500ms) live preview of the typed URL, no preview when empty, placeholder on error or 10s timeout
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 12.6_
  - [x]* 21.2 Write component tests for media preview
    - Assert thumbnail vs placeholder, debounced url preview, empty → no preview, and error/timeout placeholder
    - _Requirements: 12.1, 12.3, 12.4, 12.5, 12.6_

- [x] 22. Wire Projects and Experiences modules
  - Read the `node_modules/next/dist/docs/` guides on Server Actions and `router.refresh`/revalidation before editing the pages
  - Replace `AdminListCard` usage with `FilterableList`/`ListItemRow` (text+status filter, status toggle, reorder, bulk delete/publish/unpublish); wrap editor pages with `EditorForm` + `ListEditor` (stack/bullets/tags) + `PreviewPane` + `UnsavedChangesGuard`; route deletes through `ConfirmDialog`
  - _Requirements: 2.1, 3.5, 4.1, 6.1, 7.1, 8.1, 9.1, 10.1, 11.1_

- [x] 23. Wire Education and Sections modules
  - Read the `node_modules/next/dist/docs/` guides on Server Actions and revalidation before editing the pages
  - Education: text-only filter, reorder, `ListEditor` (bullets), `PreviewPane`, `EditorForm` + guard, confirmed delete (no status toggle/filter)
  - Sections: status toggle, `ListEditor` (marquee/stats/nav), `PreviewPane`, `EditorForm` + guard, confirmed delete
  - _Requirements: 2.1, 3.5, 6.1, 9.1, 10.1, 11.1_

- [x] 24. Wire Skills, Guestbook, and Media modules
  - Read the `node_modules/next/dist/docs/` guides on Server Actions and revalidation before editing the pages
  - Skills/Skill groups: reorder (groups) + confirmed delete via `EditorForm`/`ConfirmDialog`
  - Guestbook: bulk delete + confirmed single delete (moderation status excluded from toggle/filter)
  - Media: text-only filter, `MediaThumb` in the list, `MediaUrlPreview` in the editor form, confirmed delete
  - _Requirements: 3.5, 7.1, 8.1, 12.1_

- [x] 25. Wire Profile, SEO, and Loader editor forms
  - Read the `node_modules/next/dist/docs/` guide on `useActionState` before editing the pages
  - Wrap remaining editor forms (Profile, SEO settings/pages, Loader) with `EditorForm` + `UnsavedChangesGuard`; Profile gets `PreviewPane`; SEO pages get status filter/toggle where applicable and confirmed delete
  - _Requirements: 3.5, 4.1, 5.1, 10.1, 11.1_

- [x] 26. Final checkpoint - full verification
  - Run `vitest --run` and the project build; ensure all property, component, and integration tests pass; ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional test sub-tasks and can be skipped for a faster MVP; core implementation sub-tasks are never optional.
- Property tests use fast-check with `numRuns: 100` (minimum 100 iterations) and run in single-execution mode (`vitest --run`), never watch mode. Each carries a `// Feature: cms-management-usability, Property {n}` comment.
- The pure logic layer (tasks 2–9) is built first so the 17 correctness properties are validated before any UI depends on them.
- Every task touching Next.js 16 / React 19 APIs explicitly references reading `node_modules/next/dist/docs/` first, per AGENTS.md.
- Each task references specific requirement clauses for traceability; checkpoints provide incremental validation.

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1"] },
    { "id": 1, "tasks": ["2.1", "3.1", "4.1", "5.1", "6.1", "7.1", "8.1", "8.3", "9.1"] },
    { "id": 2, "tasks": ["2.2", "2.3", "3.2", "4.2", "5.2", "5.3", "6.2", "6.3", "6.4", "7.2", "7.3", "7.4", "7.5", "8.2", "8.4", "9.2"] },
    { "id": 3, "tasks": ["11.1"] },
    { "id": 4, "tasks": ["12.1", "12.2"] },
    { "id": 5, "tasks": ["12.3", "12.4", "13.1", "13.3"] },
    { "id": 6, "tasks": ["13.2", "13.4", "14.1", "15.1", "16.1", "16.3", "17.1", "19.1", "19.2", "20.1", "20.3", "21.1"] },
    { "id": 7, "tasks": ["14.2", "15.2", "16.2", "16.4", "17.2", "19.3", "20.2", "20.4", "21.2"] },
    { "id": 8, "tasks": ["15.3"] },
    { "id": 9, "tasks": ["22"] },
    { "id": 10, "tasks": ["23"] },
    { "id": 11, "tasks": ["24"] },
    { "id": 12, "tasks": ["25"] }
  ]
}
```
