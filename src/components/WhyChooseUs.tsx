import { Gauge, ShieldCheck, Smartphone, Layers } from "lucide-react";

import { brand } from "@/lib/brand";

const items = [
  { icon: Gauge, title: "Fast", desc: "Server-side extraction gets you a result in seconds." },
  { icon: Layers, title: "Multiple qualities", desc: "Every available resolution, plus MP3 audio." },
  { icon: Smartphone, title: "Mobile friendly", desc: "Works smoothly in any mobile browser, no app needed." },
  { icon: ShieldCheck, title: "No installs", desc: "Nothing to download or sign up for — just paste and go." },
];

export default function WhyChooseUs() {
  return (
    <section className="py-20">
      <div className="mb-12 text-center">
        <h2 className="text-2xl font-bold text-text sm:text-3xl">Why Choose {brand.name}</h2>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <div key={item.title} className="rounded-2xl border border-border bg-surface p-6 text-center">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 text-accent-2">
              <item.icon size={20} />
            </div>
            <h3 className="mt-4 font-semibold text-text">{item.title}</h3>
            <p className="mt-1.5 text-sm text-text-muted">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
