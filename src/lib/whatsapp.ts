import { CustomPosterEnquiry, ProductOrderEnquiry } from '@/types/enquiry';
import { SITE_CONFIG } from '@/data/site-config';
import { CartItem } from '@/context/CartContext';

/**
 * Normalizes an international phone number string to purely numeric international format.
 */
export function sanitizePhoneNumber(phone: string): string {
  return phone.replace(/[^\d]/g, '');
}

/**
 * Builds an official WhatsApp Click-to-Chat URL with safe URI encoding.
 */
export function buildWhatsAppUrl(message: string, recipientPhone?: string): string {
  const phone = sanitizePhoneNumber(recipientPhone || SITE_CONFIG.contact.whatsapp);
  const encodedText = encodeURIComponent(message.trim());
  return `https://wa.me/${phone}?text=${encodedText}`;
}

/**
 * Formats a general inquiry message.
 */
export function formatGeneralInquiryMessage(): string {
  return `Hello Happy Walls! 👋\n\nI was browsing your website and would love to know more about your poster collections and available designs.\n\nCould you please share your latest catalog and offers?`;
}

/**
 * Formats a specific single-product order inquiry.
 */
export function formatProductOrderMessage(order: ProductOrderEnquiry): string {
  return [
    `*NEW POSTER ORDER INQUIRY — HAPPY WALLS* 🖼️`,
    `----------------------------------------`,
    `📌 *Product:* ${order.productName}`,
    `🆔 *Item ID:* ${order.productId}`,
    `📐 *Size Selected:* ${order.size} (${order.dimensions})`,
    `🔢 *Quantity:* ${order.quantity}`,
    `💰 *Estimated Total:* ₹${order.totalPrice}`,
    order.customerNote ? `💬 *Note:* ${order.customerNote}` : '',
    `----------------------------------------`,
    `Could you please confirm availability and provide payment details (UPI/GPay)? Thank you!`,
  ]
    .filter(Boolean)
    .join('\n');
}

/**
 * Formats a multi-item cart checkout order inquiry.
 */
export function formatCartOrderMessage(items: CartItem[], totalAmount: number): string {
  const itemList = items
    .map(
      (item, idx) =>
        `${idx + 1}. *${item.name}*\n   • Category: ${item.category}\n   • Size: ${item.size} (${item.dimensions})\n   • Qty: ${item.quantity} × ₹${item.price} = ₹${item.price * item.quantity}`
    )
    .join('\n\n');

  return [
    `*NEW POSTER SELECTION ORDER — HAPPY WALLS* 🖼️🛍️`,
    `----------------------------------------`,
    itemList,
    `----------------------------------------`,
    `🧾 *Total Items:* ${items.reduce((sum, i) => sum + i.quantity, 0)}`,
    `💰 *Estimated Total Amount:* ₹${totalAmount}`,
    `----------------------------------------`,
    `Hello Happy Walls team! I have selected these posters on your website and would like to proceed with the order. Could you please confirm delivery within Chennai and share UPI payment QR?`,
  ].join('\n');
}

/**
 * Formats a custom poster booking inquiry matching the clean Happy Walls production specification.
 */
export function formatCustomPosterMessage(enquiry: CustomPosterEnquiry): string {
  return [
    `CUSTOM POSTER ENQUIRY – HAPPY WALLS`,
    ``,
    `Customer Name: ${enquiry.customerName}`,
    `WhatsApp Number: ${enquiry.phone}`,
    `City: ${enquiry.city}`,
    ``,
    `Poster Type: ${enquiry.posterType}`,
    `Poster Size: ${enquiry.posterSize}`,
    `Quantity: ${enquiry.quantity}`,
    `Budget Range: ${enquiry.budgetRange || 'Not Specified / Open to Recommendation'}`,
    `Additional Requirements: ${enquiry.additionalRequirements || 'None'}`,
    ``,
    `Please contact me regarding my custom poster requirements.`,
  ].join('\n');
}
