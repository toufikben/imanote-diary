# Project TODO

- [x] Create custom floral Imanote app icon and configure all required launcher and splash assets.
- [x] Implement a decorative, name-free floral launch screen inspired by the supplied video.
- [x] Create local-first domain models for diary memories, recorded audio metadata, app settings, and privacy state.
- [x] Implement secure first-launch PIN or password creation and lock-screen validation.
- [x] Persist diary entries and settings locally without any cloud account or remote repository.
- [x] Build typed diary entry creation, reading, editing, and deletion flows.
- [x] Build on-device voice recording and playback attached to diary entries.
- [x] Add selectable typography options and persist a preferred font.
- [x] Add feminine floral pink and masculine solid dark themes.
- [x] Add Arabic RTL, French, and English user interface localization.
- [x] Build the home, memory list, memory detail, editor, settings, and theme-selection interfaces.
- [x] Provide local search or date-based browsing for saved diary entries.
- [x] Write deterministic unit tests for storage, lock validation, and localization behaviors.
- [x] Check static typing, test the primary local flows, and refine the mobile interface.
- [x] Create one final project checkpoint for delivery; do not publish or push code to GitHub.
- [ ] Confirm microphone permission, voice recording, and SecureStore behavior in Expo Go on a physical device.
- [x] Add persistent private photo attachments to diary memories, including safe local file cleanup.
- [x] Add a monthly calendar interface to browse memories by date.
- [x] Add password-encrypted local backup export through the system share sheet.
- [x] Add password-encrypted local backup import with validation and merge/replace confirmation.
- [x] Test the new image, calendar, and backup behaviors.
- [x] Create a new publish-ready checkpoint.
- [x] Refine the feminine floral pink theme with distinct decorative styling.
- [x] Refine the masculine dark theme with solid, high-contrast visual language.
- [x] Add more visible in-app typography choices and font previews.
- [x] Add a small, original wolf accent to an appropriate diary interface page.
- [x] Validate the refined visual system.
- [x] Save a new publish-ready checkpoint.
- [x] Add local default and per-memory font-size controls.
- [x] Add local default and per-memory line-spacing controls.
- [x] Add varied paper-style diary backgrounds with a clear selector.
- [x] Apply typography and paper choices consistently in editing and reading interfaces.
- [x] Test the typography and paper-background experience.
- [x] Save a new publish-ready checkpoint.
- [x] Define a small curated sticker library appropriate to both diary themes.
- [x] Persist selected stickers locally with each diary memory and validate stored sticker identifiers.
- [x] Add sticker selection, removal, and decorated rendering in the editor and memory reader.
- [x] Test sticker persistence.
- [x] Save a new publish-ready checkpoint.
- [x] Rename the approved empty repository to toufikben/imanote-diary.
- [x] Add a GitHub Actions workflow that validates the mobile app and starts an Android APK build on each main-branch push.
- [x] Document secure configuration of the EXPO_TOKEN repository secret without storing it in project files.
- [x] Upload the current Imanote diary project to the renamed private repository.
- [x] Verify the uploaded workflow and explain automatic build status and APK retrieval.
- [x] Correct the GitHub Actions secret condition that prevented the first workflow run from creating jobs.
- [x] Remove the pnpm-version conflict that blocked GitHub Actions dependency setup.
- [x] Add persisted daily-reminder preferences and safe normalization for existing local settings and backups.
- [x] Implement permission-aware scheduling, rescheduling, and cancellation of a recurring on-device notification.
- [x] Add Arabic, French, and English reminder controls to the settings screen.
- [x] Test reminder preference normalization and the project checks, then save a publish-ready checkpoint.
- [x] Verify whether the latest GitHub Actions workflow produced an Android APK or AAB artifact.
- [x] Prepare an automatic GitHub Actions workflow that requests both preview APK and production AAB builds after EXPO_TOKEN is configured.
- [x] Validate the dual-build workflow configuration locally before requesting GitHub upload approval.
- [x] Save a checkpoint containing the validated dual-build workflow before requesting GitHub upload approval.
- [x] Review the locally completed but unpushed changes and obtain approval for their exact upload scope.
- [x] Repair the missing Expo/EAS project linkage that prevents automated APK and AAB requests.
- [x] Validate the non-interactive EAS linking configuration before uploading the repair.
- [x] Save a checkpoint for the validated EAS-linking repair before requesting upload approval.
- [x] Correct the Expo account identifier to the account authorized by the configured EXPO_TOKEN.
- [x] Validate the corrected EAS account configuration before uploading it.
- [x] Save a checkpoint for the corrected Expo account identifier before requesting upload approval.
- [x] Add the EAS project ID generated for the dynamic Expo configuration so automated builds can proceed.
- [x] Validate the EAS project-ID configuration before uploading it.
- [x] Save a checkpoint for the validated EAS project-ID configuration before requesting upload approval.
- [x] Keep the PIN lock-screen title as “Private Diary” in Arabic, French, and English.
- [x] Verify the fixed PIN-screen title with TypeScript and change-scope checks.
- [x] Save a checkpoint and upload the approved fixed-title change to GitHub.
- [x] Change the PIN and password lock-screen title to Imanote in all languages.
- [x] Add an original wolf option to the diary sticker library while retaining the existing wolf accent.
- [x] Test the Imanote lock-screen title and wolf sticker with TypeScript and regression checks.
- [x] Save a checkpoint for the tested Imanote title and wolf sticker before requesting upload approval.
- [x] Add a small playful wolf that peeks from behind the PIN/password entry area without exposing entered characters.
- [x] Add subtle input-driven wolf motion while preserving accessible, stable lock-screen controls.
- [x] Test the animated lock-screen wolf and save a checkpoint before requesting upload approval.
- [ ] Verify the latest GitHub Actions run and report the availability of the APK and AAB builds.
- [x] Upload the approved Imanote lock title, wolf sticker, and count-only animated lock-screen wolf to GitHub.
- [x] Verify the automated Android validation and build requests started from the uploaded improvements.
- [x] Reconcile the diverged GitHub main history with the approved local improvements before upload.
- [x] Define a private local mood-tag model with a compact, inclusive set of moods.
- [x] Add a multilingual mood-tag selector to the diary editor and persist the chosen mood with each entry.
- [x] Display the selected mood tag in diary cards and the detailed reading view.
- [x] Validate mood-tag data in local storage and encrypted backup import/export, with regression tests.
- [x] Test the mood-tag feature and save a checkpoint before requesting GitHub upload approval.
- [x] Move the editor save action lower in the screen while retaining safe touch spacing from the bottom edge.
- [x] Verify the adjusted save action layout and save a checkpoint before requesting GitHub upload approval.
- [x] Prepare a prioritized, privacy-first roadmap of potential Imanote improvements without implementing unapproved features.
- [x] Research and prepare a numbered, comprehensive innovation catalogue for Imanote without implementing unapproved features.
- [x] Replace the hiding lock-screen wolf with a small rotating, walking wolf beside the PIN and password controls.
- [x] Implement local discovery features: full-screen photo viewing, favourites, search, filters, and memory resurfacing.
- [x] Implement local writing and creative features: prompts, templates, drafts, folders, handwriting/drawing, and visual customisation.
- [x] Add local writing prompts, reusable templates, optional folders, and saveable drafts.
- [x] Add a local handwriting and drawing pad stored with each diary entry and included in encrypted backup validation.
- [x] Add a local multilingual ink-color selector that persists with each memory, colors new handwriting strokes, and remains safe in encrypted backups.
- [ ] Implement local reflection features: intensity and energy choices, gratitude, weekly/monthly private summaries, and gentle routines.
- [ ] Implement local privacy and reliability features: biometric unlock, configurable auto-lock, discreet app switching, readable export, and backup integrity checks.
- [ ] Document and request a separate decision before enabling capabilities that require sensitive permissions, external processing, or cross-device sync.
- [ ] Test each delivered development batch and save a recovery checkpoint before requesting GitHub upload approval.
- [x] Add on-device wellbeing insights: mood totals, weekly mood chart, gratitude prompts, entry totals, active-day insight, and writing streak.
- [x] Add on-device privacy and reliability controls: biometric unlock, configurable auto-lock, discreet reminder content, and confirmed secure local wipe.
- [x] Verify the completed local feature batches and save a recovery checkpoint.
- [ ] Upload all approved local feature batches to GitHub main, excluding sensitive/external features, and verify the resulting Android build requests.
- [x] Fix the editor voice-record control so it remains visible and reachable above bottom safe-area and tab-bar space.
- [x] Prepare an Android Google Play submission package with listing copy, privacy/data-safety notes, release checklist, and asset requirements without adding sensitive or external features.
- [x] Configure EAS production build-version management so each Android App Bundle can receive a non-duplicate version code for Play testing or release.
- [x] Verify the recording-control fix, save a recovery checkpoint, and upload the approved local-only release preparation to GitHub main.
- [x] Add local lock-result sounds: a short wolf howl after a fully accepted PIN/password and a gentle sad sound only after a fully rejected attempt.
- [x] Add a persisted sound-effects mute control and verify that no sound is emitted for individual PIN digits.
- [x] Add a brief wolf-howl animation after a successful complete unlock and a gentle sad animation after a rejected complete attempt, with no partial-PIN response.
- [x] Add a subtle, short-lived eye glow only during the successful wolf-howl animation after a complete accepted unlock.
- [x] Add a brief drooping-and-trembling ear motion only after a complete rejected PIN or password attempt, with no partial-PIN response.
- [x] Slow the rejected-attempt ear motion slightly for a more natural, restrained sad reaction.
- [x] Audit Android permissions, Expo plugins, and permission texts against implemented microphone, photo, notification, and biometric features; remove any unnecessary permissions.
- [x] Audit and repair the GitHub Actions workflow so each push to main validates the project and requests both preview APK and production AAB builds.
- [x] Correct the GitHub Actions Vitest argument separator so the validation job runs with the intended single-fork settings before Android build requests.
- [x] Verify the permission/build audit, save a recovery checkpoint, and upload all approved local updates to GitHub main.
- [x] Confirm the latest production AAB build status and provide the Google Play release handoff steps without submitting to the store.
- [x] Verify Google Play Console developer-account readiness and access for Private Diary.
- [x] Create the Google Play Console application record for Private Diary with the confirmed name, package identifier, language, and free pricing.
- [x] Prepare the Play Console store listing and mandatory app-information declarations.
- [x] Create a public privacy-policy page and in-app link for the Private Diary Google Play listing; public availability awaits owner publication.
- [x] Publish and verify the public privacy-policy URL required by Google Play Console.
- [x] Save the verified public privacy-policy URL in Google Play Console.
- [x] Add the confirmed public support email to the Google Play store listing contact details.
- [x] Research and document privacy-aligned monetization options before adding ads, payments, or external SDKs.
- [x] Confirm that the first release is fully free and contains no ads, billing, payments, analytics, or external SDKs.
- [x] Confirm the internal-testing release track for the verified AAB; production publication remains separately unapproved.
- [x] Complete the Play Console store listing and mandatory declarations for the free ad-free release.
- [x] Save Google Play reviewer access instructions for the local PIN, password, and optional biometric lock.
- [x] Declare and save that the first free release contains no advertisements.
- [x] Complete and save the IARC content-rating questionnaire with the approved all-ages ratings.
- [x] Save the target audience declaration as 18 and over without applying the optional minor-access block.
- [x] Save the data-safety declaration: no data collection and no data sharing in the first local-only release.
- [x] Save the declaration that Private Diary is not a government application.
- [x] Save the declaration that the first free release provides no financial features.
- [x] Save the declaration that the first free release provides no health features.
- [x] Prepare and upload the 512×512 Google Play store icon asset.
- [ ] Upload the approved AAB and configure the internal testing release.
- [x] Complete the AAB upload, create the production release, and send Private Diary 1.0.0 for Google Play review after explicit owner confirmation.
- [x] Set the production release availability to all countries and regions after owner confirmation.
- [x] Confirm that Managed publishing is disabled so the approved production release publishes automatically.
- [x] Prepare and save Arabic and French localized Google Play store listings for Private Diary.
- [x] Capture and prepare Arabic and French Google Play phone screenshots for Private Diary.
- [x] Capture and prepare Arabic and French diary-editor Google Play screenshots.
- [ ] Verify GitHub and Google Play upload status, then upload only after explicit confirmation.
- [x] Save a checkpoint after the approved screenshot and upload updates.

