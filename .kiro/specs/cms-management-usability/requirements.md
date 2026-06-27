# Requirements Document

## Introduction

This feature improves the usability and management efficiency of the existing Supabase-backed admin CMS in the my-portfolio-v3 application (`src/app/admin/`). The CMS lets a single administrator manage portfolio content across many modules: Projects, Experiences, Skills, Education, Sections, Guestbook, Media, Profile, SEO, and Loader.

The current implementation works but creates friction for day-to-day editing: the module search box is disabled, content lists have no search or status filter, deletes happen instantly with no confirmation, validation and database errors surface as raw error screens, success feedback is generic, reordering requires one full page reload per step, status changes require opening the full edit form, and there are no bulk actions. This feature reduces that friction and makes the CMS faster and safer to operate.

The goal is editor-experience improvements only. It does not change the data model, the public portfolio site, or the authentication mechanism, except where a small additive column is required to support a capability.

## Glossary

- **CMS**: The admin content management interface served under `/admin/dashboard`, accessible only to authenticated admin users.
- **Editor**: The authenticated admin user who manages portfolio content through the CMS.
- **Module**: A content area of the CMS reachable from the sidebar navigation (Projects, Experiences, Skills, Education, Sections, Guestbook, Media, Profile, SEO, Loader, Dashboard).
- **Content_List**: A CMS page that displays multiple records of one module as a list of cards (for example the Projects list or Experiences list).
- **List_Item**: A single record displayed within a Content_List.
- **Editor_Form**: The create or edit form for a single record within a module.
- **Module_Search**: The search control in the top bar used to find and navigate to a Module.
- **List_Filter**: The in-page control set used to narrow a Content_List by text query and by publication status.
- **Publication_Status**: The state of a record, either `draft` or `published`.
- **Delete_Confirmation**: An explicit confirmation step required before a destructive delete is executed.
- **Bulk_Selection**: The mechanism for selecting multiple List_Items at once.
- **Bulk_Action**: An operation applied to all currently selected List_Items in a single request (delete, publish, or unpublish).
- **Status_Toggle**: A control on a List_Item that switches its Publication_Status directly from the Content_List.
- **Reorder_Control**: The control used to change the display order (`sort_order`) of List_Items within a module.
- **List_Editor**: A structured input control for editing array-of-string fields (such as stack, bullets, tags) as discrete entries instead of raw text.
- **Notification**: A transient, non-blocking on-screen message that reports the outcome of an Editor action.
- **Validation_Error**: A field-level message that explains why submitted input was rejected.
- **Unsaved_Changes_Guard**: The mechanism that warns the Editor before navigating away from an Editor_Form that contains unsaved edits.
- **Media_Asset**: A record in the Media module representing an image or file referenced by its public URL and metadata.

## Requirements

### Requirement 1: Module quick search and navigation

**User Story:** As an Editor, I want a working search box that jumps to any module, so that I can navigate the CMS without scanning the sidebar.

#### Acceptance Criteria

1. THE Module_Search SHALL be enabled and accept text input of 1 to 100 characters on every CMS page.
2. WHEN the Editor types a query of 1 or more characters into the Module_Search, THE CMS SHALL display within 1 second the list of Modules whose label contains the query as a substring, matched case-insensitively.
3. WHEN the Editor selects a Module from the Module_Search results, THE CMS SHALL navigate to that Module's page within 1 second.
4. WHEN the Module_Search query matches no Module label, THE CMS SHALL display an empty-result message within the Module_Search results within 1 second.
5. WHILE the Module_Search query is empty, THE CMS SHALL display no Module_Search results.
6. IF the Editor attempts to enter more than 100 characters into the Module_Search, THEN THE CMS SHALL retain only the first 100 characters and ignore the additional input.

### Requirement 2: In-list search and status filtering

**User Story:** As an Editor, I want to search and filter the records inside a module, so that I can find a specific item without reading the whole list.

#### Acceptance Criteria

