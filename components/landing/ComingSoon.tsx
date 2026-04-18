import Link from "next/link";

const plans = [
  {
    name: "BASIC",
    price: "₹ 0",
    period: "/ mo",
    desc: "For individuals getting started with invoicing.",
    features: ["5 invoices / month", "PDF download", "WhatsApp sharing", "GST calculation"],
    cta: "Get started free",
    href: "/invoice",
    featured: false,
  },
  {
    name: "PRO",
    price: "₹ 499",
    period: "/ mo",
    desc: "For freelancers and solo professionals.",
    features: ["Unlimited invoices", "Custom branding & logo", "Payment tracking", "Smart reports", "Priority support"],
    cta: "Start 14-day trial",
    href: "/login",
    featured: true,
  },
  {
    name: "BUSINESS",
    price: "₹ 1499",
    period: "/ mo",
    desc: "For teams that need advanced controls and collaboration.",
    features: ["Everything in PRO", "Team access (up to 10 users)", "Client portal", "Advanced analytics", "Dedicated onboarding"],
    cta: "Contact sales",
    href: "/login",
    featured: false,
  },
];

const CheckIcon = () => (
  <span className="flex h-[14px] w-[14px] shrink-0 items-center justify-center rounded-full bg-[#EAF3DE] dark:bg-[#1a2e0f]">
    <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
      <path d="M1 3l2 2 4-4" stroke="#3B6D11" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  </span>
);

export function ComingSoon() {
  return (
    <section id="pricing" className="border-t border-slate-200/70 dark:border-slate-800/60 bg-slate-50/80 dark:bg-slate-900/40 py-16 sm:py-20">
      <div className="mx-auto max-w-[1100px] px-6 lg:px-10 text-center">

        <h2 className="text-[26px] font-medium tracking-[-0.4px] text-slate-900 dark:text-white">
          Simple pricing
        </h2>
        <p className="mt-2 text-[15px] text-slate-500 dark:text-slate-400 mb-9">
          Choose the plan that fits your workflow.
        </p>

        {/* Plans */}
        <div className="grid grid-cols-1 gap-4 text-left md:grid-cols-3">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`rounded-[12px] p-6 ${
                p.featured
                  ? "border-[1.5px] border-[#185FA5] bg-white dark:bg-slate-900"
                  : "border border-slate-200/70 dark:border-slate-700/50 bg-white dark:bg-slate-900"
              }`}
            >
              <p className={`mb-2 text-[12px] font-semibold uppercase tracking-[0.4px] ${p.featured ? "text-[#185FA5]" : "text-slate-500 dark:text-slate-400"}`}>
                {p.name}
              </p>
              <p className="mb-1 text-[28px] font-medium tracking-[-0.5px] text-slate-900 dark:text-white leading-none">
                {p.price}{" "}
                <span className="text-[14px] font-normal text-slate-400 dark:text-slate-500">
                  {p.period}
                </span>
              </p>
              <p className="mb-4 text-[13px] text-slate-500 dark:text-slate-400">{p.desc}</p>

              <div className="space-y-2.5 mb-5">
                {p.features.map((f) => (
                  <div key={f} className="flex items-center gap-2.5">
                    <CheckIcon />
                    <span className="text-[13px] text-slate-600 dark:text-slate-400">{f}</span>
                  </div>
                ))}
              </div>

              <Link href={p.href} id={`plan-${p.name.toLowerCase()}-btn`}>
                <span className={`block w-full rounded-[8px] py-2.5 text-center text-[13px] font-medium transition-colors cursor-pointer ${
                  p.featured
                    ? "bg-[#185FA5] text-white hover:bg-[#1a6ab8]"
                    : "border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                }`}>
                  {p.cta}
                </span>
              </Link>
            </div>
          ))}
        </div>

        <p className="mt-6 text-[12px] text-slate-400 dark:text-slate-500">
          BASIC plan is free forever. No credit card required.
        </p>
      </div>
    </section>
  );
}