تمت إضافة هذه المهام بتاريخ 2026-08-15 استجابة لطلب تجهيز لقطات محرر المذكرات والتحقق من الرفع.
- [x] Skip uploading the optional Arabic/French diary-editor screenshots to Google Play after the manual file-picker blocker; keep the prepared assets in the project for a future listing update.

قرار 2026-08-15: تم تجاوز الرفع الإضافي لأن اللقطات المحلية السابقة موجودة، بينما لقطتا المحرر محفوظتان داخل المشروع كأصول اختيارية مستقبلية.
- [x] Check the current Google Play production review status and prepare, but do not submit, the next-update draft.
- [x] Push the latest approved project changes to GitHub main after verification.
- [x] Re-check the current Google Play review status and report whether production approval is complete.


# Lock Screen Overhaul — 2026-08-15
- [x] Redesign PrivacyGate with a large local wolf illustration and a visible girl background layer.
- [x] Add local-first walking, playful, jump, happy, sad, and success-howl wolf reactions tied to PIN input.
- [x] Add separate local happy, sad, and long howl audio feedback without external runtime dependencies.
- [x] Fix PIN/password setup layout so the Save/Create button remains visible above the bottom safe area.
- [x] Validate the redesigned lock screen with TypeScript, tests, and a visual preview; save a recovery checkpoint.
- [ ] Push the approved lock-screen redesign to GitHub main after verification.


