"use client";

import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { resolveRegion, type SupportedRegion } from "@/lib/pricingLocalization";

type InvoiceSlide = {
  id: string;
  business: string;
  businessType: string;
  status: string;
  metaFields: { label: string; value: string }[];
  lineItems: { desc: string; qty: string; rate: string; amount: string }[];
  total: string;
  thanksText: string;
};

type HeroContent = {
  badgeText: string;
  headlineStart: string;
  headlineAccent: string;
  subtitle: string;
  primaryCta: string;
  secondaryCta: string;
  tableHeaders: [string, string, string, string];
  totalDueText: string;
  downloadPdfText: string;
  socialProof: { num: string; lbl: string }[];
  slides: InvoiceSlide[];
};

const HERO_BY_REGION: Record<SupportedRegion, HeroContent> = {
  IN: {
    badgeText: "Everything runs in your browser",
    headlineStart: "Invoices that get you",
    headlineAccent: "paid faster",
    subtitle:
      "Create, send, and share professional invoices in seconds. No design skills needed - fill in your details, generate, and share via WhatsApp or PDF. No signup needed unless you explicitly want to save and reuse invoices.",
    primaryCta: "Start for free",
    secondaryCta: "See how it works",
    tableHeaders: ["Description", "Qty", "Rate", "Amount"],
    totalDueText: "Total due",
    downloadPdfText: "Download PDF",
    socialProof: [
      { num: "1.2M+", lbl: "Invoices generated" },
      { num: "40k", lbl: "Freelancers using it" },
      { num: "Free", lbl: "No signup required" },
    ],
    slides: [
      {
        id: "in-1",
        business: "Rahul Sharma Studio",
        businessType: "Design & Branding",
        status: "Paid",
        metaFields: [
          { label: "Invoice", value: "#RS-2024-082" },
          { label: "Due date", value: "Apr 30, 2026" },
          { label: "Bill to", value: "Nova Corp Ltd." },
          { label: "Issued", value: "Apr 01, 2026" },
        ],
        lineItems: [
          { desc: "Brand identity system", qty: "1", rate: "Rs 32,000", amount: "Rs 32,000" },
          { desc: "UI design (web)", qty: "12 hr", rate: "Rs 1,200", amount: "Rs 14,400" },
          { desc: "Logo animation", qty: "1", rate: "Rs 4,800", amount: "Rs 4,800" },
        ],
        total: "Rs 51,200",
        thanksText: "Thank you for your business.",
      },
      {
        id: "in-2",
        business: "Aarav Tech Services",
        businessType: "Product Consulting",
        status: "Pending",
        metaFields: [
          { label: "Invoice", value: "#AT-2026-119" },
          { label: "Due date", value: "May 06, 2026" },
          { label: "Bill to", value: "BuildFast Pvt Ltd" },
          { label: "Issued", value: "Apr 20, 2026" },
        ],
        lineItems: [
          { desc: "Architecture workshop", qty: "2", rate: "Rs 18,000", amount: "Rs 36,000" },
          { desc: "Implementation support", qty: "10 hr", rate: "Rs 2,000", amount: "Rs 20,000" },
        ],
        total: "Rs 56,000",
        thanksText: "Payment can be made via UPI or bank transfer.",
      },
      {
        id: "in-3",
        business: "Mira Content Lab",
        businessType: "Content & Marketing",
        status: "Paid",
        metaFields: [
          { label: "Invoice", value: "#MC-2026-041" },
          { label: "Due date", value: "Apr 28, 2026" },
          { label: "Bill to", value: "Orbit Media" },
          { label: "Issued", value: "Apr 10, 2026" },
        ],
        lineItems: [
          { desc: "SEO article package", qty: "8", rate: "Rs 2,250", amount: "Rs 18,000" },
          { desc: "Landing page copy", qty: "2", rate: "Rs 6,000", amount: "Rs 12,000" },
        ],
        total: "Rs 30,000",
        thanksText: "Thank you for your business.",
      },
    ],
  },
  US: {
    badgeText: "Everything runs in your browser",
    headlineStart: "Invoices that help you",
    headlineAccent: "get paid faster",
    subtitle:
      "Create and share polished invoices in seconds. Fill in details, generate instantly, and send by WhatsApp or PDF. No signup needed unless you explicitly want to save and reuse invoices.",
    primaryCta: "Start for free",
    secondaryCta: "See how it works",
    tableHeaders: ["Description", "Qty", "Rate", "Amount"],
    totalDueText: "Total due",
    downloadPdfText: "Download PDF",
    socialProof: [
      { num: "1.2M+", lbl: "Invoices generated" },
      { num: "40k", lbl: "Freelancers using it" },
      { num: "Free", lbl: "No signup required" },
    ],
    slides: [
      {
        id: "us-1",
        business: "Brooklyn Design Co.",
        businessType: "Brand & Web Design",
        status: "Paid",
        metaFields: [
          { label: "Invoice", value: "#BD-2026-082" },
          { label: "Due date", value: "Apr 30, 2026" },
          { label: "Bill to", value: "Northstar Labs" },
          { label: "Issued", value: "Apr 01, 2026" },
        ],
        lineItems: [
          { desc: "Brand identity", qty: "1", rate: "$1,800", amount: "$1,800" },
          { desc: "Website UI", qty: "16 hr", rate: "$110", amount: "$1,760" },
        ],
        total: "$3,560",
        thanksText: "Thank you for your business.",
      },
      {
        id: "us-2",
        business: "Riverfront Studio",
        businessType: "Creative Retainers",
        status: "Pending",
        metaFields: [
          { label: "Invoice", value: "#RF-2026-019" },
          { label: "Due date", value: "May 04, 2026" },
          { label: "Bill to", value: "Peak Commerce" },
          { label: "Issued", value: "Apr 18, 2026" },
        ],
        lineItems: [
          { desc: "Monthly design retainer", qty: "1", rate: "$2,400", amount: "$2,400" },
          { desc: "Ad creatives", qty: "6", rate: "$150", amount: "$900" },
        ],
        total: "$3,300",
        thanksText: "Net 14 terms apply.",
      },
      {
        id: "us-3",
        business: "Summit Dev Partners",
        businessType: "Engineering Services",
        status: "Paid",
        metaFields: [
          { label: "Invoice", value: "#SD-2026-245" },
          { label: "Due date", value: "May 08, 2026" },
          { label: "Bill to", value: "Aurora Health" },
          { label: "Issued", value: "Apr 22, 2026" },
        ],
        lineItems: [
          { desc: "API integration", qty: "22 hr", rate: "$140", amount: "$3,080" },
          { desc: "QA pass", qty: "8 hr", rate: "$95", amount: "$760" },
        ],
        total: "$3,840",
        thanksText: "Thank you for your business.",
      },
    ],
  },
  EU: {
    badgeText: "Alles laeuft direkt im Browser",
    headlineStart: "Rechnungen, mit denen du",
    headlineAccent: "schneller bezahlt wirst",
    subtitle:
      "Erstelle und teile professionelle Rechnungen in Sekunden. Details eintragen, sofort erzeugen und per WhatsApp oder PDF senden. Keine Registrierung noetig, ausser du willst Rechnungen explizit speichern und wiederverwenden.",
    primaryCta: "Kostenlos starten",
    secondaryCta: "So funktioniert es",
    tableHeaders: ["Beschreibung", "Menge", "Satz", "Betrag"],
    totalDueText: "Gesamtbetrag",
    downloadPdfText: "PDF herunterladen",
    socialProof: [
      { num: "1,2M+", lbl: "Erstellte Rechnungen" },
      { num: "40k", lbl: "Freelancer nutzen es" },
      { num: "Gratis", lbl: "Keine Registrierung" },
    ],
    slides: [
      {
        id: "eu-1",
        business: "Keller Design Studio",
        businessType: "Branding & Digital",
        status: "Bezahlt",
        metaFields: [
          { label: "Rechnung", value: "#KD-2026-082" },
          { label: "Faellig", value: "30. Apr 2026" },
          { label: "Kunde", value: "Nova Commerce GmbH" },
          { label: "Erstellt", value: "01. Apr 2026" },
        ],
        lineItems: [
          { desc: "Markenidentitaet", qty: "1", rate: "2.200 EUR", amount: "2.200 EUR" },
          { desc: "Web-UI Design", qty: "14 Std", rate: "120 EUR", amount: "1.680 EUR" },
        ],
        total: "3.880 EUR",
        thanksText: "Vielen Dank fuer die Zusammenarbeit.",
      },
      {
        id: "eu-2",
        business: "Alpen Tech GmbH",
        businessType: "Software Services",
        status: "Offen",
        metaFields: [
          { label: "Rechnung", value: "#AT-2026-019" },
          { label: "Faellig", value: "06. Mai 2026" },
          { label: "Kunde", value: "Orbit Systems" },
          { label: "Erstellt", value: "21. Apr 2026" },
        ],
        lineItems: [
          { desc: "API Entwicklung", qty: "18 Std", rate: "130 EUR", amount: "2.340 EUR" },
          { desc: "Monitoring Setup", qty: "1", rate: "640 EUR", amount: "640 EUR" },
        ],
        total: "2.980 EUR",
        thanksText: "Zahlbar innerhalb von 14 Tagen.",
      },
      {
        id: "eu-3",
        business: "Nord Content Lab",
        businessType: "Content & Campaigns",
        status: "Bezahlt",
        metaFields: [
          { label: "Rechnung", value: "#NC-2026-114" },
          { label: "Faellig", value: "02. Mai 2026" },
          { label: "Kunde", value: "Helio Media" },
          { label: "Erstellt", value: "16. Apr 2026" },
        ],
        lineItems: [
          { desc: "Content Paket", qty: "10", rate: "180 EUR", amount: "1.800 EUR" },
          { desc: "Landingpage Copy", qty: "2", rate: "450 EUR", amount: "900 EUR" },
        ],
        total: "2.700 EUR",
        thanksText: "Vielen Dank fuer die Zusammenarbeit.",
      },
    ],
  },
};

