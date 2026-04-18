"use client";

import { useState } from "react";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import { Download, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface PartyDetails {
  businessName: string;
  phone: string;
  gstin?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  state?: string;
  email?: string;
  pan?: string;
  customField?: string;
}

export interface LineItem {
  item: string;
  hsnSac?: string;
  gstRate: number;
  quantity: number;
  rate: number;
  description?: string;
}

export type InvoiceTheme = "modern" | "classic" | "elegant";

export interface InvoiceData {
  invoiceNo: string;
  invoiceDate: string;
  dueDate?: string;
  businessLogoUrl?: string;
  invoiceTheme: InvoiceTheme;
  currency: string;
  seller: PartyDetails;
  client: PartyDetails;
  lineItems: LineItem[];
  gstEnabled: boolean;
  discount: number;
  additionalCharges: number;
  roundOff: "none" | "up" | "down";
  notes?: string;
  terms?: string;
  additionalInfo?: string;
  contactDetails?: string;
  shippingDetails?: string;
  recurringInvoice: boolean;
  showTotalInWords: boolean;
  advancedOptions: {
    hidePlaceOfSupply: boolean;
    showTaxSummary: boolean;
    showHsnSummary: boolean;
    showOriginalImages: boolean;
    showThumbnails: boolean;
    showDescriptionFullWidth: boolean;
    hideSubtotalForGroupItems: boolean;
    showSku: boolean;
    showSerialNumbers: boolean;
    displayBatchDetails: boolean;
  };
}

interface InvoicePreviewProps {
  data: InvoiceData;
  invoiceNumber: string;
}

function formatCurrency(value: number, currency: string) {
  return `${currency} ${value.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function numberToWords(num: number): string {
  const belowTwenty = [
    "zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten",
    "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen",
  ];
  const tens = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];

  if (num < 20) return belowTwenty[num];
  if (num < 100) {
    const t = Math.floor(num / 10);
    const r = num % 10;
    return r ? `${tens[t]} ${belowTwenty[r]}` : tens[t];
  }
  if (num < 1000) {
    const h = Math.floor(num / 100);
    const r = num % 100;
    return r ? `${belowTwenty[h]} hundred ${numberToWords(r)}` : `${belowTwenty[h]} hundred`;
  }

  const units = [
    { value: 10000000, label: "crore" },
    { value: 100000, label: "lakh" },
    { value: 1000, label: "thousand" },
  ];

  for (const unit of units) {
    if (num >= unit.value) {
      const q = Math.floor(num / unit.value);
      const r = num % unit.value;
      return r
        ? `${numberToWords(q)} ${unit.label} ${numberToWords(r)}`
        : `${numberToWords(q)} ${unit.label}`;
    }
  }

  return String(num);
}

function amountToWords(total: number) {
  const rounded = Number(total.toFixed(2));
  const rupees = Math.floor(rounded);
  const paise = Math.round((rounded - rupees) * 100);
  const rupeeText = `${numberToWords(rupees)} rupee${rupees === 1 ? "" : "s"}`;
  const paiseText = paise ? ` and ${numberToWords(paise)} paise` : "";
  return `${rupeeText}${paiseText} only`;
}

export function InvoicePreview({ data, invoiceNumber }: InvoicePreviewProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const invoiceTheme = data.invoiceTheme || "modern";
  const isClassic = invoiceTheme === "classic";
  const isElegant = invoiceTheme === "elegant";

  const shellClass = isClassic
    ? "overflow-hidden rounded-none border border-slate-500 bg-white shadow-none print:rounded-none print:border-slate-500 print:bg-white print:shadow-none dark:border-white/[0.15] dark:bg-slate-950"
    : isElegant
      ? "overflow-hidden rounded-sm border border-slate-400 bg-white shadow-none print:rounded-none print:border-slate-400 print:bg-white print:shadow-none dark:border-white/[0.12] dark:bg-slate-950"
      : "overflow-hidden rounded-sm border border-slate-300 bg-white shadow-none print:rounded-none print:border-slate-300 print:bg-white print:shadow-none dark:border-white/[0.1] dark:bg-slate-950";

  const panelClass = isClassic
    ? "rounded-none border border-slate-400 bg-white p-3 print:border-slate-400 print:bg-white dark:border-white/[0.15] dark:bg-slate-950"
    : isElegant
      ? "rounded-sm border border-slate-300 bg-white p-3 print:border-slate-300 print:bg-white dark:border-white/[0.1] dark:bg-slate-950"
      : "rounded-sm border border-slate-200 bg-white p-3 print:border-slate-300 print:bg-white dark:border-white/[0.08] dark:bg-slate-950";

  const tableBorderClass = isClassic
    ? "overflow-hidden rounded-none border border-slate-500 print:border-slate-500 dark:border-white/[0.15]"
    : isElegant
      ? "overflow-hidden rounded-sm border border-[#cfb79f] print:border-[#cfb79f] dark:border-[#5c4a3a]"
      : "overflow-hidden rounded-sm border border-slate-300/90 print:border-slate-300 dark:border-white/[0.08]";

  const tableHeadClass = isClassic
    ? "border-b border-slate-500 bg-slate-100 print:border-slate-500 print:bg-slate-100 dark:border-white/[0.15] dark:bg-white/[0.04]"
    : isElegant
      ? "border-b border-slate-400 bg-slate-100 print:border-slate-400 print:bg-slate-100 dark:border-white/[0.1] dark:bg-white/[0.04]"
      : "border-b border-slate-300 bg-slate-100 print:border-slate-300 print:bg-slate-100 dark:border-white/[0.08] dark:bg-white/[0.04]";

  const totalRowClass = isClassic
    ? "border-t-2 border-slate-600 bg-slate-100 print:border-slate-600 print:bg-slate-100 dark:border-white/[0.2] dark:bg-white/[0.06]"
    : isElegant
      ? "border-t-2 border-slate-500 bg-slate-100 print:border-slate-500 print:bg-slate-100 dark:border-white/[0.12] dark:bg-white/[0.06]"
      : "border-t-2 border-slate-500 bg-slate-100 print:border-slate-500 print:bg-slate-100 dark:border-white/[0.12] dark:bg-white/[0.06]";

  const accentTextClass = "text-slate-900 dark:text-white";

  const lineSummary = data.lineItems.map((item) => {
    const amount = item.quantity * item.rate;
    const gstAmount = data.gstEnabled ? (amount * item.gstRate) / 100 : 0;
    const total = amount + gstAmount;
    return { ...item, amount, gstAmount, total };
  });

  const subtotal = lineSummary.reduce((sum, item) => sum + item.amount, 0);
  const totalTax = lineSummary.reduce((sum, item) => sum + item.gstAmount, 0);
  let finalTotal = subtotal + totalTax - data.discount + data.additionalCharges;
  if (data.roundOff === "up") finalTotal = Math.ceil(finalTotal);
  if (data.roundOff === "down") finalTotal = Math.floor(finalTotal);

  const invoiceDate = data.invoiceDate || new Date().toISOString().slice(0, 10);
  const invoiceDateText = new Date(invoiceDate).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  });
  const dueDateText = data.dueDate
    ? new Date(data.dueDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
    : "-";

  const handleWhatsApp = () => {
    const msg = encodeURIComponent(
      `Hi ${data.client.businessName || "there"},\n\nPlease find your invoice from *RefineSplit* below:\n\n` +
      `📋 Invoice #${invoiceNumber}\n📅 Date: ${invoiceDateText}\n\n` +
      `${lineSummary
        .map((item) => `📦 ${item.item}: ${formatCurrency(item.total, data.currency)}`)
        .join("\n")}\n\n` +
      `✅ *Total: ${formatCurrency(finalTotal, data.currency)}*\n\n` +
      (data.notes ? `📝 ${data.notes}\n\n` : "") +
      `_Generated with RefineSplit · refinesplit.app_`
    );
    const phone = data.client.phone.replace(/\D/g, "");
    window.open(`https://wa.me/${phone ? `91${phone}` : ""}?text=${msg}`, "_blank");
  };

  const handleDownloadPdf = async () => {
    const invoiceElement = document.getElementById("invoice-preview");
    if (!invoiceElement || isDownloading) return;

    try {
      setIsDownloading(true);

      const imageData = await toPng(invoiceElement, {
        pixelRatio: 2,
        cacheBust: true,
        backgroundColor: "#ffffff",
      });

      const pdf = new jsPDF("p", "mm", "a4");
      const imageInfo = pdf.getImageProperties(imageData);
      const pageWidth = 210;
      const pageHeight = 297;
      const margin = 8;
      const printableWidth = pageWidth - margin * 2;
      const printableHeight = pageHeight - margin * 2;
      const imageHeight = (imageInfo.height * printableWidth) / imageInfo.width;

      let remainingHeight = imageHeight;
      let offsetY = margin;

      pdf.addImage(imageData, "PNG", margin, offsetY, printableWidth, imageHeight, undefined, "FAST");
      remainingHeight -= printableHeight;

      while (remainingHeight > 0) {
        pdf.addPage();
        offsetY = margin - (imageHeight - remainingHeight);
        pdf.addImage(imageData, "PNG", margin, offsetY, printableWidth, imageHeight, undefined, "FAST");
        remainingHeight -= printableHeight;
      }

      pdf.save(`invoice-${invoiceNumber}.pdf`);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-[210mm] space-y-2 print:max-w-none print:space-y-0">
      <div className="sr-only print:hidden" aria-hidden>
        <Button
          variant="whatsapp"
          size="sm"
          onClick={handleWhatsApp}
          id="whatsapp-share-btn"
          className="h-8 rounded-full px-3 text-xs font-medium"
        >
          <Share2 className="h-3.5 w-3.5 mr-1.5" />
          WhatsApp
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleDownloadPdf}
          id="download-pdf-btn"
          className="h-8 rounded-full px-3 text-xs font-medium dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600"
          disabled={isDownloading}
        >
          <Download className="h-3.5 w-3.5 mr-1.5" />
          {isDownloading ? "Preparing..." : "Download PDF"}
        </Button>
      </div>

      <div
        id="invoice-preview"
        className={shellClass}
      >
        <div className="px-4 py-4 sm:px-5 sm:py-5 print:px-6 print:py-6">
          <div className="flex flex-col items-start justify-between gap-3 border-b border-slate-300/90 pb-3 print:border-slate-300 sm:flex-row dark:border-white/[0.08]">
            <div className="w-full sm:w-auto">
              <div className="flex items-start gap-2.5">
                {data.businessLogoUrl && (
                  <img
                    src={data.businessLogoUrl}
                    alt="Business logo"
                    className="h-10 w-10 rounded-sm border border-slate-200 object-cover dark:border-white/[0.1]"
                  />
                )}
                <div>
                  <p className={`text-xs font-semibold tracking-[0.18em] text-slate-500 dark:text-slate-400 ${isClassic ? "uppercase" : ""}`}>Invoice</p>
                  <h2 className="mt-0.5 text-xl font-bold tracking-tight text-slate-900 dark:text-white">#{invoiceNumber}</h2>
                </div>
              </div>
            </div>
            <div className={`w-full min-w-0 p-3 sm:w-auto sm:min-w-[220px] ${panelClass}`}>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                <span className="text-slate-500 dark:text-slate-400">Invoice Date</span>
                <span className="text-right font-semibold text-slate-800 dark:text-slate-200">{invoiceDateText}</span>
                <span className="text-slate-500 dark:text-slate-400">Due Date</span>
                <span className="text-right font-semibold text-slate-800 dark:text-slate-200">{dueDateText}</span>
                <span className="text-slate-500 dark:text-slate-400">Currency</span>
                <span className="text-right font-semibold text-slate-800 dark:text-slate-200">{data.currency}</span>
              </div>
            </div>
          </div>

          <div className="mt-3 space-y-3">
            <div className="grid gap-4 md:grid-cols-2">
              <div className={panelClass}>
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">From</p>
                <p className="mt-2 text-base font-bold text-slate-900 dark:text-white">{data.seller.businessName || "-"}</p>
                {data.seller.phone && <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">+91 {data.seller.phone}</p>}
                {data.seller.email && <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{data.seller.email}</p>}
                {data.seller.gstin && <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">GSTIN: {data.seller.gstin}</p>}
                {data.seller.address && <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{data.seller.address}</p>}
              </div>

              <div className={panelClass}>
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">Bill To</p>
                <p className="mt-2 text-base font-bold text-slate-900 dark:text-white">{data.client.businessName || "-"}</p>
                {data.client.phone && <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">+91 {data.client.phone}</p>}
                {data.client.email && <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{data.client.email}</p>}
                {data.client.gstin && <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">GSTIN: {data.client.gstin}</p>}
                {data.client.address && <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{data.client.address}</p>}
              </div>
            </div>

            <div className={`${tableBorderClass} overflow-x-auto`}>
              <table className="w-full min-w-[560px] text-sm">
                <thead>
                  <tr className={tableHeadClass}>
                    <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Item</th>
                    <th className="px-3 py-2 text-right text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Qty</th>
                    <th className="px-3 py-2 text-right text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Rate</th>
                    {data.gstEnabled && <th className="px-3 py-2 text-right text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">GST</th>}
                    <th className="px-3 py-2 text-right text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {lineSummary.map((item, idx) => (
                    <tr key={`${item.item}-${idx}`} className="border-t border-slate-200/80 print:border-slate-300 dark:border-white/[0.06]">
                      <td className="px-3 py-2.5 font-medium text-slate-800 dark:text-slate-200">
                        <p>{item.item || "-"}</p>
                        {item.hsnSac && <p className="mt-1 text-[11px] text-slate-500">HSN/SAC: {item.hsnSac}</p>}
                        {item.description && <p className="mt-1 text-[11px] text-slate-500">{item.description}</p>}
                      </td>
                      <td className="px-3 py-2.5 text-right text-slate-700 dark:text-slate-300">{item.quantity}</td>
                      <td className="px-3 py-2.5 text-right text-slate-700 dark:text-slate-300">{formatCurrency(item.rate, data.currency)}</td>
                      {data.gstEnabled && <td className="px-3 py-2.5 text-right text-slate-700 dark:text-slate-300">{formatCurrency(item.gstAmount, data.currency)}</td>}
                      <td className="px-3 py-2.5 text-right font-semibold text-slate-800 dark:text-slate-200">{formatCurrency(item.total, data.currency)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t border-slate-300/90 bg-slate-50/80 print:border-slate-300 print:bg-slate-50 dark:border-white/[0.08] dark:bg-white/[0.03]">
                    <td colSpan={data.gstEnabled ? 4 : 3} className="px-3 py-2 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Subtotal</td>
                    <td className="px-3 py-2 text-right text-sm font-semibold text-slate-700 dark:text-slate-300">{formatCurrency(subtotal, data.currency)}</td>
                  </tr>
                  {data.gstEnabled && (
                    <tr className="border-t border-slate-300/90 bg-slate-50/80 print:border-slate-300 print:bg-slate-50 dark:border-white/[0.08] dark:bg-white/[0.03]">
                      <td colSpan={4} className="px-3 py-2 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Tax</td>
                      <td className="px-3 py-2 text-right text-sm font-semibold text-slate-700 dark:text-slate-300">{formatCurrency(totalTax, data.currency)}</td>
                    </tr>
                  )}
                  {data.discount > 0 && (
                    <tr className="border-t border-slate-300/90 bg-slate-50/80 print:border-slate-300 print:bg-slate-50 dark:border-white/[0.08] dark:bg-white/[0.03]">
                      <td colSpan={data.gstEnabled ? 4 : 3} className="px-3 py-2 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Discount</td>
                      <td className="px-3 py-2 text-right text-sm font-semibold text-emerald-600">- {formatCurrency(data.discount, data.currency)}</td>
                    </tr>
                  )}
                  {data.additionalCharges > 0 && (
                    <tr className="border-t border-slate-300/90 bg-slate-50/80 print:border-slate-300 print:bg-slate-50 dark:border-white/[0.08] dark:bg-white/[0.03]">
                      <td colSpan={data.gstEnabled ? 4 : 3} className="px-3 py-2 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Additional Charges</td>
                      <td className="px-3 py-2 text-right text-sm font-semibold text-slate-700 dark:text-slate-300">+ {formatCurrency(data.additionalCharges, data.currency)}</td>
                    </tr>
                  )}
                  <tr className={totalRowClass}>
                    <td colSpan={data.gstEnabled ? 4 : 3} className="px-3 py-2.5 font-bold text-slate-900 dark:text-white">Total Due</td>
                    <td className={`px-3 py-2.5 text-right text-lg font-extrabold ${accentTextClass}`}>{formatCurrency(finalTotal, data.currency)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {data.showTotalInWords && (
              <div className={panelClass}>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total in words</p>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-700 dark:text-slate-200">{amountToWords(finalTotal)}</p>
              </div>
            )}

            {data.notes && (
              <div className={panelClass}>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Notes</p>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-700 dark:text-slate-200">{data.notes}</p>
              </div>
            )}

            {data.terms && (
              <div className={panelClass}>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Terms and Conditions</p>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-700 dark:text-slate-200">{data.terms}</p>
              </div>
            )}

            {(data.additionalInfo || data.contactDetails || data.shippingDetails) && (
              <div className={panelClass}>
                {data.shippingDetails && <p className="text-xs text-slate-600 dark:text-slate-300">Shipping: {data.shippingDetails}</p>}
                {data.additionalInfo && <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">Info: {data.additionalInfo}</p>}
                {data.contactDetails && <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">Contact: {data.contactDetails}</p>}
              </div>
            )}

            <div className="border-t border-slate-300/90 pt-1 print:border-slate-300 dark:border-white/[0.08]" />
          </div>
        </div>
      </div>
    </div>
  );

}

