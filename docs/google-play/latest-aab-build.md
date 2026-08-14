# Latest Android App Bundle request

GitHub Actions run `31787528070` completed its validation and successfully requested the production Android App Bundle on 2026-08-14.

- Expo build ID: `3b443a5a-88a0-4e95-9a80-e509b305ef4b`
- Build page: https://expo.dev/accounts/toufikben2s-team/projects/imanote-diary/builds/3b443a5a-88a0-4e95-9a80-e509b305ef4b
- Intended use: download the completed production `.aab` from Expo and upload it manually to the Google Play Console testing or production track.

The GitHub workflow only requests the EAS build. It does not submit the application to Google Play.

## Status note

The production build was verified as **Finished** on 2026-08-14. It uses profile `production`, Expo SDK `54.0.0`, app version `1.0.0`, and Android version code `4`. The build took 9 minutes 58 seconds, and its artifact remains available for 29 days from the completion date.

- Direct AAB artifact: https://expo.dev/artifacts/eas/GGt9FO4dFCEZOwS4-Nq9nuzxY5JLzPASDNgPmkGumcE.aab
- Build status: Finished
- Commit: `b66951f`
- Use: upload this `.aab` to the intended release track in Google Play Console; do not install it directly on a phone, because `.aab` is a Play Store publishing package rather than an installable APK.
