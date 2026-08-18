import { Link2, ListVideo, DownloadCloud } from "lucide-react";

const steps = [
  { n: "01", icon: Link2, title: "Paste URL", desc: "Copy the video link from any supported platform and paste it above." },
  { n: "02", icon: ListVideo, title: "Select quality", desc: "We list every resolution that video actually has, plus audio-only options." },
  { n: "03", icon: DownloadCloud, title: "Download", desc: "Most files transfer straight from the source to your device — no account, no install." },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-24 py-20">
      <div className="mb-12 text-center">
        <h2 className="text-2xl font-bold text-text sm:text-3xl">How It Works</h2>
        <p className="mt-2 text-text-muted">Three steps. No installs.</p>
      </div>
      <div className="grid gap-6 sm:grid-cols-3">
        {steps.map((step) => (
          <div key={step.n} className="relative rounded-2xl border border-border bg-surface p-6">
            <span className="gradient-text text-4xl font-bold opacity-40">{step.n}</span>
            <div className="mt-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary-2">
              <step.icon size={19} />
            </div>
            <h3 className="mt-4 font-semibold text-text">{step.title}</h3>
            <p className="mt-1.5 text-sm text-text-muted">{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
