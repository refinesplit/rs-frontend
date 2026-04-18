"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { InvoiceForm } from "@/components/invoice/InvoiceForm";
import { InvoicePreview, InvoiceData } from "@/components/invoice/InvoicePreview";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

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

  useEffect(() => { setInvoiceNumber(generateInvoiceNumber()); }, []);

  const handlePreview = (data: InvoiceData) => {
    setInvoiceData(data);
    setPreviewOpen(true);
  };

  const handleReset = () => {
    setInvoiceData(null);
    setPreviewOpen(false);
    setInvoiceNumber(generateInvoiceNumber());
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-slate-50 dark:bg-[#0a0f1e] py-4 sm:py-6">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <div className="rounded-2xl border border-slate-200/60 dark:border-white/[0.06] bg-white dark:bg-slate-900 p-6 shadow-sm">
              <h2 className="text-base font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-violet-500" />
                Invoice Details
              </h2>
              <p className="mb-5 text-xs text-slate-500 dark:text-slate-400">
                Preview opens in a popup. Use the eye button anytime.
              </p>
              <InvoiceForm
                invoiceNumber={invoiceNumber}
                onPreview={handlePreview}
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="w-[calc(100vw-1.5rem)] max-w-6xl max-h-[92vh] overflow-y-auto p-4 sm:p-6">
          <DialogHeader className="mb-2">
            <div className="flex items-center justify-between gap-3 pr-8">
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
          </DialogHeader>

          {invoiceData ? (
            <InvoicePreview data={invoiceData} invoiceNumber={invoiceNumber} />
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
