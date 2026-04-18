"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { InvoiceForm } from "@/components/invoice/InvoiceForm";
import { InvoicePreview, InvoiceData, InvoiceTheme } from "@/components/invoice/InvoicePreview";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const PREVIEW_THEMES: Array<{ value: InvoiceTheme; label: string }> = [
  { value: "modern", label: "Modern" },
  { value: "classic", label: "Classic" },
  { value: "elegant", label: "Elegant" },
];

function generateInvoiceNumber() {
  const d = new Date();
  const yy = String(d.getFullYear()).slice(-2);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const rand = Math.floor(Math.random() * 900 + 100);
  return `RS-${yy}${mm}-${rand}`;
}

export default function InvoicePage() {
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [invoiceNumber, setInvoiceNumber] = useState("RS-0000-000");
  const [previewTheme, setPreviewTheme] = useState<InvoiceTheme>("modern");

  useEffect(() => { setInvoiceNumber(generateInvoiceNumber()); }, []);

  const handlePreview = (data: InvoiceData) => {
    setInvoiceData(data);
    setPreviewTheme(data.invoiceTheme || "modern");
    setPreviewOpen(true);
  };

  const handleReset = () => {
    setInvoiceData(null);
    setPreviewOpen(false);
    setPreviewTheme("modern");
    setInvoiceNumber(generateInvoiceNumber());
  };

  const triggerPreviewAction = (id: string) => {
    const btn = document.getElementById(id) as HTMLButtonElement | null;
    btn?.click();
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-slate-50 dark:bg-[#0a0f1e] py-4 sm:py-6">
        <div className="mx-auto w-full max-w-[96vw] px-3 sm:px-5 lg:px-6">
          <div className="rounded-2xl border border-slate-200/60 dark:border-white/[0.06] bg-white dark:bg-slate-900 p-4 sm:p-5 lg:p-6 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-violet-500" />
              Invoice Details
            </h2>
            <p className="mb-4 text-xs text-slate-500 dark:text-slate-400">
              Preview opens in a popup. Use the eye button anytime.
            </p>
            <InvoiceForm
              invoiceNumber={invoiceNumber}
              onPreview={handlePreview}
            />
          </div>
        </div>
      </main>
      <Footer />

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="w-[calc(100vw-0.5rem)] max-w-6xl max-h-[95vh] overflow-y-auto p-2 sm:w-[calc(100vw-1rem)] sm:p-4">
          <DialogHeader className="mb-1">
            <div className="flex flex-col items-start justify-between gap-2 pr-6 sm:flex-row sm:items-center sm:pr-8">
              <DialogTitle>Invoice Preview</DialogTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                id="create-new-btn"
                className="text-xs text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              >
                ← New Invoice
              </Button>
            </div>
            <div className="mt-1.5 flex flex-wrap items-center justify-between gap-2">
              <div className="flex gap-2 overflow-x-auto pb-1">
                {PREVIEW_THEMES.map((theme) => {
                  const active = previewTheme === theme.value;
                  return (
                    <button
                      key={theme.value}
                      type="button"
                      onClick={() => setPreviewTheme(theme.value)}
                      className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                        active
                          ? "border-violet-500 bg-violet-50 text-violet-700 dark:border-violet-400 dark:bg-violet-500/15 dark:text-violet-200"
                          : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
                      }`}
                    >
                      {theme.label}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="whatsapp"
                  size="sm"
                  onClick={() => triggerPreviewAction("whatsapp-share-btn")}
                  className="h-8 rounded-full px-3 text-xs font-medium"
                >
                  WhatsApp
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => triggerPreviewAction("download-pdf-btn")}
                  className="h-8 rounded-full px-3 text-xs font-medium"
                >
                  Download PDF
                </Button>
              </div>
            </div>
          </DialogHeader>

          {invoiceData ? (
            <InvoicePreview data={{ ...invoiceData, invoiceTheme: previewTheme }} invoiceNumber={invoiceNumber} />
          ) : (
            <div className="rounded-2xl border-2 border-dashed border-slate-200 dark:border-white/[0.07] bg-white dark:bg-slate-900 p-10 text-center">
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">No preview data yet</p>
              <p className="text-xs text-slate-400 dark:text-slate-600 mt-1.5 leading-relaxed">
                Fill in details and use the eye button to open preview.
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
