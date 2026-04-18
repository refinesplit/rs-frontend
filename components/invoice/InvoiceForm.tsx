"use client";

import { useState } from "react";
import { Eye, IndianRupee, Plus, Sparkles, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { InvoiceData, LineItem, PartyDetails } from "./InvoicePreview";

interface InvoiceFormProps {
  invoiceNumber: string;
  onPreview: (data: InvoiceData) => void;
}

const CURRENCIES = ["INR", "USD", "EUR", "GBP"];

type OptionalFieldKey =
  | "dueDate"
  | "shipping"
  | "itemAdvanced"
  | "discountsCharges"
  | "notesTerms"
  | "additionalInfo"
  | "contactDetails"
  | "recurringInvoice"
  | "advancedOptions";

const OPTIONAL_FIELD_OPTIONS: Array<{ key: OptionalFieldKey; label: string; helper: string }> = [
  { key: "dueDate", label: "Due date", helper: "Show payment due date on invoice." },
  { key: "shipping", label: "Shipping details", helper: "Add shipping instructions or address details." },
  { key: "itemAdvanced", label: "Advanced item columns", helper: "Enable extra item columns like HSN/SAC and description." },
  { key: "discountsCharges", label: "Discounts and charges", helper: "Add discount and additional charges controls." },
  { key: "notesTerms", label: "Notes and terms", helper: "Include customer notes and terms in footer." },
  { key: "additionalInfo", label: "Additional info", helper: "Show custom additional business context." },
  { key: "contactDetails", label: "Contact details block", helper: "Show dedicated contact details section." },
  { key: "recurringInvoice", label: "Recurring invoice", helper: "Mark this invoice as recurring template." },
  { key: "advancedOptions", label: "Advanced display options", helper: "Fine-tune visibility in final preview." },
];

function getDefaultParty(): PartyDetails {
  return {
    businessName: "",
    phone: "",
    gstin: "",
    address: "",
    city: "",
    postalCode: "",
    state: "",
    email: "",
    pan: "",
    customField: "",
  };
}

function getDefaultLineItem(): LineItem {
  return {
    item: "",
    hsnSac: "",
    gstRate: 18,
    quantity: 1,
    rate: 1,
    description: "",
  };
}

function getDefaultInvoiceData(invoiceNumber: string): InvoiceData {
  return {
    invoiceNo: invoiceNumber || "A00001",
    invoiceDate: new Date().toISOString().slice(0, 10),
    dueDate: "",
    businessLogoUrl: "",
    invoiceTheme: "modern",
    currency: "INR",
    seller: getDefaultParty(),
    client: getDefaultParty(),
    lineItems: [getDefaultLineItem()],
    gstEnabled: true,
    discount: 0,
    additionalCharges: 0,
    roundOff: "none",
    notes: "",
    terms: "",
    additionalInfo: "",
    contactDetails: "",
    shippingDetails: "",
    recurringInvoice: false,
    showTotalInWords: true,
    advancedOptions: {
      hidePlaceOfSupply: false,
      showTaxSummary: true,
      showHsnSummary: false,
      showOriginalImages: false,
      showThumbnails: false,
      showDescriptionFullWidth: false,
      hideSubtotalForGroupItems: false,
      showSku: false,
      showSerialNumbers: false,
      displayBatchDetails: false,
    },
  };
}

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="text-[11px] font-medium text-red-500 mt-1.5">{msg}</p>;
}

function SectionCard({ children }: { children: React.ReactNode }) {
  return <section className="rounded-xl border border-slate-200/70 bg-white p-4 dark:border-white/[0.08] dark:bg-slate-900/60">{children}</section>;
}

function SectionHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-3">
      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
      {subtitle && <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>}
    </div>
  );
}

