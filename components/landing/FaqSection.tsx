"use client";

import { useState } from "react";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { resolveRegion, type SupportedRegion } from "@/lib/pricingLocalization";

type FaqItem = {
  question: string;
  answer: string;
};

type FaqContent = {
  badge: string;
  title: string;
  subtitle: string;
  items: FaqItem[];
};

const FAQ_BY_REGION: Record<SupportedRegion, FaqContent> = {
  IN: {
    badge: "FAQ",
    title: "Common questions, answered clearly",
    subtitle: "Everything you need to know before sending your first invoice.",
    items: [
      {
        question: "Do I need to sign up to create an invoice?",
        answer:
          "No. You can create, preview, download PDF, and share via WhatsApp without signing up. Signup is only needed if you explicitly want to save and reuse invoices later.",
      },
      {
        question: "Is my invoice data stored on your servers?",
        answer:
          "By default, your invoice flow runs directly in the browser. If you choose account features like save and reuse, then data is linked to your account.",
      },
      {
        question: "Can I download and send invoices instantly?",
        answer:
          "Yes. You can download PDF instantly and also share invoice details via WhatsApp in one click from preview.",
      },
      {
        question: "Can I add GST and business logo?",
        answer:
          "Yes. You can enable GST, configure rates per item, and add your business logo for professional client-ready invoices.",
      },
      {
        question: "Is this suitable for freelancers and agencies?",
        answer:
          "Absolutely. It is built for freelancers, consultants, creators, and small teams who need fast invoicing.",
      },
    ],
  },
  US: {
    badge: "FAQ",
    title: "Common questions, answered clearly",
    subtitle: "Everything you need to know before sending your first invoice.",
    items: [
      {
        question: "Do I need an account to create invoices?",
        answer:
          "No. You can create, preview, download PDF, and share via WhatsApp without an account. Sign up only if you want save-and-reuse workflows.",
      },
      {
        question: "Is invoice data private?",
        answer:
          "Your default invoice workflow runs in-browser. Data is associated with your account only when you explicitly use account features.",
      },
      {
        question: "Can I export and send invoices immediately?",
        answer:
          "Yes. You can export to PDF and share via WhatsApp directly from preview in seconds.",
      },
      {
        question: "Can I include taxes and my business logo?",
        answer:
          "Yes. You can add your logo and configure tax per line item for accurate billing.",
      },
      {
        question: "Who is this built for?",
        answer:
          "Freelancers, consultants, agencies, and small businesses that need a clean and fast billing flow.",
      },
    ],
  },
  EU: {
    badge: "FAQ",
    title: "Haeufige Fragen, klar beantwortet",
    subtitle: "Alles Wichtige, bevor du deine erste Rechnung sendest.",
    items: [
      {
        question: "Muss ich mich registrieren, um Rechnungen zu erstellen?",
        answer:
          "Nein. Du kannst Rechnungen ohne Registrierung erstellen, als PDF herunterladen und per WhatsApp teilen. Registrierung ist nur fuer Speichern und Wiederverwenden noetig.",
      },
      {
        question: "Werden meine Rechnungsdaten gespeichert?",
        answer:
          "Standardmaessig laeuft der Rechnungsablauf direkt im Browser. Daten werden nur dann einem Konto zugeordnet, wenn du Kontofunktionen aktiv nutzt.",
      },
      {
        question: "Kann ich Rechnungen sofort exportieren und senden?",
        answer:
          "Ja. Du kannst die Rechnung sofort als PDF exportieren und direkt aus der Vorschau per WhatsApp teilen.",
      },
      {
        question: "Kann ich Steuer und Logo hinzufuegen?",
        answer:
          "Ja. Du kannst Steuer je Position konfigurieren und dein Firmenlogo einfuegen.",
      },
      {
        question: "Fuer wen ist das gedacht?",
        answer:
          "Fuer Freelancer, Agenturen und kleine Teams, die Rechnungen schnell und professionell erstellen wollen.",
      },
    ],
  },
};

type FaqSectionProps = {
  region?: string;
};

export function FaqSection({ region }: FaqSectionProps) {
  const resolvedRegion = resolveRegion(region);
  const content = FAQ_BY_REGION[resolvedRegion];
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-white dark:bg-[#0a0f1e] py-16 sm:py-20">
      <div className="mx-auto max-w-[1100px] px-6 lg:px-10">
        <div className="mb-10 text-center">
          <RevealOnScroll once={false}>
            <p className="mb-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-[#185FA5]">
              {content.badge}
            </p>
          </RevealOnScroll>
          <RevealOnScroll delay={80} once={false}>
            <h2 className="text-[26px] font-medium tracking-[-0.4px] text-slate-900 dark:text-white">
              {content.title}
            </h2>
          </RevealOnScroll>
          <RevealOnScroll delay={140} once={false}>
            <p className="mt-2 text-[15px] text-slate-500 dark:text-slate-400">
              {content.subtitle}
            </p>
          </RevealOnScroll>
        </div>

        <div className="mx-auto max-w-[900px] space-y-3">
          {content.items.map((item, i) => (
            <RevealOnScroll key={item.question} delay={60 * ((i % 4) + 1)} once={false}>
              <div className={`rounded-xl border p-4 transition ${openIndex === i ? "border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-900" : "border-slate-200/80 bg-slate-50/60 dark:border-slate-700/60 dark:bg-slate-900/60"}`}>
                <button
                  type="button"
                  onClick={() => setOpenIndex((prev) => (prev === i ? null : i))}
                  aria-expanded={openIndex === i}
                  className="flex w-full items-start justify-between gap-3 text-left"
                >
                  <span className="text-[14px] font-medium text-slate-900 dark:text-slate-100">{item.question}</span>
                  <span className={`mt-0.5 shrink-0 text-slate-400 transition-transform ${openIndex === i ? "rotate-45" : ""}`}>+</span>
                </button>
                {openIndex === i && (
                  <p className="mt-2.5 text-[13.5px] leading-[1.7] text-slate-600 dark:text-slate-300">
                    {item.answer}
                  </p>
                )}
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
