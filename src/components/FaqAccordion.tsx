import { ChevronDown } from "lucide-react";

import JsonLd from "@/components/JsonLd";
import type { PlatformFaq } from "@/lib/platforms";

export default function FaqAccordion({ items }: { items: PlatformFaq[] }) {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: items.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: { "@type": "Answer", text: item.answer },
          })),
        }}
      />
      <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-surface">
        {items.map((item) => (
          <details key={item.question} className="group p-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-text marker:content-none">
              {item.question}
              <ChevronDown size={18} className="shrink-0 text-text-dim transition-transform group-open:rotate-180" />
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-text-muted">{item.answer}</p>
          </details>
        ))}
      </div>
    </>
  );
}