export function InvoiceForm({ invoiceNumber, onPreview }: InvoiceFormProps) {
  const [formData, setFormData] = useState<InvoiceData>(() => getDefaultInvoiceData(invoiceNumber));
  const [error, setError] = useState("");
  const [enabledFields, setEnabledFields] = useState<Record<OptionalFieldKey, boolean>>({
    dueDate: true,
    shipping: false,
    itemAdvanced: false,
    discountsCharges: true,
    notesTerms: true,
    additionalInfo: false,
    contactDetails: false,
    recurringInvoice: false,
    advancedOptions: false,
  });
  const [enabledItemColumns, setEnabledItemColumns] = useState({
    hsnSac: false,
    gstRate: true,
    total: true,
    description: false,
  });

  const updateField = <K extends keyof InvoiceData>(key: K, value: InvoiceData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const updatePartyField = (party: "seller" | "client", key: keyof PartyDetails, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [party]: {
        ...prev[party],
        [key]: value,
      },
    }));
  };

  const updateLineItem = (index: number, key: keyof LineItem, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      lineItems: prev.lineItems.map((item, idx) => (idx === index ? { ...item, [key]: value } : item)),
    }));
  };

  const addLineItem = () => {
    setFormData((prev) => ({ ...prev, lineItems: [...prev.lineItems, getDefaultLineItem()] }));
  };

  const removeLineItem = (index: number) => {
    setFormData((prev) => {
      if (prev.lineItems.length === 1) return prev;
      return {
        ...prev,
        lineItems: prev.lineItems.filter((_, idx) => idx !== index),
      };
    });
  };

  const updateAdvancedOption = (key: keyof NonNullable<InvoiceData["advancedOptions"]>, value: boolean) => {
    setFormData((prev) => ({
      ...prev,
      advancedOptions: {
        ...prev.advancedOptions,
        [key]: value,
      },
    }));
  };

  const toggleOptionalField = (key: OptionalFieldKey) => {
    setEnabledFields((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleItemColumn = (key: keyof typeof enabledItemColumns) => {
    setEnabledItemColumns((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const subtotal = formData.lineItems.reduce((sum, item) => sum + item.quantity * item.rate, 0);
  const taxTotal = formData.gstEnabled
    ? formData.lineItems.reduce((sum, item) => sum + (item.quantity * item.rate * item.gstRate) / 100, 0)
    : 0;

  let total = subtotal + taxTotal - formData.discount + formData.additionalCharges;
  if (formData.roundOff === "up") total = Math.ceil(total);
  if (formData.roundOff === "down") total = Math.floor(total);

  const runPreview = () => {
    setError("");
    onPreview({ ...formData, invoiceNo: formData.invoiceNo || invoiceNumber });
  };

  const onFinalGenerate = () => {
    if (!formData.seller.businessName.trim()) {
      setError("Your business name is required.");
      return;
    }
    if (!formData.client.businessName.trim()) {
      setError("Client business name is required.");
      return;
    }
    if (!formData.lineItems[0]?.item.trim()) {
      setError("At least one line item is required.");
      return;
    }

    setError("");
    runPreview();
  };

  const handleLogoUpload = (file?: File) => {
    if (!file) return;
    const isAllowedType = file.type === "image/png" || file.type === "image/jpeg";
    if (!isAllowedType) {
      setError("Logo must be PNG or JPEG.");
      return;
    }
    const imageUrl = URL.createObjectURL(file);
    updateField("businessLogoUrl", imageUrl);
  };

  const renderPartyCard = (party: "seller" | "client", title: string, nameLabel: string) => (
    <SectionCard>
      <SectionHeading title={title} subtitle="Keep this complete to avoid back-and-forth with clients." />
      <div className="grid gap-3 lg:grid-cols-2">
        <div className="lg:col-span-2">
          <Label className="mb-1.5 block">{nameLabel} *</Label>
          <Input
            value={formData[party].businessName}
            onChange={(e) => updatePartyField(party, "businessName", e.target.value)}
            placeholder="Business name"
          />
        </div>
        <div>
          <Label className="mb-1.5 block">GSTIN</Label>
          <Input
            value={formData[party].gstin || ""}
            onChange={(e) => updatePartyField(party, "gstin", e.target.value)}
            placeholder="GSTIN"
          />
        </div>
        <div>
          <Label className="mb-1.5 block">Phone</Label>
          <Input
            value={formData[party].phone || ""}
            onChange={(e) => updatePartyField(party, "phone", e.target.value.replace(/\D/g, "").slice(0, 10))}
            placeholder="10-digit phone"
            maxLength={10}
          />
        </div>
        <div className="lg:col-span-2">
          <Label className="mb-1.5 block">Email</Label>
          <Input
            type="email"
            value={formData[party].email || ""}
            onChange={(e) => updatePartyField(party, "email", e.target.value)}
            placeholder="name@company.com"
          />
        </div>
        <div className="lg:col-span-2">
          <Label className="mb-1.5 block">Address</Label>
          <Textarea
            value={formData[party].address || ""}
            onChange={(e) => updatePartyField(party, "address", e.target.value)}
            placeholder="Street, area, landmark"
            rows={2}
          />
        </div>
        <div>
          <Label className="mb-1.5 block">City</Label>
          <Input
            value={formData[party].city || ""}
            onChange={(e) => updatePartyField(party, "city", e.target.value)}
            placeholder="City"
          />
        </div>
        <div>
          <Label className="mb-1.5 block">State</Label>
          <Input
            value={formData[party].state || ""}
            onChange={(e) => updatePartyField(party, "state", e.target.value)}
            placeholder="State"
          />
        </div>
        <div>
          <Label className="mb-1.5 block">Postal Code</Label>
          <Input
            value={formData[party].postalCode || ""}
            onChange={(e) => updatePartyField(party, "postalCode", e.target.value)}
            placeholder="Postal code"
          />
        </div>
      </div>
    </SectionCard>
  );

  return (
    <div
      className="space-y-4 [&_input]:h-10 [&_input]:px-3 [&_input]:text-sm [&_textarea]:text-sm [&_select]:h-10 [&_select]:px-3 [&_select]:text-sm"
      id="invoice-form"
    >
      <div className="rounded-xl border border-slate-200/70 bg-slate-50 p-3 dark:border-white/[0.08] dark:bg-slate-800/30">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Professional Invoice Form</p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Clear sections, required-first fields, and optional blocks controlled below.</p>
          </div>
          <Button type="button" variant="secondary" size="sm" onClick={runPreview} id="preview-anytime-btn">
            <Eye className="h-3.5 w-3.5" />
            Preview Anytime
          </Button>
        </div>
      </div>

      <SectionCard>
        <SectionHeading title="Invoice Basics" subtitle="Set identity, dates, currency, and tax defaults." />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <div>
            <Label className="mb-1.5 block">Invoice No *</Label>
            <Input
              value={formData.invoiceNo}
              onChange={(e) => updateField("invoiceNo", e.target.value)}
              placeholder="A00001"
            />
          </div>
          <div>
            <Label className="mb-1.5 block">Invoice Date *</Label>
            <Input
              type="date"
              value={formData.invoiceDate}
              onChange={(e) => updateField("invoiceDate", e.target.value)}
            />
          </div>
          {enabledFields.dueDate && (
            <div>
              <Label className="mb-1.5 block">Due Date</Label>
              <Input
                type="date"
                value={formData.dueDate || ""}
                onChange={(e) => updateField("dueDate", e.target.value)}
              />
            </div>
          )}
          <div>
            <Label className="mb-1.5 block">Currency *</Label>
            <select
              value={formData.currency}
              onChange={(e) => updateField("currency", e.target.value)}
              className="flex w-full rounded-xl border border-slate-200 bg-white text-sm text-slate-800 shadow-sm outline-none transition focus:border-violet-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            >
              {CURRENCIES.map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
          </div>
          <div className="rounded-xl border border-slate-200/70 p-3 dark:border-white/[0.08]">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">GST Enabled</p>
              <Switch checked={formData.gstEnabled} onCheckedChange={(v) => updateField("gstEnabled", v)} />
            </div>
            <p className="mt-1 text-xs text-slate-500">Use per-item GST calculations.</p>
          </div>
          <div className="rounded-xl border border-dashed border-slate-300 p-3 sm:col-span-2 lg:col-span-5 dark:border-slate-700">
            <Label className="mb-1 block">Business Logo (optional)</Label>
            <Input
              className="h-9"
              type="file"
              accept="image/png,image/jpeg"
              onChange={(e) => handleLogoUpload(e.target.files?.[0])}
            />
          </div>
        </div>
      </SectionCard>

      <div className="grid gap-4 xl:grid-cols-2">
        {renderPartyCard("seller", "Seller Details", "Your Business Name")}
        {renderPartyCard("client", "Bill To (Client Details)", "Client Business Name")}
      </div>

      {enabledFields.shipping && (
        <SectionCard>
          <SectionHeading title="Shipping Details" />
          <Textarea
            value={formData.shippingDetails || ""}
            onChange={(e) => updateField("shippingDetails", e.target.value)}
            placeholder="Shipping address, dispatch note, transporter details"
            rows={3}
          />
        </SectionCard>
      )}

      <SectionCard>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <SectionHeading title="Items and Pricing" subtitle="Add billable line items with quantity and rate." />
          {enabledFields.itemAdvanced && (
            <div className="flex flex-wrap items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 p-2 dark:border-slate-700 dark:bg-slate-800/40">
              <label className="inline-flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300">
                <input type="checkbox" checked={enabledItemColumns.hsnSac} onChange={() => toggleItemColumn("hsnSac")} />
                HSN/SAC
              </label>
              <label className="inline-flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300">
                <input type="checkbox" checked={enabledItemColumns.gstRate} onChange={() => toggleItemColumn("gstRate")} />
                GST Rate
              </label>
              <label className="inline-flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300">
                <input type="checkbox" checked={enabledItemColumns.description} onChange={() => toggleItemColumn("description")} />
                Description
              </label>
            </div>
          )}
        </div>

        <div className="space-y-3">
          {formData.lineItems.map((item, index) => (
            <div key={`line-item-${index}`} className="rounded-xl border border-slate-200/70 p-3 dark:border-white/[0.08]">
              <div
                className={`grid gap-3 ${
                  enabledItemColumns.hsnSac || enabledItemColumns.gstRate
                    ? "md:grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_0.5fr]"
                    : "md:grid-cols-[2.5fr_1fr_1fr_1fr_0.5fr]"
                }`}
              >
                <div>
                  <Label className="mb-1.5 block">Item *</Label>
                  <Input
                    value={item.item}
                    onChange={(e) => updateLineItem(index, "item", e.target.value)}
                    placeholder="Product or service"
                  />
                </div>
                {enabledItemColumns.hsnSac && (
                  <div>
                    <Label className="mb-1.5 block">HSN/SAC</Label>
                    <Input
                      value={item.hsnSac || ""}
                      onChange={(e) => updateLineItem(index, "hsnSac", e.target.value)}
                      placeholder="HSN/SAC"
                    />
                  </div>
                )}
                {enabledItemColumns.gstRate && (
                  <div>
                    <Label className="mb-1.5 block">GST Rate</Label>
                    <div className="relative">
                      <Input
                        type="number"
                        min={0}
                        max={28}
                        value={item.gstRate}
                        onChange={(e) => updateLineItem(index, "gstRate", Number(e.target.value) || 0)}
                        placeholder="18"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">%</span>
                    </div>
                  </div>
                )}
                <div>
                  <Label className="mb-1.5 block">Qty</Label>
                  <Input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) => updateLineItem(index, "quantity", Number(e.target.value) || 1)}
                  />
                </div>
                <div>
                  <Label className="mb-1.5 block">Rate</Label>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                      <IndianRupee className="h-3.5 w-3.5" />
                    </span>
                    <Input
                      type="number"
                      min={1}
                      className="pl-10"
                      value={item.rate}
                      onChange={(e) => updateLineItem(index, "rate", Number(e.target.value) || 1)}
                    />
                  </div>
                </div>
                {enabledItemColumns.total && (
                  <div>
                    <Label className="mb-1.5 block">Line Total</Label>
                    <Input
                      value={(item.quantity * item.rate).toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                      readOnly
                      className="bg-slate-50 dark:bg-slate-800/60"
                    />
                  </div>
                )}
                <div className="flex items-end">
                  <Button
                    variant="ghost"
                    size="icon"
                    type="button"
                    onClick={() => removeLineItem(index)}
                    className="text-red-500 hover:text-red-600"
                    aria-label="Remove line"
                    title="Remove line"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {enabledItemColumns.description && (
                <div className="mt-3">
                  <Label className="mb-1.5 block">Description</Label>
                  <Textarea
                    value={item.description || ""}
                    onChange={(e) => updateLineItem(index, "description", e.target.value)}
                    placeholder="Optional detailed description"
                    rows={2}
                  />
                </div>
              )}
            </div>
          ))}

          <Button type="button" variant="outline" onClick={addLineItem} className="w-full">
            <Plus className="h-4 w-4" />
            Add Line Item
          </Button>
        </div>
      </SectionCard>

      <SectionCard>
        <SectionHeading title="Totals" subtitle="Review final figures before previewing." />
        <div className="space-y-2 rounded-xl border border-slate-200/70 p-3 dark:border-white/[0.08]">
          <div className="flex justify-between text-sm text-slate-600 dark:text-slate-300">
            <span>Subtotal</span>
            <span>
              {formData.currency} {subtotal.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex justify-between text-sm text-slate-600 dark:text-slate-300">
            <span>Tax</span>
            <span>
              {formData.currency} {taxTotal.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex justify-between border-t pt-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
            <span>Total</span>
            <span>
              {formData.currency} {total.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {enabledFields.discountsCharges && (
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <Label className="mb-1.5 block">Discount</Label>
              <Input
                type="number"
                min={0}
                value={formData.discount}
                onChange={(e) => updateField("discount", Number(e.target.value) || 0)}
              />
            </div>
            <div>
              <Label className="mb-1.5 block">Additional Charges</Label>
              <Input
                type="number"
                min={0}
                value={formData.additionalCharges}
                onChange={(e) => updateField("additionalCharges", Number(e.target.value) || 0)}
              />
            </div>
            <div>
              <Label className="mb-1.5 block">Round Off</Label>
              <select
                value={formData.roundOff}
                onChange={(e) => updateField("roundOff", e.target.value as "none" | "up" | "down")}
                className="flex w-full rounded-xl border border-slate-200 bg-white text-sm text-slate-800 shadow-sm outline-none transition focus:border-violet-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
              >
                <option value="none">No round off</option>
                <option value="up">Round up</option>
                <option value="down">Round down</option>
              </select>
            </div>
          </div>
        )}
      </SectionCard>

      {enabledFields.notesTerms && (
        <SectionCard>
          <SectionHeading title="Notes and Terms" />
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-xl border border-slate-200/70 p-3 dark:border-white/[0.08]">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Show total amount in words</p>
              <Switch checked={formData.showTotalInWords} onCheckedChange={(v) => updateField("showTotalInWords", v)} />
            </div>
            <div>
              <Label className="mb-1.5 block">Notes</Label>
              <Textarea
                value={formData.notes || ""}
                onChange={(e) => updateField("notes", e.target.value)}
                placeholder="Payment notes or business note"
              />
            </div>
            <div>
              <Label className="mb-1.5 block">Terms and Conditions</Label>
              <Textarea
                value={formData.terms || ""}
                onChange={(e) => updateField("terms", e.target.value)}
                placeholder="Late fee, return policy, and terms"
              />
            </div>
          </div>
        </SectionCard>
      )}

      {enabledFields.additionalInfo && (
        <SectionCard>
          <SectionHeading title="Additional Info" />
          <Textarea
            value={formData.additionalInfo || ""}
            onChange={(e) => updateField("additionalInfo", e.target.value)}
            placeholder="Additional information"
          />
        </SectionCard>
      )}

      {enabledFields.contactDetails && (
        <SectionCard>
          <SectionHeading title="Contact Details Block" />
          <Textarea
            value={formData.contactDetails || ""}
            onChange={(e) => updateField("contactDetails", e.target.value)}
            placeholder="Dedicated contact details for footer"
          />
        </SectionCard>
      )}

      {enabledFields.recurringInvoice && (
        <SectionCard>
          <SectionHeading title="Recurring Invoice" />
          <div className="flex items-center justify-between rounded-xl border border-slate-200/70 p-3 dark:border-white/[0.08]">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-200">This invoice repeats on a schedule</p>
            <Switch checked={formData.recurringInvoice} onCheckedChange={(v) => updateField("recurringInvoice", v)} />
          </div>
        </SectionCard>
      )}

      {enabledFields.advancedOptions && (
        <SectionCard>
          <SectionHeading title="Advanced Display Options" />
          <div className="space-y-2.5 text-sm">
            <label className="flex items-center justify-between">
              <span>Show tax summary in invoice</span>
              <Switch
                checked={Boolean(formData.advancedOptions?.showTaxSummary)}
                onCheckedChange={(v) => updateAdvancedOption("showTaxSummary", v)}
              />
            </label>
            <label className="flex items-center justify-between">
              <span>Hide place/country of supply</span>
              <Switch
                checked={Boolean(formData.advancedOptions?.hidePlaceOfSupply)}
                onCheckedChange={(v) => updateAdvancedOption("hidePlaceOfSupply", v)}
              />
            </label>
            <label className="flex items-center justify-between">
              <span>Show HSN summary in invoice</span>
              <Switch
                checked={Boolean(formData.advancedOptions?.showHsnSummary)}
                onCheckedChange={(v) => updateAdvancedOption("showHsnSummary", v)}
              />
            </label>
            <label className="flex items-center justify-between">
              <span>Add original images in line items</span>
              <Switch
                checked={Boolean(formData.advancedOptions?.showOriginalImages)}
                onCheckedChange={(v) => updateAdvancedOption("showOriginalImages", v)}
              />
            </label>
            <label className="flex items-center justify-between">
              <span>Show thumbnails in separate column</span>
              <Switch
                checked={Boolean(formData.advancedOptions?.showThumbnails)}
                onCheckedChange={(v) => updateAdvancedOption("showThumbnails", v)}
              />
            </label>
            <label className="flex items-center justify-between">
              <span>Show description in full width</span>
              <Switch
                checked={Boolean(formData.advancedOptions?.showDescriptionFullWidth)}
                onCheckedChange={(v) => updateAdvancedOption("showDescriptionFullWidth", v)}
              />
            </label>
            <label className="flex items-center justify-between">
              <span>Hide subtotal for group items</span>
              <Switch
                checked={Boolean(formData.advancedOptions?.hideSubtotalForGroupItems)}
                onCheckedChange={(v) => updateAdvancedOption("hideSubtotalForGroupItems", v)}
              />
            </label>
            <label className="flex items-center justify-between">
              <span>Show SKU in invoice</span>
              <Switch
                checked={Boolean(formData.advancedOptions?.showSku)}
                onCheckedChange={(v) => updateAdvancedOption("showSku", v)}
              />
            </label>
            <label className="flex items-center justify-between">
              <span>Show serial numbers in invoice</span>
              <Switch
                checked={Boolean(formData.advancedOptions?.showSerialNumbers)}
                onCheckedChange={(v) => updateAdvancedOption("showSerialNumbers", v)}
              />
            </label>
            <label className="flex items-center justify-between">
              <span>Display batch details in columns</span>
              <Switch
                checked={Boolean(formData.advancedOptions?.displayBatchDetails)}
                onCheckedChange={(v) => updateAdvancedOption("displayBatchDetails", v)}
              />
            </label>
          </div>
        </SectionCard>
      )}

      <SectionCard>
        <SectionHeading title="Additional Sections" subtitle="Turn on only what you need for this invoice type." />
        <div className="grid gap-2 md:grid-cols-2">
          {OPTIONAL_FIELD_OPTIONS.map((opt) => (
            <label
              key={opt.key}
              className="flex items-start justify-between gap-3 rounded-lg border border-slate-200/70 p-3 dark:border-white/[0.08]"
            >
              <span>
                <span className="block text-sm font-medium text-slate-800 dark:text-slate-200">{opt.label}</span>
                <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">{opt.helper}</span>
              </span>
              <Switch checked={enabledFields[opt.key]} onCheckedChange={() => toggleOptionalField(opt.key)} />
            </label>
          ))}
        </div>
      </SectionCard>

      {error && <FieldError msg={error} />}

      <div className="flex flex-wrap items-center gap-2 pt-1">
        <Button type="button" onClick={onFinalGenerate} id="generate-invoice-submit">
          <Sparkles className="h-4 w-4" />
          Generate Preview
        </Button>
        <Button type="button" variant="secondary" onClick={runPreview}>
          <Eye className="h-4 w-4" />
          Preview Now
        </Button>
      </div>
    </div>
  );
}
