# Automatic Android Builds

Every push to the `main` branch runs type checks and tests. Once the Expo credential is configured, the same push also asks Expo to create an installable Android APK using the `preview` profile.

## One-time secure setup

1. In Expo, create a personal access token for the account that owns the diary project.
2. In GitHub, open **Settings → Secrets and variables → Actions → New repository secret**.
3. Create a secret named `EXPO_TOKEN`, paste the Expo token, and save it. Do not put the token in source code, commits, issues, or chat messages.
4. Run one Android build through Expo first if prompted. This initial setup creates the Android signing credentials and links the project to Expo. Future pushes can then start the APK build automatically.

## Using the build

Open the repository's **Actions** tab after a push. The validation job always runs. When `EXPO_TOKEN` exists, the Android job prints an Expo build URL. Open that link to monitor the remote build and download the completed APK.

If `EXPO_TOKEN` is absent, the build job is skipped deliberately while validation still completes successfully.
