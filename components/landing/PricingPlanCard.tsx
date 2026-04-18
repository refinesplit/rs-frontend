import Link from "next/link";

export type PricingPlanCardProps = {
  name: "BASIC" | "PRO" | "BUSINESS";
  price: string;
  period: string;
  desc: string;
  features: string[];
  cta: string;
  href: string;
  featured?: boolean;
};

function CheckIcon() {
  return (
    <span className="flex h-[14px] w-[14px] shrink-0 items-center justify-center rounded-full bg-[#EAF3DE] dark:bg-[#1a2e0f]">
      <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
        <path d="M1 3l2 2 4-4" stroke="#3B6D11" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    </span>
  );
}

export function PricingPlanCard({
  name,
  price,
  period,
  desc,
  features,
  cta,
  href,
  featured = false,
}: PricingPlanCardProps) {
  return (
    <Link
      href={href}
      aria-label={`${name} plan`}
      className={`rounded-[12px] p-6 ${
        featured
          ? "border-[1.5px] border-[#185FA5] bg-white dark:bg-slate-900"
          : "border border-slate-200/70 dark:border-slate-700/50 bg-white dark:bg-slate-900"
      } block transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_8px_24px_rgba(0,0,0,0.25)]`}
    >
      <p
        className={`mb-2 text-[12px] font-semibold uppercase tracking-[0.4px] ${
          featured ? "text-[#185FA5]" : "text-slate-500 dark:text-slate-400"
        }`}
      >
        {name}
      </p>
      <p className="mb-1 text-[28px] font-medium tracking-[-0.5px] text-slate-900 dark:text-white leading-none">
        {price}{" "}
        <span className="text-[14px] font-normal text-slate-400 dark:text-slate-500">{period}</span>
      </p>
      <p className="mb-4 text-[13px] text-slate-500 dark:text-slate-400">{desc}</p>

      <div className="mb-5 space-y-2.5">
        {features.map((feature) => (
          <div key={feature} className="flex items-center gap-2.5">
            <CheckIcon />
            <span className="text-[13px] text-slate-600 dark:text-slate-400">{feature}</span>
          </div>
        ))}
      </div>

      <span
        id={`plan-${name.toLowerCase()}-btn`}
        className={`block w-full rounded-[8px] py-2.5 text-center text-[13px] font-medium transition-colors ${
          featured
            ? "bg-[#185FA5] text-white"
            : "border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300"
      }`}
      >
        {cta}
      </span>
    </Link>
  );
}
