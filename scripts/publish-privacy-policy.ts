import { readFile } from "node:fs/promises";
import path from "node:path";

import { storagePut } from "../server/storage";

async function main() {
  const sourcePath = path.resolve("docs/google-play/public/privacy-policy.html");
  const html = await readFile(sourcePath, "utf8");
  const result = await storagePut(
    "google-play/private-diary/privacy-policy.html",
    html,
    "text/html; charset=utf-8",
  );

  const baseUrl = process.env.PUBLIC_APP_URL ?? "https://imanote-diar-wyf44srw.manus.space";
  console.log(JSON.stringify({ ...result, publicUrl: `${baseUrl}${result.url}` }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