1. THE Content_List for Projects, Experiences, Education, and Media SHALL display a List_Filter that accepts a text query of up to 200 characters.
2. WHEN the Editor enters a text query in the List_Filter, THE Content_List SHALL, within 500 milliseconds, display only the List_Items whose title text contains the text query after leading and trailing whitespace is trimmed, matched case-insensitively.
3. WHERE a module's records have a Publication_Status, THE List_Filter SHALL provide options to show all records, only `draft` records, or only `published` records, defaulting to the show-all-records option.
4. WHEN the Editor selects a Publication_Status option in the List_Filter, THE Content_List SHALL, within 500 milliseconds, display only the List_Items that both contain the active text query in their title text and whose Publication_Status equals the selected option.
5. IF a List_Filter text query and Publication_Status combination matches no records, THEN THE Content_List SHALL display a message indicating that no records match the active filter while retaining the entered text query and the selected Publication_Status option.
6. WHEN the Editor clears the List_Filter text query and resets the Publication_Status option to the show-all-records option, THE Content_List SHALL display all List_Items of the module.

### Requirement 3: Delete confirmation

**User Story:** As an Editor, I want to confirm before a record is deleted, so that I do not lose content from an accidental click.

#### Acceptance Criteria

1. WHEN the Editor activates a delete control on a List_Item, THE CMS SHALL present a Delete_Confirmation that displays the record's title or display name and provides a distinct confirm action and a distinct cancel action.
2. WHEN the Editor confirms the Delete_Confirmation, THE CMS SHALL delete the identified record and remove it from the List_Item view.
3. WHEN the CMS completes a confirmed deletion, THE CMS SHALL display a Notification, within 2 seconds of the deletion completing, that identifies the deleted record by its title or display name.
4. WHEN the Editor cancels the Delete_Confirmation, THE CMS SHALL retain the record unchanged and close the Delete_Confirmation.
5. THE CMS SHALL require an explicit confirmation through the Delete_Confirmation before executing any delete of a Project, Experience, Skill, Skill group, Education entry, Section, Media_Asset, SEO page, or Guestbook message.
6. IF a confirmed deletion fails to complete, THEN THE CMS SHALL retain the record unchanged and display a Notification indicating that the deletion did not succeed.

### Requirement 4: Inline validation and friendly error feedback

**User Story:** As an Editor, I want to see clear error messages on the form when my input is rejected, so that I can fix mistakes without leaving the page or seeing a crash screen.

#### Acceptance Criteria

1. WHEN the Editor submits an Editor_Form with input that fails validation, THE CMS SHALL, within 2 seconds, re-display the same Editor_Form without navigating away and display a Validation_Error adjacent to each rejected field, where each Validation_Error states the field name and the reason for rejection.
2. WHEN the Editor submits an Editor_Form with input that fails validation, THE CMS SHALL preserve every value the Editor entered in all fields of the Editor_Form, including the rejected fields, exactly as entered.
3. IF a save operation fails because of a database or server error, THEN THE CMS SHALL, within 5 seconds, display a Notification stating that the save failed, SHALL keep the Editor on the same Editor_Form without navigating away, and SHALL preserve every value the Editor entered exactly as entered.
4. WHEN a field expecting JSON content receives content that is not parseable as valid JSON, THE CMS SHALL display a Validation_Error adjacent to that field identifying the field by name and indicating that the JSON is malformed, and SHALL NOT submit the record.
5. WHEN a field expecting JSON content receives content exceeding 100,000 characters, THE CMS SHALL display a Validation_Error adjacent to that field indicating the maximum length is exceeded, and SHALL NOT submit the record.
6. WHEN every field of a submitted Editor_Form passes validation, THE CMS SHALL save the record and, within 5 seconds, display a Notification stating that the save succeeded.

### Requirement 5: Consistent and descriptive action notifications

**User Story:** As an Editor, I want clear feedback after every action, so that I know whether my change was applied and to what.

#### Acceptance Criteria

1. WHEN a create, update, delete, reorder, or status-change action completes successfully, THE CMS SHALL display a Notification that states the action performed, names the affected Module, and identifies the affected record.
2. WHEN a success Notification has been displayed for 5 seconds, THE CMS SHALL dismiss it automatically.
3. THE CMS SHALL provide a control on each Notification that, when activated by the Editor, dismisses that Notification immediately.
4. IF an action fails, THEN THE CMS SHALL display a Notification that describes the failure, is rendered in a visual style distinct from a success Notification, and remains visible until the Editor dismisses it.
5. WHILE an Editor_Form or Content_List action request is in progress, THE CMS SHALL display a pending indicator on the control that initiated the request and SHALL disable that control until the request completes.

### Requirement 6: Quick status toggle from the list

**User Story:** As an Editor, I want to publish or unpublish a record directly from the list, so that I do not have to open the full edit form for a single status change.

#### Acceptance Criteria

