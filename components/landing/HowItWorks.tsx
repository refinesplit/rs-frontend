import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

const steps = [
  {
    num: "01",
    title: "Enter details",
    description: "Client name, service description, and amount. Takes under a minute to fill in.",
    numColor: "text-[#185FA5]",
  },
  {
    num: "02",
    title: "Generate invoice",
    description: "A clean, professional invoice is created instantly — with optional GST calculation.",
    numColor: "text-[#185FA5]",
  },
  {
    num: "03",
    title: "Send via WhatsApp",
    description: "Share the invoice link on WhatsApp or download as a print-ready PDF. Done.",
    numColor: "text-[#185FA5]",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="border-t border-b border-slate-200/70 dark:border-slate-800/60 bg-slate-50/80 dark:bg-slate-900/40 py-16 sm:py-20">
      <div className="mx-auto max-w-[1100px] px-6 lg:px-10">

        {/* Section header */}
        <div className="mb-12 text-center">
          <RevealOnScroll once={false}>
            <p className="mb-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-[#185FA5]">
              How it works
            </p>
          </RevealOnScroll>
          <RevealOnScroll delay={80} once={false}>
            <h2 className="text-[26px] font-medium tracking-[-0.4px] text-slate-900 dark:text-white">
              Three steps to get paid
            </h2>
          </RevealOnScroll>
          <RevealOnScroll delay={160} once={false}>
            <p className="mt-2 text-[15px] text-slate-500 dark:text-slate-400">
              No complex setup. No learning curve.
            </p>
          </RevealOnScroll>
        </div>

        {/* Steps */}
        <div className="grid gap-5 sm:grid-cols-3">
          {steps.map((s, i) => (
            <RevealOnScroll key={s.num} delay={(i + 1) * 90} once={false}>
              <div className="rounded-[12px] border border-slate-200/70 dark:border-slate-700/50 bg-white dark:bg-slate-900 p-6">
                <p className={`mb-3 text-[28px] font-medium tracking-[-0.5px] ${s.numColor} opacity-40`}>
                  {s.num}
                </p>
                <h3 className="mb-1.5 text-[15px] font-medium text-slate-900 dark:text-white">
                  {s.title}
                </h3>
                <p className="text-[13.5px] leading-[1.65] text-slate-500 dark:text-slate-400">
                  {s.description}
                </p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
