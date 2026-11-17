"use client";

import React, { useState } from "react";
import { CheckCircle2, AlertCircle, User, NotebookText } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { CustomPosterType, CustomPosterSizeChoice, CustomPosterEnquiry } from "@/types/enquiry";
import { validateCustomPosterForm, FormValidationErrors } from "@/lib/validation";
import { buildWhatsAppUrl, formatCustomPosterMessage } from "@/lib/whatsapp";
import { SITE_CONFIG } from "@/data/site-config";
import { cn } from "@/lib/utils";

const POSTER_TYPE_OPTIONS: CustomPosterType[] = [
  "Anime",
  "Games",
  "Split Poster",
  "Polarized Photo Set with Spotify",
  "Custom Poster + Frame Combo",
  "Custom Design",
  "Other",
];

const POSTER_SIZE_OPTIONS: { id: CustomPosterSizeChoice; label: string; details: string }[] = [
  { id: "A6", label: "A6 Pocket Mini", details: "10.5 × 14.8 cm" },
  { id: "A5", label: "A5 Compact", details: "14.8 × 21 cm" },
  { id: "A4", label: "A4 Standard", details: "21 × 29.7 cm" },
  { id: "Split Set (3 × A4)", label: "Split Poster Set", details: "3 × A4 size posters" },
  { id: "15 Photos Set", label: "Polarized Photo Set", details: "15 photos with Spotify" },
  { id: "Custom Size", label: "Custom Dimensions", details: "Specify in notes" },
  { id: "Need Recommendation", label: "Need Recommendation", details: "Our team will assist" },
];

const BUDGET_OPTIONS = [
  "Under ₹500",
  "₹500 – ₹1,000",
  "₹1,000 – ₹2,000",
  "₹2,000+",
  "Need Recommendation / Flexible",
];

