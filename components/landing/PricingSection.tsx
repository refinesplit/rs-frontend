"use client";

import { PricingPlanCard } from "@/components/landing/PricingPlanCard";
import { getLocalizedPricing } from "@/lib/pricingLocalization";
import { useState } from "react";

type PricingSectionProps = {
  region?: string;
};

export function PricingSection({ region }: PricingSectionProps) {
  const localized = getLocalizedPricing(region);
  const [billing, setBilling] = useState<"monthly" | "annual">("monthly");
  const isAnnual = billing === "annual";

  return (
    <section id="pricing" className="border-t border-slate-200/70 dark:border-slate-800/60 bg-slate-50/80 dark:bg-slate-900/40 py-16 sm:py-20">
      <div className="mx-auto max-w-[1100px] px-6 lg:px-10 text-center">
        <h2 className="text-[26px] font-medium tracking-[-0.4px] text-slate-900 dark:text-white">{localized.title}</h2>
        <p className="mt-2 mb-9 text-[15px] text-slate-500 dark:text-slate-400">
          {localized.subtitle}
        </p>

        <div className="relative z-10 mb-3 inline-flex items-center gap-1 rounded-[10px] border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-1">
          <button
            type="button"
            onClick={() => setBilling("monthly")}
            aria-pressed={!isAnnual}
            className={`rounded-[7px] px-3 py-1.5 text-[12px] font-medium transition-colors ${
              billing === "monthly"
                ? "bg-[#185FA5] text-white"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            {localized.monthlyLabel}
          </button>
          <button
            type="button"
            onClick={() => setBilling("annual")}
            aria-pressed={isAnnual}
            className={`rounded-[7px] px-3 py-1.5 text-[12px] font-medium transition-colors ${
              billing === "annual"
                ? "bg-[#185FA5] text-white"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            {localized.annualLabel}
          </button>
          <span className="ml-1 rounded-full bg-[#EAF3DE] px-2 py-0.5 text-[10px] font-semibold text-[#3B6D11]">
            {localized.annualDiscountLabel}
          </span>
        </div>

        <p className="mb-7 text-[12px] font-medium text-slate-500 dark:text-slate-400">
          {isAnnual
            ? `${localized.annualLabel} billing active (${localized.annualDiscountLabel})`
            : `${localized.monthlyLabel} billing active`}
        </p>

        <div key={billing} className="grid grid-cols-1 gap-4 text-left md:grid-cols-3">
          {localized.plans.map((plan) => (
            <PricingPlanCard
              key={plan.name}
              name={plan.name}
              price={isAnnual ? plan.annualPriceLabel : plan.monthlyPriceLabel}
              period={isAnnual ? localized.annualPeriodLabel : localized.monthlyPeriodLabel}
              desc={plan.desc}
              features={plan.features}
              cta={plan.cta}
              href={plan.href}
              featured={plan.featured}
            />
          ))}
        </div>

        <p className="mt-6 text-[12px] text-slate-400 dark:text-slate-500">
          {localized.footnote}
        </p>
      </div>
    </section>
  );
}
