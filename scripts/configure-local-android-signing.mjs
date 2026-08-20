import { readFile, writeFile } from "node:fs/promises";

const required = [
  "ANDROID_KEYSTORE_PASSWORD",
  "ANDROID_KEY_ALIAS",
  "ANDROID_KEY_PASSWORD",
];
for (const name of required) {
  if (!process.env[name]) throw new Error(`${name} is required`);
}

const path = "android/app/build.gradle";
let source = await readFile(path, "utf8");
if (!source.includes("signingConfigs {")) {
  throw new Error("Expected Android signingConfigs block was not found");
}

const signingBlock = `\n    release {\n      storeFile file("upload-keystore.jks")\n      storePassword System.getenv("ANDROID_KEYSTORE_PASSWORD")\n      keyAlias System.getenv("ANDROID_KEY_ALIAS")\n      keyPassword System.getenv("ANDROID_KEY_PASSWORD")\n    }`;
source = source.replace("signingConfigs {", `signingConfigs {${signingBlock}`);

const releaseMarker = "signingConfig signingConfigs.release";
if (!source.includes(releaseMarker)) {
  const releasePattern = /(buildTypes\\s*\\{[\\s\\S]*?release\\s*\\{)/;
  if (!releasePattern.test(source)) {
    throw new Error("Expected release build type was not found");
  }
  source = source.replace(releasePattern, `$1\n            ${releaseMarker}`);
}
await writeFile(path, source);
console.log("Configured temporary release signing from GitHub Actions secrets.");
