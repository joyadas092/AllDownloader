"use client";

import { useMemo, useSyncExternalStore } from "react";

/**
 * Reserved advertising space, wired for Adsterra.
 *
 * Each banner renders inside its own `srcdoc` iframe. That is not decoration —
 * Adsterra's invoke.js locates its insertion point with `document.currentScript`
 * and reads a single global `atOptions`. Loaded the obvious way (a Next.js
 * <Script> in the page), `currentScript` is null because the tag is async, and
 * several slots on one page clobber each other's `atOptions` before any of them
 * runs. Giving each slot a private document fixes both: the snippet loads
 * synchronously inside the frame, and each frame has its own globals.
 *
 * Configure through the environment; leave a key empty and that slot stays a
 * blank reserved box that loads nothing:
 *
 *   NEXT_PUBLIC_ADSTERRA_TOP=<key>
 *   NEXT_PUBLIC_ADSTERRA_AFTER_DOWNLOADER=<key>
 *   NEXT_PUBLIC_ADSTERRA_MIDDLE=<key>
 *   NEXT_PUBLIC_ADSTERRA_BOTTOM=<key>
 *   NEXT_PUBLIC_ADSTERRA_SIDEBAR=<key>
 *
 * The key is the `key` value inside the `atOptions` block of Adsterra's Banner
 * snippet. Sizes below must match the unit you created there.
 *
 * Optional per-slot mobile units (create them as 320x50 in Adsterra):
 *
 *   NEXT_PUBLIC_ADSTERRA_TOP_MOBILE=<key>          (and _AFTER_DOWNLOADER_MOBILE, etc.)
 *
 * Without a mobile key, the desktop unit is used at every width — a 728x90
 * banner will be clipped on a phone, so creating the mobile units is worth it.
 *
 * NEXT_PUBLIC_ is required: these are read in the browser. They are publisher
 * ids rather than secrets — every Adsterra site exposes them in page source.
 *
 * Non-banner formats (Social Bar, Popunder, Direct Link) are page-level, not
 * in-flow. Those go in src/app/layout.tsx with next/script, not here.
 */

export type AdSlotName =
  | "AdSlotTop"
  | "AdSlotAfterDownloader"
  | "AdSlotMiddle"
  | "AdSlotBottom"
  | "AdSlotSidebar";

interface Placement {
  key?: string;
  width: number;
  height: number;
}

interface SlotSpec {
  desktop: Placement;
  mobile: Placement;
  label: string;
}

const SPECS: Record<AdSlotName, SlotSpec> = {
  // Leaderboard above the fold: kept short on mobile so it never pushes the
  // downloader off screen.
  AdSlotTop: {
    desktop: { key: process.env.NEXT_PUBLIC_ADSTERRA_TOP, width: 728, height: 90 },
    mobile: { key: process.env.NEXT_PUBLIC_ADSTERRA_TOP_MOBILE, width: 320, height: 50 },
    label: "Top advertisement",
  },
  // Sits below the downloader, never between the input and its results.
  AdSlotAfterDownloader: {
    desktop: { key: process.env.NEXT_PUBLIC_ADSTERRA_AFTER_DOWNLOADER, width: 300, height: 250 },
    mobile: { key: process.env.NEXT_PUBLIC_ADSTERRA_AFTER_DOWNLOADER_MOBILE, width: 300, height: 250 },
    label: "Advertisement",
  },
  AdSlotMiddle: {
    desktop: { key: process.env.NEXT_PUBLIC_ADSTERRA_MIDDLE, width: 300, height: 250 },
    mobile: { key: process.env.NEXT_PUBLIC_ADSTERRA_MIDDLE_MOBILE, width: 300, height: 250 },
    label: "Advertisement",
  },
  AdSlotBottom: {
    desktop: { key: process.env.NEXT_PUBLIC_ADSTERRA_BOTTOM, width: 728, height: 90 },
    mobile: { key: process.env.NEXT_PUBLIC_ADSTERRA_BOTTOM_MOBILE, width: 320, height: 50 },
    label: "Footer advertisement",
  },
  AdSlotSidebar: {
    desktop: { key: process.env.NEXT_PUBLIC_ADSTERRA_SIDEBAR, width: 160, height: 600 },
    mobile: { key: process.env.NEXT_PUBLIC_ADSTERRA_SIDEBAR_MOBILE, width: 300, height: 250 },
    label: "Sidebar advertisement",
  },
};

/** Publisher keys are hex ids; refuse anything else rather than inject it. */
const isValidKey = (key?: string): key is string => !!key && /^[a-f0-9]{16,64}$/i.test(key);

// A "has the browser taken over yet" flag with no state updates in an effect.
const neverChanges = () => () => {};
const onClient = () => true;
const onServer = () => false;

/**
 * The classic Adsterra snippet, verbatim, in a document of its own. Both tags
 * are synchronous so `document.currentScript` resolves and the banner lands
 * where the second tag sits.
 */
function buildSrcDoc({ key, width, height }: Required<Placement>): string {
  return `<!doctype html><html><head><meta charset="utf-8">
<style>html,body{margin:0;padding:0;overflow:hidden;background:transparent}</style>
</head><body>
<script type="text/javascript">
atOptions = {'key':'${key}','format':'iframe','height':${height},'width':${width},'params':{}};
</script>
<script type="text/javascript" src="https://www.highperformanceformat.com/${key}/invoke.js"></script>
</body></html>`;
}

export default function AdSlot({ name, className = "" }: { name: AdSlotName; className?: string }) {
  const spec = SPECS[name];

  // Nothing renders until the browser has the component, so each viewport
  // fetches exactly one unit. Rendering both sizes and hiding one with CSS
  // would still load both and bill two impressions.
  const mounted = useSyncExternalStore(neverChanges, onClient, onServer);

  const placement = useMemo(() => {
    if (!mounted) return null;
    // Read once. Re-picking on resize would reload the ad and count again.
    const isMobile = window.matchMedia("(max-width: 639px)").matches;
    return isMobile && isValidKey(spec.mobile.key) ? spec.mobile : spec.desktop;
  }, [mounted, spec]);

  const active = placement && isValidKey(placement.key) ? placement : null;

  return (
    <aside
      aria-label={spec.label}
      data-ad-slot={name}
      className={`ad-slot my-8 flex w-full items-center justify-center overflow-hidden rounded-xl ${
        active ? "" : "border border-dashed border-border/70 bg-surface/40"
      } ${className}`}
      style={{
        // Inline custom properties keep the reserved box identical on server
        // and client, so filling it later cannot shift the page.
        ["--ad-h-mobile" as string]: `${spec.mobile.height}px`,
        ["--ad-h-desktop" as string]: `${spec.desktop.height}px`,
      }}
    >
      {active ? (
        <iframe
          title={spec.label}
          width={active.width}
          height={active.height}
          // Deliberately not sandboxed. A sandbox without allow-same-origin
          // gives the frame an opaque origin, which strips the referrer and
          // blocks storage — Adsterra then cannot match the request to an
          // approved domain and returns no fill, which is exactly the blank
          // banner this component first shipped with. Ad networks need to see
          // the host page's origin; that is the trade for showing ads at all.
          srcDoc={buildSrcDoc(active as Required<Placement>)}
          style={{ border: 0, display: "block", maxWidth: "100%" }}
        />
      ) : (
        <span className="select-none text-[11px] uppercase tracking-widest text-text-dim/60">
          Advertisement
        </span>
      )}
    </aside>
  );
}
