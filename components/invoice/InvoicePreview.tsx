"use client";

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

export interface InvoiceData {
  invoiceNo: string;
  invoiceDate: string;
  dueDate?: string;
  businessLogoUrl?: string;
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

  return (
    <div className="mx-auto w-full max-w-[210mm] space-y-3 print:max-w-none print:space-y-0">
      <div
        id="invoice-preview"
        className="overflow-hidden rounded-md border border-slate-300/90 bg-white shadow-sm shadow-slate-900/5 print:rounded-none print:border-slate-300 print:bg-white print:shadow-none dark:border-white/[0.08] dark:bg-slate-950"
      >
        <div className="px-5 py-5 sm:px-7 sm:py-7 print:px-8 print:py-8">
          <div className="flex items-start justify-between gap-4 border-b border-slate-300/90 pb-5 print:border-slate-300 dark:border-white/[0.08]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Invoice</p>
              <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">#{invoiceNumber}</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Generated with RefineSplit</p>
            </div>
            <div className="min-w-[220px] rounded-sm border border-slate-300/90 bg-slate-50 p-3 print:border-slate-300 print:bg-white dark:border-white/[0.08] dark:bg-white/[0.03]">
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

          <div className="mt-5 space-y-5">
            {data.businessLogoUrl && (
              <div className="rounded-sm border border-slate-300/90 p-3 print:border-slate-300 dark:border-white/[0.08]">
                <img src={data.businessLogoUrl} alt="Business logo" className="h-14 w-14 rounded-sm object-cover" />
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-sm border border-slate-300/90 bg-slate-50 p-4 print:border-slate-300 print:bg-white dark:border-white/[0.08] dark:bg-white/[0.03]">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">From</p>
                <p className="mt-2 text-base font-bold text-slate-900 dark:text-white">{data.seller.businessName || "-"}</p>
                {data.seller.phone && <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">+91 {data.seller.phone}</p>}
                {data.seller.email && <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{data.seller.email}</p>}
                {data.seller.gstin && <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">GSTIN: {data.seller.gstin}</p>}
                {data.seller.address && <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{data.seller.address}</p>}
              </div>

              <div className="rounded-sm border border-slate-300/90 bg-slate-50 p-4 print:border-slate-300 print:bg-white dark:border-white/[0.08] dark:bg-white/[0.03]">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">Bill To</p>
                <p className="mt-2 text-base font-bold text-slate-900 dark:text-white">{data.client.businessName || "-"}</p>
                {data.client.phone && <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">+91 {data.client.phone}</p>}
                {data.client.email && <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{data.client.email}</p>}
                {data.client.gstin && <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">GSTIN: {data.client.gstin}</p>}
                {data.client.address && <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{data.client.address}</p>}
              </div>
            </div>

            <div className="overflow-hidden rounded-sm border border-slate-300/90 print:border-slate-300 dark:border-white/[0.08]">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-300/90 bg-slate-100/80 print:border-slate-300 print:bg-slate-100 dark:border-white/[0.08] dark:bg-white/[0.04]">
                    <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Item</th>
                    <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Qty</th>
                    <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Rate</th>
                    {data.gstEnabled && <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">GST</th>}
                    <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {lineSummary.map((item, idx) => (
                    <tr key={`${item.item}-${idx}`} className="border-t border-slate-200/80 print:border-slate-300 dark:border-white/[0.06]">
                      <td className="px-4 py-4 font-medium text-slate-800 dark:text-slate-200">
                        <p>{item.item || "-"}</p>
                        {item.hsnSac && <p className="mt-1 text-[11px] text-slate-500">HSN/SAC: {item.hsnSac}</p>}
                        {item.description && <p className="mt-1 text-[11px] text-slate-500">{item.description}</p>}
                      </td>
                      <td className="px-4 py-4 text-right text-slate-700 dark:text-slate-300">{item.quantity}</td>
                      <td className="px-4 py-4 text-right text-slate-700 dark:text-slate-300">{formatCurrency(item.rate, data.currency)}</td>
                      {data.gstEnabled && <td className="px-4 py-4 text-right text-slate-700 dark:text-slate-300">{formatCurrency(item.gstAmount, data.currency)}</td>}
                      <td className="px-4 py-4 text-right font-semibold text-slate-800 dark:text-slate-200">{formatCurrency(item.total, data.currency)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t border-slate-300/90 bg-slate-50/80 print:border-slate-300 print:bg-slate-50 dark:border-white/[0.08] dark:bg-white/[0.03]">
                    <td colSpan={data.gstEnabled ? 4 : 3} className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Subtotal</td>
                    <td className="px-4 py-3 text-right text-sm font-semibold text-slate-700 dark:text-slate-300">{formatCurrency(subtotal, data.currency)}</td>
                  </tr>
                  {data.gstEnabled && (
                    <tr className="border-t border-slate-300/90 bg-slate-50/80 print:border-slate-300 print:bg-slate-50 dark:border-white/[0.08] dark:bg-white/[0.03]">
                      <td colSpan={4} className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Tax</td>
                      <td className="px-4 py-3 text-right text-sm font-semibold text-slate-700 dark:text-slate-300">{formatCurrency(totalTax, data.currency)}</td>
                    </tr>
                  )}
                  {data.discount > 0 && (
                    <tr className="border-t border-slate-300/90 bg-slate-50/80 print:border-slate-300 print:bg-slate-50 dark:border-white/[0.08] dark:bg-white/[0.03]">
                      <td colSpan={data.gstEnabled ? 4 : 3} className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Discount</td>
                      <td className="px-4 py-3 text-right text-sm font-semibold text-emerald-600">- {formatCurrency(data.discount, data.currency)}</td>
                    </tr>
                  )}
                  {data.additionalCharges > 0 && (
                    <tr className="border-t border-slate-300/90 bg-slate-50/80 print:border-slate-300 print:bg-slate-50 dark:border-white/[0.08] dark:bg-white/[0.03]">
                      <td colSpan={data.gstEnabled ? 4 : 3} className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Additional Charges</td>
                      <td className="px-4 py-3 text-right text-sm font-semibold text-slate-700 dark:text-slate-300">+ {formatCurrency(data.additionalCharges, data.currency)}</td>
                    </tr>
                  )}
                  <tr className="border-t-2 border-slate-400 bg-slate-100/95 print:border-slate-500 print:bg-slate-100 dark:border-white/[0.12] dark:bg-white/[0.06]">
                    <td colSpan={data.gstEnabled ? 4 : 3} className="px-4 py-4 font-bold text-slate-900 dark:text-white">Total Due</td>
                    <td className="px-4 py-4 text-right text-xl font-extrabold text-slate-900 dark:text-white">{formatCurrency(finalTotal, data.currency)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {data.showTotalInWords && (
              <div className="rounded-sm border border-slate-300/90 bg-slate-50 p-4 print:border-slate-300 print:bg-white dark:border-white/[0.08] dark:bg-white/[0.03]">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total in words</p>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-700 dark:text-slate-200">{amountToWords(finalTotal)}</p>
              </div>
            )}

            {data.notes && (
              <div className="rounded-sm border border-slate-300/90 bg-slate-50 p-4 print:border-slate-300 print:bg-white dark:border-white/[0.08] dark:bg-white/[0.03]">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Notes</p>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-700 dark:text-slate-200">{data.notes}</p>
              </div>
            )}

            {data.terms && (
              <div className="rounded-sm border border-slate-300/90 bg-slate-50 p-4 print:border-slate-300 print:bg-white dark:border-white/[0.08] dark:bg-white/[0.03]">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Terms and Conditions</p>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-700 dark:text-slate-200">{data.terms}</p>
              </div>
            )}

            {(data.additionalInfo || data.contactDetails || data.shippingDetails) && (
              <div className="rounded-sm border border-slate-300/90 bg-slate-50 p-4 print:border-slate-300 print:bg-white dark:border-white/[0.08] dark:bg-white/[0.03]">
                {data.shippingDetails && <p className="text-xs text-slate-600 dark:text-slate-300">Shipping: {data.shippingDetails}</p>}
                {data.additionalInfo && <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">Info: {data.additionalInfo}</p>}
                {data.contactDetails && <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">Contact: {data.contactDetails}</p>}
              </div>
            )}

            <div className="border-t border-slate-300/90 pt-4 text-center print:border-slate-300 dark:border-white/[0.08]">
              <p className="text-[11px] text-slate-500 dark:text-slate-500">Generated by RefineSplit</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 print:hidden">
        <Button variant="whatsapp" onClick={handleWhatsApp} id="whatsapp-share-btn" className="w-full font-semibold">
          <Share2 className="h-4 w-4 mr-1.5" />
          WhatsApp
        </Button>
        <Button variant="secondary" onClick={() => window.print()} id="download-pdf-btn" className="w-full font-semibold dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600">
          <Download className="h-4 w-4 mr-1.5" />
          Download PDF
        </Button>
      </div>
    </div>
  );

}