1. WHERE a module's records have a Publication_Status, THE Content_List SHALL display a Status_Toggle on each List_Item that visually indicates whether the current Publication_Status is `published` or `draft`.
2. WHEN the Editor activates the Status_Toggle on a `published` List_Item, THE CMS SHALL set that record's Publication_Status to `draft`.
3. WHEN the Editor activates the Status_Toggle on a `draft` List_Item, THE CMS SHALL set that record's Publication_Status to `published`.
4. WHEN a Status_Toggle change completes successfully, THE CMS SHALL update the displayed Publication_Status on the List_Item within 2 seconds and report the change through a Notification indicating the new Publication_Status.
5. WHILE a Status_Toggle change is in progress, THE CMS SHALL disable further activation of that List_Item's Status_Toggle until the change completes or fails.
6. IF a Status_Toggle change fails, THEN THE CMS SHALL retain the record's previous Publication_Status, restore the Status_Toggle to display that previous Publication_Status, and report through a Notification indicating that the status change failed.

### Requirement 7: Bulk selection and bulk actions

**User Story:** As an Editor, I want to select multiple records and act on them at once, so that I can manage large lists efficiently.

#### Acceptance Criteria

1. THE Content_List for Projects, Experiences, and Guestbook SHALL provide a Bulk_Selection control on each List_Item that toggles between selected and unselected states.
2. WHEN one or more List_Items are selected, THE Content_List SHALL display a Bulk_Action set applicable to the module, and SHALL display a count of the currently selected List_Items.
3. WHEN the Editor invokes a bulk delete on the selected List_Items, THE CMS SHALL present a Delete_Confirmation that states the exact number of records to be deleted and SHALL NOT delete any record until the Editor confirms.
4. IF the Editor cancels or dismisses the Delete_Confirmation, THEN THE CMS SHALL retain all selected List_Items unchanged and SHALL close the Delete_Confirmation.
5. WHERE the selected module supports Publication_Status, THE Bulk_Action set SHALL include publish and unpublish operations that apply the chosen Publication_Status to all selected List_Items.
6. WHEN a Bulk_Action completes with all selected List_Items succeeding, THE CMS SHALL display a Notification stating the number of records affected for a minimum of 3 seconds.
7. IF a Bulk_Action completes with one or more selected List_Items failing, THEN THE CMS SHALL retain the unchanged state of the failed List_Items, SHALL apply the action to the succeeding List_Items, and SHALL display a Notification stating the number of records that succeeded and the number that failed.
8. WHILE no List_Item is selected, THE Content_List SHALL NOT display the Bulk_Action set.

### Requirement 8: Efficient reordering

**User Story:** As an Editor, I want reordering to be quick and give clear feedback, so that arranging long lists is not tedious.

#### Acceptance Criteria

1. THE Reorder_Control on a List_Item SHALL allow moving the item one position earlier and one position later within its module ordering.
2. WHEN a List_Item is at the first position, THE CMS SHALL disable the control that moves it earlier.
3. WHEN a List_Item is at the last position, THE CMS SHALL disable the control that moves it later.
4. WHEN the Editor performs a reorder, THE CMS SHALL persist the new ordering within 2 seconds.
5. WHEN the CMS persists the new ordering, THE CMS SHALL display a Notification confirming completion that remains visible for at least 3 seconds.
6. IF persisting the new ordering fails, THEN THE CMS SHALL retain the previous ordering and display a Notification indicating that the reorder did not complete.
7. WHEN the Editor performs a reorder, THE CMS SHALL preserve the active List_Filter query and status selection in the displayed Content_List.

### Requirement 9: Structured editing of list fields

**User Story:** As an Editor, I want to edit list fields as separate entries, so that I do not have to format raw text or JSON by hand.

#### Acceptance Criteria

1. WHERE an Editor_Form field stores an array of strings (stack, bullets, or tags), THE Editor_Form SHALL provide a List_Editor that displays each existing entry as a discrete, editable item, supporting up to 100 entries.
2. WHEN the Editor adds an entry in the List_Editor, THE CMS SHALL trim leading and trailing whitespace from the entry and append it to the field's value.
3. IF the Editor attempts to add an entry that is empty or contains only whitespace, THEN THE CMS SHALL reject the entry, leave the field's value unchanged, and indicate that empty entries are not allowed.
4. IF the Editor attempts to add an entry whose trimmed length exceeds 200 characters, THEN THE CMS SHALL reject the entry, leave the field's value unchanged, and indicate that the maximum entry length is exceeded.
5. IF the Editor attempts to add an entry that, after trimming, duplicates an existing entry in the same List_Editor, THEN THE CMS SHALL reject the entry, leave the field's value unchanged, and indicate that duplicate entries are not allowed.
6. WHEN the Editor removes an entry in the List_Editor, THE CMS SHALL remove that entry from the field's value and preserve the order of the remaining entries.
7. WHEN the Editor saves an Editor_Form containing a List_Editor, THE CMS SHALL store the entries as an array of strings, in their displayed order, with empty entries excluded.
8. WHEN an existing record with array field values is opened in the Editor_Form, THE List_Editor SHALL display one editable item per stored value, preserving their stored order.

