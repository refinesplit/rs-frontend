import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

const features = [
  {
    iconBg: "bg-[#E6F1FB]",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="2" y="2" width="12" height="12" rx="2" stroke="#185FA5" strokeWidth="1.2"/>
        <path d="M5 8h6M5 5h6M5 11h4" stroke="#185FA5" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    ),
    title: "Instant PDF generation",
    desc: "Professional, print-ready PDFs with your details — generated in under a second.",
  },
  {
    iconBg: "bg-[#EAF3DE]",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M8 2v4m0 0l-2-2m2 2l2-2" stroke="#3B6D11" strokeWidth="1.2" strokeLinecap="round"/>
        <rect x="2" y="9" width="12" height="5" rx="2" stroke="#3B6D11" strokeWidth="1.2"/>
      </svg>
    ),
    title: "WhatsApp sharing",
    desc: "Send your invoice link directly via WhatsApp. Clients get it instantly on their phone.",
  },
  {
    iconBg: "bg-[#FAEEDA]",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="5.5" stroke="#854F0B" strokeWidth="1.2"/>
        <path d="M8 5.5v3l2 1.2" stroke="#854F0B" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    ),
    title: "GST calculation",
    desc: "Toggle GST on/off with configurable rates. The total updates instantly as you type.",
  },
  {
    iconBg: "bg-[#EEEDFE]",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M4 8l3 3 5-5" stroke="#534AB7" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: "No signup needed",
    desc: "Open the app, fill in your details, and generate. No account, no friction, no waiting.",
  },
  {
    iconBg: "bg-[#FAECE7]",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="2" y="4" width="12" height="9" rx="1.5" stroke="#993C1D" strokeWidth="1.2"/>
        <path d="M5 4V3a3 3 0 016 0v1" stroke="#993C1D" strokeWidth="1.2"/>
      </svg>
    ),
    title: "Multi-currency",
    desc: "Bill clients in INR, USD, EUR and more. Perfect for freelancers with global clients.",
  },
  {
    iconBg: "bg-[#E1F5EE]",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M2 13l4-4 3 3 5-6" stroke="#0F6E56" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: "Payment tracking",
    desc: "Know which invoices are paid, pending, or overdue — all in one dashboard.",
  },
];

export function Benefits() {
  return (
    <section id="features" className="bg-white dark:bg-[#0a0f1e] py-16 sm:py-20">
      <div className="mx-auto max-w-[1100px] px-6 lg:px-10">

        {/* Header */}
        <div className="mb-12 text-center">
          <RevealOnScroll once={false}>
            <h2 className="text-[26px] font-medium tracking-[-0.4px] text-slate-900 dark:text-white">
              Everything you need, nothing you don't
            </h2>
          </RevealOnScroll>
          <RevealOnScroll delay={90} once={false}>
            <p className="mt-2 text-[15px] text-slate-500 dark:text-slate-400">
              Built for freelancers, agencies, and small businesses in India.
            </p>
          </RevealOnScroll>
        </div>

        {/* Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <RevealOnScroll key={f.title} delay={70 * ((i % 3) + 1)} once={false}>
              <div className="rounded-[12px] border border-slate-200/70 dark:border-slate-700/50 bg-white dark:bg-slate-900 p-5">
                <div className={`mb-3.5 flex h-9 w-9 items-center justify-center rounded-[8px] ${f.iconBg}`}>
                  {f.icon}
                </div>
                <h3 className="mb-1.5 text-[14.5px] font-medium text-slate-900 dark:text-white">
                  {f.title}
                </h3>
                <p className="text-[13px] leading-[1.65] text-slate-500 dark:text-slate-400">
                  {f.desc}
                </p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