# Wolf Motion Refinement — 2026-08-15
- [x] Smooth the wolf's walking-to-jump-to-landing transitions without changing PIN privacy or feedback behavior.
- [x] Validate the refined animation with TypeScript, tests, and visual preview; save a recovery checkpoint.


# Real Wolf Audio Replacement — 2026-08-15
- [x] Replace current lock-screen audio with realistic, locally bundled wolf recordings after license verification.
- [x] Keep happy response, sad response, and long success howl mapped to the existing PIN outcomes.
- [ ] Validate audio assets, TypeScript, tests, and lock-screen playback; save a recovery checkpoint.


# GitHub Upload and AAB Test Build — 2026-08-15
- [ ] Review the current diff and exclude secrets, generated files, and sensitive local data.
- [ ] Push the approved realistic wolf audio changes and documentation to GitHub main.
- [ ] Trigger the configured GitHub Actions production AAB test build.
- [ ] Verify the workflow run status and report the AAB artifact or current build state.


# Google Play Update Upload — 2026-08-15
- [ ] Check whether the latest GitHub Actions AAB request has completed and locate the build artifact.
- [ ] Review version code, package identifier, signing, and release notes before store upload.
- [ ] Upload the approved AAB to the appropriate Google Play release draft without publishing it automatically.
- [ ] Confirm the Play Console release status and provide the final publish step to the owner.


