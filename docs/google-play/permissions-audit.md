# Permission Audit — Private Diary

> **Scope:** This document records the Android permissions and configuration plugins used by the current local-first release. It is a release-review aid, not a replacement for inspecting the generated App Bundle in Google Play Console.

| Capability | Android permission or configuration | When it is requested | Why it is necessary |
|---|---|---|---|
| Voice memories | `RECORD_AUDIO`; `expo-audio` | Only when the person starts recording | Record a diary voice note locally on the device. |
| Photo attachments | `expo-image-picker` | Only when the person chooses an attachment | Let the person select an image for a diary entry. The app does not include a camera capture flow. |
| Daily reminders | `POST_NOTIFICATIONS`; `expo-notifications` | Only when reminders are enabled | Deliver the chosen local reminder time. The private-reminder mode uses generic notification text. |
| Biometric unlock | `expo-local-authentication` | Only when biometric unlock is enabled or invoked | Ask the operating system to authenticate the device owner. Biometric data never enters the app. |
| Lock credentials | `expo-secure-store` | No Android runtime prompt | Store the local PIN/password verifier using the device secure storage. |
| Local backup and file sharing | `expo-document-picker`, `expo-file-system`, `expo-sharing` | Only when importing, exporting, or sharing a backup | Allow user-directed encrypted backup import/export. |

## Not requested

The release does **not** request location, contacts, camera capture, Bluetooth, SMS, account sign-in, cloud-sync, or background-location permissions. Photo access is limited to the system selection flow triggered by the person; selected content stays on the device unless the person explicitly exports an encrypted local backup.

## Build verification

The repository contains `.github/workflows/android-build.yml`. On each push to `main`, it installs dependencies, checks TypeScript, runs the single-worker test suite, then—when the repository `EXPO_TOKEN` secret is configured—requests two EAS Android builds in parallel:

| EAS profile | Deliverable | Intended use |
|---|---|---|
| `preview` | APK | Direct device testing and internal distribution. |
| `production` | AAB | Upload to Google Play Console. |

The production EAS profile uses automatic Android build-version management so every new App Bundle receives a non-duplicate version code.
