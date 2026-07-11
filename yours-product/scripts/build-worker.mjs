import { mkdir, readdir, rename, writeFile } from "node:fs/promises";

const dist = new URL("../dist/", import.meta.url);
const client = new URL("../dist/client/", import.meta.url);
await mkdir(client, { recursive: true });
for (const entry of await readdir(dist)) {
  if (entry === "client" || entry === "server") continue;
  await rename(new URL(entry, dist), new URL(entry, client));
}
await mkdir(new URL("../dist/server/", import.meta.url), { recursive: true });
await writeFile(
  new URL("../dist/server/index.js", import.meta.url),
  `export default { async fetch(request, env) { return env.ASSETS.fetch(request); } };\n`,
);
