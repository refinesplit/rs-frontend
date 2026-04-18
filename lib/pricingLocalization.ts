export type SupportedRegion = "IN" | "US" | "EU";

export type PlanName = "BASIC" | "PRO" | "BUSINESS";

type LocalizedPlan = {
  name: PlanName;
  monthlyPrice: number;
  desc: string;
  features: string[];
  cta: string;
  href: string;
  featured?: boolean;
};

export type LocalizedPricingData = {
  region: SupportedRegion;
  locale: string;
  currency: string;
  title: string;
  subtitle: string;
  monthlyPeriodLabel: string;
  annualPeriodLabel: string;
  monthlyLabel: string;
  annualLabel: string;
  annualDiscountLabel: string;
  footnote: string;
  plans: Array<
    LocalizedPlan & {
      monthlyPriceLabel: string;
      annualPriceLabel: string;
    }
  >;
};

const FALLBACK_REGION: SupportedRegion = "US";

const REGION_CONFIG: Record<SupportedRegion, Omit<LocalizedPricingData, "plans"> & { plans: LocalizedPlan[]; currency: string; locale: string }> = {
  IN: {
    region: "IN",
    locale: "en-IN",
    currency: "INR",
    title: "Simple pricing",
    subtitle: "Choose the plan that fits your workflow.",
    monthlyPeriodLabel: "/ mo",
    annualPeriodLabel: "/ yr",
    monthlyLabel: "Monthly",
    annualLabel: "Annual",
    annualDiscountLabel: "Save 20%",
    footnote: "BASIC plan is free forever. No credit card required.",
    plans: [
      {
        name: "BASIC",
        monthlyPrice: 0,
        desc: "For individuals getting started with invoicing.",
        features: ["5 invoices / month", "PDF download", "WhatsApp sharing", "GST calculation"],
        cta: "Get started free",
        href: "/login",
      },
      {
        name: "PRO",
        monthlyPrice: 499,
        desc: "For freelancers and solo professionals.",
        features: ["Unlimited invoices", "Custom branding & logo", "Payment tracking", "Smart reports", "Priority support"],
        cta: "Start 14-day trial",
        href: "/login",
        featured: true,
      },
      {
        name: "BUSINESS",
        monthlyPrice: 1499,
        desc: "For teams that need advanced controls and collaboration.",
        features: ["Everything in PRO", "Team access (up to 10 users)", "Client portal", "Advanced analytics", "Dedicated onboarding"],
        cta: "Contact sales",
        href: "/login",
      },
    ],
  },
  US: {
    region: "US",
    locale: "en-US",
    currency: "USD",
    title: "Simple pricing",
    subtitle: "Choose the plan that fits your workflow.",
    monthlyPeriodLabel: "/ mo",
    annualPeriodLabel: "/ yr",
    monthlyLabel: "Monthly",
    annualLabel: "Annual",
    annualDiscountLabel: "Save 20%",
    footnote: "BASIC plan is free forever. No credit card required.",
    plans: [
      {
        name: "BASIC",
        monthlyPrice: 0,
        desc: "For individuals getting started with invoicing.",
        features: ["5 invoices / month", "PDF download", "WhatsApp sharing", "Tax calculation"],
        cta: "Get started free",
        href: "/login",
      },
      {
        name: "PRO",
        monthlyPrice: 12,
        desc: "For freelancers and solo professionals.",
        features: ["Unlimited invoices", "Custom branding & logo", "Payment tracking", "Smart reports", "Priority support"],
        cta: "Start 14-day trial",
        href: "/login",
        featured: true,
      },
      {
        name: "BUSINESS",
        monthlyPrice: 39,
        desc: "For teams that need advanced controls and collaboration.",
        features: ["Everything in PRO", "Team access (up to 10 users)", "Client portal", "Advanced analytics", "Dedicated onboarding"],
        cta: "Contact sales",
        href: "/login",
      },
    ],
  },
  EU: {
    region: "EU",
    locale: "de-DE",
    currency: "EUR",
    title: "Einfache Preise",
    subtitle: "Waehle den Plan, der zu deinem Workflow passt.",
    monthlyPeriodLabel: "/ Monat",
    annualPeriodLabel: "/ Jahr",
    monthlyLabel: "Monatlich",
    annualLabel: "Jaehrlich",
    annualDiscountLabel: "20% sparen",
    footnote: "Der BASIC-Plan bleibt dauerhaft kostenlos. Keine Kreditkarte erforderlich.",
    plans: [
      {
        name: "BASIC",
        monthlyPrice: 0,
        desc: "Fuer Einzelpersonen, die mit Rechnungen starten.",
        features: ["5 Rechnungen / Monat", "PDF-Download", "WhatsApp-Versand", "Steuerberechnung"],
        cta: "Kostenlos starten",
        href: "/login",
      },
      {
        name: "PRO",
        monthlyPrice: 11,
        desc: "Fuer Freelancer und Solo-Profis.",
        features: ["Unbegrenzte Rechnungen", "Eigenes Branding & Logo", "Zahlungsstatus", "Smart Reports", "Priorisierter Support"],
        cta: "14-Tage-Test starten",
        href: "/login",
        featured: true,
      },
      {
        name: "BUSINESS",
        monthlyPrice: 35,
        desc: "Fuer Teams mit erweiterten Anforderungen.",
        features: ["Alles aus PRO", "Team-Zugang (bis zu 10 Nutzer)", "Kundenportal", "Erweiterte Analysen", "Dediziertes Onboarding"],
        cta: "Vertrieb kontaktieren",
        href: "/login",
      },
    ],
  },
};

export function resolveRegion(input?: string): SupportedRegion {
  const normalized = input?.trim().toUpperCase();
  const lowered = input?.trim().toLowerCase();

  if (!normalized || !lowered) {
    return FALLBACK_REGION;
  }

  if (normalized === "IN" || normalized === "US" || normalized === "EU") {
    return normalized;
  }

  // Region aliases
  if (normalized === "INDIA") return "IN";
  if (normalized === "USA" || normalized === "UNITED STATES") return "US";
  if (normalized === "EUR" || normalized === "EUROPE") return "EU";

  // Locale-style inputs
  if (lowered === "en-in" || lowered.endsWith("-in")) return "IN";
  if (lowered === "en-us" || lowered.endsWith("-us")) return "US";
  if (lowered === "de-de" || lowered.startsWith("de-") || lowered.endsWith("-de")) return "EU";

  return FALLBACK_REGION;
}

function formatMoney(amount: number, locale: string, currency: string): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getLocalizedPricing(regionInput?: string): LocalizedPricingData {
  const region = resolveRegion(regionInput);
  const config = REGION_CONFIG[region];

  return {
    region: config.region,
    locale: config.locale,
    currency: config.currency,
    title: config.title,
    subtitle: config.subtitle,
    monthlyPeriodLabel: config.monthlyPeriodLabel,
    annualPeriodLabel: config.annualPeriodLabel,
    monthlyLabel: config.monthlyLabel,
    annualLabel: config.annualLabel,
    annualDiscountLabel: config.annualDiscountLabel,
    footnote: config.footnote,
    plans: config.plans.map((plan) => ({
      ...plan,
      monthlyPriceLabel: formatMoney(plan.monthlyPrice, config.locale, config.currency),
      annualPriceLabel: formatMoney(
        plan.monthlyPrice === 0 ? 0 : Math.round(plan.monthlyPrice * 12 * 0.8),
        config.locale,
        config.currency
      ),
    })),
  };
}
