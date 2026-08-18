import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { brand } from "@/lib/brand";
import JsonLd from "@/components/JsonLd";

export interface Crumb {
  label: string;
  href: string;
}

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  const all = [{ label: "Home", href: "/" }, ...items];

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: all.map((item, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: item.label,
            item: `${brand.siteUrl}${item.href}`,
          })),
        }}
      />
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1 text-sm text-text-dim">
        {all.map((item, i) => (
          <span key={item.href} className="flex items-center gap-1">
            {i > 0 && <ChevronRight size={14} className="opacity-50" />}
            {i === all.length - 1 ? (
              <span className="text-text-muted">{item.label}</span>
            ) : (
              <Link href={item.href} className="hover:text-text">
                {item.label}
              </Link>
            )}
          </span>
        ))}
      </nav>
    </>
  );
}
