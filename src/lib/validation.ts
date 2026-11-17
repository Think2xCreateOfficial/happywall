import { CustomPosterType, CustomPosterSizeChoice } from "@/types/enquiry";

export interface FormValidationErrors {
  customerName?: string;
  phone?: string;
  city?: string;
  posterType?: string;
  posterSize?: string;
  quantity?: string;
  additionalRequirements?: string;
}

export function validateCustomPosterForm(data: {
  customerName: string;
  phone: string;
  city: string;
  posterType: string;
  posterSize: string;
  quantity: number | string;
  additionalRequirements?: string;
}): { isValid: boolean; errors: FormValidationErrors } {
  const errors: FormValidationErrors = {};

  // 1. Customer Name (Required)
  const trimmedName = data.customerName ? data.customerName.trim() : "";
  if (!trimmedName) {
    errors.customerName = "Customer name is required.";
  } else if (trimmedName.length < 2) {
    errors.customerName = "Name must be at least 2 characters.";
  }

  // 2. WhatsApp / Contact Number (Required)
  const rawPhone = data.phone || "";
  const cleanPhone = rawPhone.replace(/[\s\-\(\)\+]/g, "");
  if (!cleanPhone) {
    errors.phone = "WhatsApp / contact number is required.";
  } else if (!/^[6-9]\d{9}$/.test(cleanPhone) && !/^\d{10,14}$/.test(cleanPhone)) {
    errors.phone = "Please enter a valid 10-digit mobile number (e.g. 9876543210).";
  }

  // 3. City / Location (Required)
  const trimmedCity = data.city ? data.city.trim() : "";
  if (!trimmedCity) {
    errors.city = "City / location is required (e.g. Palavakkam, Chennai).";
  } else if (trimmedCity.length < 2) {
    errors.city = "Please enter a valid city or locality.";
  }

  // 4. Poster Type (Required dropdown)
  const validTypes: CustomPosterType[] = [
    "Anime",
    "Games",
    "Split Poster",
    "Polarized Photo Set with Spotify",
    "Custom Poster + Frame Combo",
    "Motivational Posters",
    "Custom Design",
    "Other",
  ];
  if (!data.posterType || !validTypes.includes(data.posterType as CustomPosterType)) {
    errors.posterType = "Please select a poster type.";
  }

  // 5. Poster Size (Required dropdown)
  const validSizes: CustomPosterSizeChoice[] = [
    "A6",
    "A5",
    "A4",
    "Split Set (3 × A4)",
    "15 Photos Set",
    "Custom Size",
    "Need Recommendation",
  ];
  if (!data.posterSize || !validSizes.includes(data.posterSize as CustomPosterSizeChoice)) {
    errors.posterSize = "Please select a poster size.";
  }

  // 6. Quantity (Required)
  const parsedQty = Number(data.quantity);
  if (!data.quantity || isNaN(parsedQty) || parsedQty < 1) {
    errors.quantity = "Quantity must be at least 1.";
  } else if (parsedQty > 500) {
    errors.quantity = "For bulk orders over 500 units, please contact us directly.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