export const CustomPosterForm: React.FC = () => {
  const [formData, setFormData] = useState({
    customerName: "",
    phone: "",
    city: "",
    posterType: "Anime" as CustomPosterType,
    posterSize: "A3" as CustomPosterSizeChoice,
    quantity: 1,
    budgetRange: "₹500 – ₹1,000",
    additionalRequirements: "",
  });

  const [errors, setErrors] = useState<FormValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof FormValidationErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleQuantityStep = (delta: number) => {
    setFormData((prev) => {
      const current = Number(prev.quantity) || 1;
      const next = Math.max(1, Math.min(100, current + delta));
      return { ...prev, quantity: next };
    });
    if (errors.quantity) {
      setErrors((prev) => ({ ...prev, quantity: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const validation = validateCustomPosterForm(formData);

    if (!validation.isValid) {
      setErrors(validation.errors);
      setIsSubmitting(false);

      const firstErrorKey = Object.keys(validation.errors)[0];
      const element = document.getElementById(`field-${firstErrorKey}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        element.focus();
      }
      return;
    }

    const enquiry: CustomPosterEnquiry = {
      customerName: formData.customerName.trim(),
      phone: formData.phone.trim(),
      city: formData.city.trim(),
      posterType: formData.posterType,
      posterSize: formData.posterSize,
      quantity: formData.quantity,
      budgetRange: formData.budgetRange || undefined,
      additionalRequirements: formData.additionalRequirements.trim() || undefined,
    };

    const formattedMessage = formatCustomPosterMessage(enquiry);
    const whatsappUrl = buildWhatsAppUrl(formattedMessage, SITE_CONFIG.contact.whatsapp);

    // Open WhatsApp Click-to-Chat
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");

    setShowSuccessModal(true);
    setIsSubmitting(false);
  };

  return (
    <div className="relative bg-charcoal-card rounded-3xl p-6 sm:p-8 lg:p-10 border border-charcoal-border shadow-2xl overflow-hidden">
      {/* Decorative Golden Ambient Accent */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-yellow/10 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-5 h-0.5 bg-brand-yellow rounded-full inline-block" />
          <span className="text-xs font-manrope font-extrabold uppercase tracking-widest text-brand-yellow">
            CUSTOM POSTER ENQUIRY
          </span>
        </div>

        <h3 className="text-2xl sm:text-3xl lg:text-4xl font-manrope font-extrabold text-white tracking-tight leading-tight">
          Create Your Own <span className="text-brand-yellow">Wall Story</span>
        </h3>

        <p className="text-xs sm:text-sm text-brand-muted mt-2 font-inter leading-relaxed max-w-xl">
          Share your custom poster requirements below. We will review your design, advise on dimensions and paper calibration, and send full details directly to you on WhatsApp.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-7">
        {/* SECTION A: Customer Information */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-charcoal-border/70">
            <User className="w-4 h-4 text-brand-yellow" />
            <h4 className="font-manrope font-extrabold text-xs sm:text-sm text-white tracking-wide uppercase">
              1. Customer Information
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* 1. Customer Name */}
            <div className="sm:col-span-2">
              <label htmlFor="field-customerName" className="block text-xs font-manrope font-bold text-white mb-1.5">
                Customer Name <span className="text-brand-yellow">*</span>
              </label>
              <input
                id="field-customerName"
                type="text"
                name="customerName"
                value={formData.customerName}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                autoComplete="name"
                className={cn(
                  "w-full px-4 py-3 rounded-xl bg-charcoal-surface border text-sm text-white placeholder:text-brand-muted/70 focus:outline-none transition-all",
                  errors.customerName
                    ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    : "border-charcoal-border focus:border-brand-yellow focus:ring-1 focus:ring-brand-yellow"
                )}
              />
              {errors.customerName && (
                <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.customerName}</span>
                </p>
              )}
            </div>

            {/* 2. WhatsApp / Contact Number */}
            <div>
              <label htmlFor="field-phone" className="block text-xs font-manrope font-bold text-white mb-1.5">
                WhatsApp Number <span className="text-brand-yellow">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-xs font-mono font-bold text-brand-yellow">
                  +91
                </div>
                <input
                  id="field-phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="98765 43210"
                  autoComplete="tel"
                  className={cn(
                    "w-full pl-12 pr-4 py-3 rounded-xl bg-charcoal-surface border text-sm text-white placeholder:text-brand-muted/70 focus:outline-none transition-all font-mono",
                    errors.phone
                      ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                      : "border-charcoal-border focus:border-brand-yellow focus:ring-1 focus:ring-brand-yellow"
                  )}
                />
              </div>
              {errors.phone ? (
                <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.phone}</span>
                </p>
              ) : (
                <p className="mt-1 text-[11px] text-white/50">
                  Required for WhatsApp quote &amp; order updates.
                </p>
              )}
            </div>

            {/* 3. City / Location */}
            <div>
              <label htmlFor="field-city" className="block text-xs font-manrope font-bold text-white mb-1.5">
                City / Location <span className="text-brand-yellow">*</span>
              </label>
              <input
                id="field-city"
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="e.g. Palavakkam, Chennai"
                className={cn(
                  "w-full px-4 py-3 rounded-xl bg-charcoal-surface border text-sm text-white placeholder:text-brand-muted/70 focus:outline-none transition-all",
                  errors.city
                    ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    : "border-charcoal-border focus:border-brand-yellow focus:ring-1 focus:ring-brand-yellow"
                )}
              />
              {errors.city && (
                <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.city}</span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* SECTION B: Poster Requirements */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-charcoal-border/70">
            <NotebookText className="w-4 h-4 text-brand-yellow" />
            <h4 className="font-manrope font-extrabold text-xs sm:text-sm text-white tracking-wide uppercase">
              2. Poster Requirements
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* 4. Poster Type */}
            <div>
              <label htmlFor="field-posterType" className="block text-xs font-manrope font-bold text-white mb-1.5">
                Poster Type <span className="text-brand-yellow">*</span>
              </label>
              <select
                id="field-posterType"
                name="posterType"
                value={formData.posterType}
                onChange={handleInputChange}
                className={cn(
                  "w-full px-4 py-3 rounded-xl bg-charcoal-surface border text-sm text-white focus:outline-none transition-all appearance-none cursor-pointer",
                  errors.posterType
                    ? "border-red-500"
                    : "border-charcoal-border focus:border-brand-yellow focus:ring-1 focus:ring-brand-yellow"
                )}
              >
                {POSTER_TYPE_OPTIONS.map((type) => (
                  <option key={type} value={type} className="bg-charcoal-dark text-white">
                    {type}
                  </option>
                ))}
              </select>
              {errors.posterType && (
                <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.posterType}</span>
                </p>
              )}
            </div>

            {/* 5. Poster Size */}
            <div>
              <label htmlFor="field-posterSize" className="block text-xs font-manrope font-bold text-white mb-1.5">
                Poster Size <span className="text-brand-yellow">*</span>
              </label>
              <select
                id="field-posterSize"
                name="posterSize"
                value={formData.posterSize}
                onChange={handleInputChange}
                className={cn(
                  "w-full px-4 py-3 rounded-xl bg-charcoal-surface border text-sm text-white focus:outline-none transition-all appearance-none cursor-pointer",
                  errors.posterSize
                    ? "border-red-500"
                    : "border-charcoal-border focus:border-brand-yellow focus:ring-1 focus:ring-brand-yellow"
                )}
              >
                {POSTER_SIZE_OPTIONS.map((size) => (
                  <option key={size.id} value={size.id} className="bg-charcoal-dark text-white">
                    {size.label} ({size.details})
                  </option>
                ))}
              </select>
              {errors.posterSize && (
                <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.posterSize}</span>
                </p>
              )}
            </div>

            {/* 6. Quantity */}
            <div>
              <label htmlFor="field-quantity" className="block text-xs font-manrope font-bold text-white mb-1.5">
                Quantity <span className="text-brand-yellow">*</span>
              </label>
              <div className="flex items-center rounded-xl bg-charcoal-surface border border-charcoal-border overflow-hidden">
                <button
                  type="button"
                  onClick={() => handleQuantityStep(-1)}
                  className="px-4 py-3 text-white hover:bg-white/10 transition-colors text-base font-bold focus:outline-none"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <input
                  id="field-quantity"
                  type="number"
                  name="quantity"
                  min="1"
                  max="100"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  className="w-full text-center bg-transparent text-sm font-mono font-bold text-white focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleQuantityStep(1)}
                  className="px-4 py-3 text-white hover:bg-white/10 transition-colors text-base font-bold focus:outline-none"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
              {errors.quantity && (
                <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.quantity}</span>
                </p>
              )}
            </div>

            {/* 7. Budget Range (Optional) */}
            <div>
              <label htmlFor="field-budgetRange" className="block text-xs font-manrope font-bold text-white mb-1.5">
                Budget Range <span className="text-white/40 text-[11px] font-normal">(Optional)</span>
              </label>
              <select
                id="field-budgetRange"
                name="budgetRange"
                value={formData.budgetRange}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl bg-charcoal-surface border border-charcoal-border text-sm text-white focus:outline-none focus:border-brand-yellow focus:ring-1 focus:ring-brand-yellow transition-all appearance-none cursor-pointer"
              >
                {BUDGET_OPTIONS.map((opt) => (
                  <option key={opt} value={opt} className="bg-charcoal-dark text-white">
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* 8. Additional Requirements */}
            <div className="sm:col-span-2">
              <label htmlFor="field-additionalRequirements" className="block text-xs font-manrope font-bold text-white mb-1.5">
                Additional Requirements <span className="text-white/40 text-[11px] font-normal">(Optional)</span>
              </label>
              <textarea
                id="field-additionalRequirements"
                name="additionalRequirements"
                rows={3}
                value={formData.additionalRequirements}
                onChange={handleInputChange}
                placeholder="Mention any custom text, framing preference (matte black / borderless), aspect ratio, or room decor ideas..."
                className="w-full px-4 py-3 rounded-xl bg-charcoal-surface border border-charcoal-border text-sm text-white placeholder:text-brand-muted/70 focus:outline-none focus:border-brand-yellow focus:ring-1 focus:ring-brand-yellow transition-all"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 px-6 rounded-2xl bg-brand-yellow hover:bg-brand-yellowHover text-charcoal-dark font-manrope font-extrabold text-sm sm:text-base tracking-wide flex items-center justify-center gap-3 transition-all transform active:scale-[0.99] shadow-glow-yellow disabled:opacity-50 cursor-pointer"
          >
            <WhatsAppIcon className="w-5 h-5 shrink-0" />
            <span>Send Enquiry on WhatsApp</span>
          </button>
        </div>
      </form>

      {/* Confirmation Modal */}
      {showSuccessModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in"
        >
          <div className="relative bg-charcoal-card border border-brand-yellow/60 rounded-3xl p-6 sm:p-8 max-w-md w-full text-center shadow-2xl">
            <div className="w-14 h-14 rounded-full bg-brand-yellow/15 text-brand-yellow mx-auto flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h4 className="font-manrope font-extrabold text-xl text-white mb-2">
              WhatsApp Conversation Opened!
            </h4>

            <p className="text-xs sm:text-sm text-brand-muted leading-relaxed mb-6 font-inter">
              Your custom poster details have been prepared for WhatsApp. <br />
              <strong className="text-white font-semibold">Please remember to click &ldquo;Send&rdquo; in your WhatsApp chat</strong> to deliver your message to the Happy Wall design team.
            </p>

            <button
              onClick={() => setShowSuccessModal(false)}
              className="w-full py-3 rounded-xl bg-charcoal-surface hover:bg-charcoal-border border border-white/10 text-white text-xs sm:text-sm font-manrope font-extrabold transition-all"
            >
              Done / Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