# Version Update and Dedication — 2026-08-20
- [x] Check whether the dedication and contact details already exist in the app before adding them.
- [x] Increase the app version and Android version code for the next release.
- [x] Add the requested dedication and contact details to the appropriate About/support screen.
- [x] Run TypeScript and tests, update release notes, and verify no sensitive value is exposed unintentionally.
- [ ] Save a checkpoint and prepare the new AAB build request; do not push to GitHub without explicit confirmation.


# Remove Wolf Audio — 2026-08-20
- [x] Remove all wolf sound playback from the PIN screen, including happy, sad, and long howl sounds.
- [x] Keep the wolf's visual animations and PIN feedback behavior working without audio dependencies.
- [x] Validate TypeScript and tests, then save a recovery checkpoint.


# Dedication Decoration — 2026-08-20
- [x] Rewrite the dedication with a soft floral tone and highlight “رفيقة دربي إيمان”.
- [x] Add restrained floral decoration to the dedication card while preserving RTL and translations.
- [x] Validate the card layout and language strings, then save a recovery checkpoint.


# Contact Review and Play Upload Preparation — 2026-08-20
- [x] Review the two email addresses and WhatsApp number in the in-app dedication/support card for exactness and formatting.
- [x] Check whether the same contact details appear in the Google Play store listing or developer profile and flag any public exposure.
- [ ] Verify version 1.0.1, package identifier, version code, release notes, and AAB readiness.
- [ ] Prepare the Google Play release draft without submitting it for review or publishing it.