type HeroProps = {
  region?: string;
};

export function Hero({ region }: HeroProps) {
  const resolvedRegion = resolveRegion(region);
  const content = HERO_BY_REGION[resolvedRegion];
  const slides = useMemo(() => content.slides, [content]);
  const [activeSlide, setActiveSlide] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    setActiveSlide(0);
  }, [resolvedRegion]);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        setScrollY(window.scrollY || 0);
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 40);
    return () => clearTimeout(t);
  }, []);

  const slide = slides[activeSlide];

  const goPrev = () => setActiveSlide((current) => (current - 1 + slides.length) % slides.length);
  const goNext = () => setActiveSlide((current) => (current + 1) % slides.length);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#f6fbff] via-white to-[#f9fcff] dark:from-[#09101d] dark:via-[#0a0f1e] dark:to-[#0b1322] pt-8 pb-12 sm:pt-12 sm:pb-16 lg:pt-20 lg:pb-24 2xl:pt-24 2xl:pb-28">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-20 -left-8" style={{ transform: `translateY(${scrollY * 0.16}px)` }}>
          <div className="rs-float h-48 w-48 rounded-full bg-[#dceeff] blur-3xl opacity-95 dark:bg-[#103159] dark:opacity-45" />
        </div>
        <div className="absolute top-16 right-4" style={{ transform: `translateY(${scrollY * -0.14}px)` }}>
          <div className="rs-float rs-delay-3 h-44 w-44 rounded-full bg-[#dff6e2] blur-3xl opacity-90 dark:bg-[#204d20] dark:opacity-40" />
        </div>
        <div className="absolute inset-0 opacity-50 dark:opacity-20" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, rgba(24,95,165,0.14) 1px, transparent 0)", backgroundSize: "30px 30px" }} />
      </div>
      <div className="mx-auto max-w-[1180px] px-4 sm:px-6 lg:px-10 xl:max-w-[1360px] 2xl:max-w-[1560px] min-[1900px]:max-w-[1760px]">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-14 lg:items-stretch xl:gap-16 2xl:gap-20 min-[1900px]:grid-cols-[1.08fr_0.92fr]">

          {/* ── Left column ── */}
          <div
            className={`flex flex-col lg:max-w-[560px] lg:py-2 xl:max-w-[620px] 2xl:max-w-[700px] min-[1900px]:max-w-[760px] transition-all duration-1000 ease-[cubic-bezier(0.18,0.78,0.22,1)] ${
              entered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
            }`}
          >
            <div>
              {/* Badge */}
              <div className={`mb-5 inline-flex items-center gap-2 rounded-full bg-[#E6F1FB] dark:bg-[#0d2540] px-3 py-1.5 transition-all duration-700 delay-100 ${entered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
                <span className="h-1.5 w-1.5 rounded-full bg-[#185FA5]" />
                <span className="text-[12px] font-medium text-[#185FA5]">
                  {content.badgeText}
                </span>
              </div>

              {/* Headline */}
              <h1 className={`text-[32px] font-medium leading-[1.2] tracking-[-0.5px] text-slate-900 dark:text-white sm:text-[40px] lg:text-[44px] xl:text-[50px] 2xl:text-[56px] min-[1900px]:text-[62px] transition-all duration-700 delay-150 ${entered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
                {content.headlineStart}{" "}
                <em className="not-italic text-[#185FA5]">{content.headlineAccent}</em>
              </h1>

              {/* Sub */}
              <p className={`mt-5 max-w-[500px] text-[14px] leading-[1.7] text-slate-500 dark:text-slate-400 sm:text-[15px] xl:max-w-[580px] xl:text-[16px] 2xl:max-w-[640px] 2xl:text-[17px] min-[1900px]:max-w-[700px] transition-all duration-700 delay-200 ${entered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
                {content.subtitle}
              </p>

              {/* CTAs */}
              <div className={`mt-7 flex flex-wrap items-center gap-3 sm:mt-9 sm:gap-4 transition-all duration-700 delay-250 ${entered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
                {/* Primary */}
                <Link href="/invoice" id="hero-generate-btn">
                  <span className="inline-flex items-center gap-2 rounded-[8px] bg-[#185FA5] px-4 py-2.5 text-[13px] font-medium text-white transition-colors duration-150 hover:bg-[#1a6ab8] sm:px-5 sm:py-[11px] sm:text-[14px] cursor-pointer">
                    {content.primaryCta}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </Link>

                {/* Secondary — play button style */}
                <Link href="/#how-it-works" id="hero-howitworks-btn">
                  <span className="inline-flex items-center gap-2 text-[13px] text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors duration-150 sm:gap-2.5 sm:text-[14px] cursor-pointer">
                    {/* Play circle */}
                    <span className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                      <svg width="8" height="10" viewBox="0 0 8 10" fill="none">
                        <path d="M1 1l6 4-6 4V1z" fill="#185FA5" />
                      </svg>
                    </span>
                    {content.secondaryCta}
                  </span>
                </Link>
              </div>

              {/* Social proof */}
              <div className={`mt-10 flex flex-wrap items-center gap-x-6 gap-y-4 border-t border-slate-100 dark:border-slate-800 pt-6 sm:mt-12 sm:gap-x-8 sm:pt-7 transition-all duration-700 delay-300 ${entered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
                {content.socialProof.map((s) => (
                  <div key={s.lbl}>
                    <p className="text-[18px] font-medium tracking-[-0.4px] text-slate-900 dark:text-white leading-none sm:text-[20px]">
                      {s.num}
                    </p>
                    <p className="mt-1 text-[12px] text-slate-400 dark:text-slate-500">{s.lbl}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* ── Right column: mock invoice ── */}
          <div className="flex items-center lg:justify-end 2xl:justify-center min-[1900px]:justify-end">
            <div
              className={`w-full max-w-[520px] rounded-[12px] border border-slate-200/80 dark:border-slate-700/60 bg-white dark:bg-slate-900 p-4 sm:p-6 shadow-[0_2px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_24px_rgba(0,0,0,0.3)] lg:flex lg:flex-col lg:py-8 xl:max-w-[590px] 2xl:max-w-[660px] min-[1900px]:max-w-[720px] transition-all duration-1000 delay-250 ease-[cubic-bezier(0.18,0.78,0.22,1)] ${
                entered ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-16 scale-[0.97]"
              }`}
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
                  Invoice templates
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={goPrev}
                    className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                    aria-label="Previous invoice"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={goNext}
                    className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                    aria-label="Next invoice"
                  >
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Invoice header */}
              <div className="mb-5 flex items-start justify-between">
                <div>
                  <p className="text-[14px] font-medium text-slate-800 dark:text-slate-200">
                    {slide.business}
                  </p>
                  <p className="mt-0.5 text-[11px] text-slate-400 dark:text-slate-500">
                    {slide.businessType}
                  </p>
                </div>
                <span className="rounded-full bg-[#EAF3DE] dark:bg-[#1a2e0f] px-2.5 py-1 text-[11px] font-medium text-[#3B6D11] dark:text-[#7ac94a]">
                  {slide.status}
                </span>
              </div>

              {/* Meta grid */}
              <div className="mb-5 grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
                {slide.metaFields.map((f) => (
                  <div key={f.label}>
                    <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-[0.4px] text-slate-400 dark:text-slate-500">
                      {f.label}
                    </p>
                    <p className="text-[13px] font-medium text-slate-800 dark:text-slate-200">
                      {f.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Line items table */}
              <div className="mb-4 overflow-x-auto rounded-lg border border-slate-100 dark:border-slate-800">
                <table className="w-full min-w-[430px] text-[12px]">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60">
                      {content.tableHeaders.map((h) => (
                        <th
                          key={h}
                          className={`px-3 py-2.5 text-[10px] font-semibold uppercase tracking-[0.4px] text-slate-400 dark:text-slate-500 ${h !== content.tableHeaders[0] ? "text-right" : "text-left"}`}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {slide.lineItems.map((r) => (
                      <tr key={r.desc}>
                        <td className="px-3 py-2.5 text-slate-700 dark:text-slate-300">{r.desc}</td>
                        <td className="px-3 py-2.5 text-right text-slate-400 dark:text-slate-500">{r.qty}</td>
                        <td className="px-3 py-2.5 text-right text-slate-400 dark:text-slate-500">{r.rate}</td>
                        <td className="px-3 py-2.5 text-right text-slate-700 dark:text-slate-300 font-medium">{r.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Total */}
              <div className="flex justify-end">
                <div className="text-right">
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 mb-0.5">{content.totalDueText}</p>
                  <p className="text-[22px] font-medium tracking-[-0.4px] text-[#185FA5]">
                    {slide.total}
                  </p>
                </div>
              </div>

              {/* Invoice footer */}
              <div className="mt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-3.5">
                <span className="text-[11px] text-slate-400 dark:text-slate-500">
                  {slide.thanksText}
                </span>
                <Link href="/invoice" id="hero-card-download-btn">
                  <span className="inline-flex items-center rounded-[6px] bg-[#185FA5] px-3.5 py-1.5 text-[11px] font-medium text-white hover:bg-[#1a6ab8] transition-colors cursor-pointer">
                    {content.downloadPdfText}
                  </span>
                </Link>
              </div>

              <div className="mt-4 flex items-center justify-center gap-1.5 lg:mt-auto">
                {slides.map((item, index) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveSlide(index)}
                    className={`h-1.5 rounded-full transition-all ${
                      index === activeSlide
                        ? "w-5 bg-[#185FA5]"
                        : "w-1.5 bg-slate-300 dark:bg-slate-700"
                    }`}
                    aria-label={`Go to invoice ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
