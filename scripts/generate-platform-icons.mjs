/**
 * Generates src/components/icons/PlatformIcons.tsx from the simple-icons
 * package, so the official brand paths live in the repo as plain JSX and
 * nothing extra ships at runtime.
 *
 * Run after bumping simple-icons:  npm run icons:generate
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import * as icons from "simple-icons";

const here = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(here, "..", "src", "components", "icons", "PlatformIcons.tsx");

// key in our code  ->  simple-icons export name
const WANTED = {
  youtube: "siYoutube",
  instagram: "siInstagram",
  tiktok: "siTiktok",
  facebook: "siFacebook",
  twitter: "siX",
  x: "siX",
  pinterest: "siPinterest",
  reddit: "siReddit",
  snapchat: "siSnapchat",
  threads: "siThreads",
  vimeo: "siVimeo",
};

const entries = Object.entries(WANTED).map(([key, exportName]) => {
  const icon = icons[exportName];
  if (!icon) throw new Error(`simple-icons has no export "${exportName}" (for "${key}")`);
  return { key, title: icon.title, hex: icon.hex, path: icon.path };
});

const body = entries
  .map(
    ({ key, title, hex, path: d }) =>
      `  ${key}: {\n    title: ${JSON.stringify(title)},\n    hex: "#${hex}",\n    path: ${JSON.stringify(d)},\n  },`
  )
  .join("\n");

const file = `// GENERATED FILE — do not edit by hand.
// Source: simple-icons, via \`npm run icons:generate\` (scripts/generate-platform-icons.mjs).
//
// Brand marks are reproduced to identify the platforms this tool supports.
// They remain the trademarks of their respective owners.

export interface PlatformIconData {
  title: string;
  /** The brand's official colour. */
  hex: string;
  /** Path data for a 24x24 viewBox. */
  path: string;
}

export const platformIcons: Record<string, PlatformIconData> = {
${body}
};

export type PlatformIconName = keyof typeof platformIcons;
`;

fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, file, "utf8");
console.log(`wrote ${out} (${entries.length} icons)`);
