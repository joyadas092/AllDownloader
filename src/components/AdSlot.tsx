import Script from "next/script";

/**
 * Reserved advertising space, wired for Adsterra.
 *
 * Each slot renders a container with a fixed minimum height, so filling it
 * later cannot shift the page (CLS stays at zero). Nothing is fetched until you
 * supply a key — configure the slots you want through environment variables and
 * leave the rest empty:
 *
 *   NEXT_PUBLIC_ADSTERRA_TOP=<key>
 *   NEXT_PUBLIC_ADSTERRA_AFTER_DOWNLOADER=<key>
 *   NEXT_PUBLIC_ADSTERRA_MIDDLE=<key>
 *   NEXT_PUBLIC_ADSTERRA_BOTTOM=<key>
 *   NEXT_PUBLIC_ADSTERRA_SIDEBAR=<key>
 *
 * The key is the value Adsterra shows in its Banner invocation snippet, the one
 * assigned to `key` inside `atOptions` (a 32-character hex string). Set the
 * matching width/height below to the ad unit's real size, or the reserved box
 * and the delivered banner will not line up.
 *
 * NEXT_PUBLIC_ is required: these are read in the browser. They are publisher
 * ids, not secrets — they appear in the page source of every site running
 * Adsterra.
 *
 * For non-banner formats (Social Bar, Popunder, Direct Link), Adsterra gives
 * you a plain <script src> instead of an atOptions block. Those are page-level
 * rather than in-flow: add them once in src/app/layout.tsx with next/script,
 * not here.
 */

export type AdSlotName =
  | "AdSlotTop"
  | "AdSlotAfterDownloader"
  | "AdSlotMiddle"
  | "AdSlotBottom"
  | "AdSlotSidebar";

interface SlotSpec {
  /** Ad unit size. Must match the Adsterra unit you created. */
  width: number;
  height: number;
  /** Reserved height below 640px, where a desktop-sized unit will not fit. */
  mobileHeight: number;
  label: string;
  /** Publisher key for this placement, from the environment. */
  key?: string;
}

const SPECS: Record<AdSlotName, SlotSpec> = {
  // Leaderboard above the fold: short on mobile so it never pushes the
  // downloader off screen.
  AdSlotTop: {
    width: 728,
    height: 90,
    mobileHeight: 100,
    label: "Top advertisement",
    key: process.env.NEXT_PUBLIC_ADSTERRA_TOP,
  },
  // Sits below the downloader, never between the input and its results.
  AdSlotAfterDownloader: {
    width: 300,
    height: 250,
    mobileHeight: 250,
    label: "Advertisement",
    key: process.env.NEXT_PUBLIC_ADSTERRA_AFTER_DOWNLOADER,
  },
  AdSlotMiddle: {
    width: 300,
    height: 250,
    mobileHeight: 250,
    label: "Advertisement",
    key: process.env.NEXT_PUBLIC_ADSTERRA_MIDDLE,
  },
  AdSlotBottom: {
    width: 728,
    height: 90,
    mobileHeight: 250,
    label: "Footer advertisement",
    key: process.env.NEXT_PUBLIC_ADSTERRA_BOTTOM,
  },
  AdSlotSidebar: {
    width: 160,
    height: 600,
    mobileHeight: 250,
    label: "Sidebar advertisement",
    key: process.env.NEXT_PUBLIC_ADSTERRA_SIDEBAR,
  },
};

export default function AdSlot({ name, className = "" }: { name: AdSlotName; className?: string }) {
  const spec = SPECS[name];
  const configured = Boolean(spec.key);

  return (
    <aside
      aria-label={spec.label}
      data-ad-slot={name}
      className={`ad-slot my-8 flex w-full items-center justify-center overflow-hidden rounded-xl ${
        configured ? "" : "border border-dashed border-border/70 bg-surface/40"
      } ${className}`}
      style={{
        // Inline custom properties keep the reserved box identical on server
        // and client, so nothing reflows during hydration.
        ["--ad-h-mobile" as string]: `${spec.mobileHeight}px`,
        ["--ad-h-desktop" as string]: `${spec.height}px`,
      }}
    >
      {configured ? (
        <>
          {/* Adsterra reads atOptions from the global scope, then the invoke
              script writes the banner where it is placed in the document. */}
          <Script id={`adsterra-opts-${name}`} strategy="afterInteractive">
            {`atOptions = { key: ${JSON.stringify(spec.key)}, format: 'iframe', height: ${spec.height}, width: ${spec.width}, params: {} };`}
          </Script>
          <Script
            id={`adsterra-invoke-${name}`}
            strategy="afterInteractive"
            src={`https://www.highperformanceformat.com/${spec.key}/invoke.js`}
          />
        </>
      ) : (
        <span className="select-none text-[11px] uppercase tracking-widest text-text-dim/60">
          Advertisement
        </span>
      )}
    </aside>
  );
}