### Requirement 10: Content preview

**User Story:** As an Editor, I want to preview content before publishing, so that I can confirm it looks correct without leaving the CMS.

#### Acceptance Criteria

1. WHERE a module renders content on the public site (Projects, Experiences, Education, Sections, Profile), THE Editor_Form SHALL display, within the same page as the form, a preview of the record rendered from the current form values.
2. WHEN the Editor changes a previewable field in the Editor_Form, THE preview SHALL render the updated value within 1 second without persisting the record.
3. THE preview SHALL render structured fields (array-of-string fields and JSON fields) as formatted content and SHALL NOT display their raw JSON text or raw markup.
4. IF a previewable field is empty or contains malformed content for a structured field, THEN THE preview SHALL render the remaining previewable fields and SHALL indicate that the affected field is empty or invalid, without displaying a raw error screen.

### Requirement 11: Unsaved changes protection

**User Story:** As an Editor, I want to be warned before discarding unsaved edits, so that I do not lose work by navigating away.

#### Acceptance Criteria

1. THE Unsaved_Changes_Guard SHALL treat an Editor_Form as having unsaved changes WHILE at least one editable field value differs from the value held at the last successful save or, if no save has occurred, from the value present when the Editor_Form was opened.
2. WHILE an Editor_Form has unsaved changes, WHEN the Editor initiates navigation away from the Editor_Form, THE Unsaved_Changes_Guard SHALL display a confirmation prompt presenting a discard option and a cancel option, and SHALL prevent the navigation from completing until the Editor selects one of these options.
3. WHEN the Editor selects the discard option in the confirmation prompt, THE CMS SHALL discard the unsaved changes and complete the navigation.
4. WHEN the Editor selects the cancel option in the confirmation prompt, THE CMS SHALL keep the Editor on the Editor_Form with all unsaved changes intact and SHALL not perform the navigation.
5. WHILE an Editor_Form has unsaved changes, WHEN the Editor triggers a browser-level navigation such as a page refresh or tab or window close, THE Unsaved_Changes_Guard SHALL present a confirmation prompt that allows the Editor to remain on the Editor_Form.
6. WHEN an Editor_Form is saved successfully, THE Unsaved_Changes_Guard SHALL treat the Editor_Form as having no unsaved changes.
7. IF a save of the Editor_Form fails, THEN THE Unsaved_Changes_Guard SHALL continue to treat the Editor_Form as having unsaved changes and THE CMS SHALL display an indication that the save did not complete while retaining the entered field values.

### Requirement 12: Media preview

**User Story:** As an Editor, I want to see image thumbnails in the media library, so that I can identify assets visually instead of reading paths.

#### Acceptance Criteria

1. WHERE a Media_Asset has an image MIME type, THE Media module SHALL display a thumbnail rendered from the asset's public URL at a fixed size of 150 by 150 pixels, preserving aspect ratio.
2. WHERE a Media_Asset has a non-image MIME type, THE Media module SHALL display a type-indicating placeholder in place of a thumbnail.
3. IF a Media_Asset's image does not finish loading from its public URL within 10 seconds, or the load returns an error, THEN THE Media module SHALL display a placeholder in place of the thumbnail and SHALL retain the asset's record without modification.
4. WHEN the Editor stops typing in the public URL field of the Media Editor_Form for an image asset for 500 milliseconds, THE Media module SHALL display a preview of the image at that URL at a fixed size of 150 by 150 pixels, preserving aspect ratio.
5. IF the public URL field in the Media Editor_Form is empty, THEN THE Media module SHALL display no preview.
6. IF the image at the public URL entered in the Media Editor_Form does not finish loading within 10 seconds, or the load returns an error, THEN THE Media module SHALL display a placeholder in place of the preview.
