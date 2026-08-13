# Automatic Android Builds

Every push to the `main` branch runs type checks and tests. Once the Expo credential is configured, the same push requests two Android builds from Expo: an installable APK using the `preview` profile and a production AAB using the `production` profile.

## One-time secure setup

1. In Expo, create a personal access token for the account that owns the diary project.
2. In GitHub, open **Settings → Secrets and variables → Actions → New repository secret**.
3. Create a secret named `EXPO_TOKEN`, paste the Expo token, and save it. Do not put the token in source code, commits, issues, or chat messages.
4. Run one Android build through Expo first if prompted. This initial setup creates the Android signing credentials and links the project to Expo. Future pushes can then start both Android builds automatically.

## Using the build

Open the repository's **Actions** tab after a push. The validation job always runs. When `EXPO_TOKEN` exists, two Android jobs print their Expo build URLs. Open the `preview` build URL to download the completed APK for direct installation; use the `production` build URL to download the completed AAB for Google Play submission.

If `EXPO_TOKEN` is absent, both build requests are skipped deliberately while validation still completes successfully.
