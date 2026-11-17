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
  return `Hello Happy Wall! 👋\n\nI was browsing your website and would love to know more about your poster collections and available designs.\n\nCould you please share your latest catalog and offers?`;
}

/**
 * Formats a specific single-product order inquiry.
 */
export function formatProductOrderMessage(order: ProductOrderEnquiry): string {
  const unitPrice = Math.round(order.totalPrice / Math.max(1, order.quantity));
  return [
    `HAPPY WALLS – PRODUCT ENQUIRY 🖼️`,
    `----------------------------------------`,
    `Product: ${order.productName}`,
    `Size: ${order.size} (${order.dimensions})`,
    `Price: ₹${unitPrice}`,
    `Quantity: ${order.quantity}`,
    `Subtotal: ₹${order.totalPrice}`,
    order.customerNote ? `Note: ${order.customerNote}` : '',
    `----------------------------------------`,
    `Hello Happy Wall team! Could you please share the next steps for placing this order?`,
  ]
    .filter(Boolean)
    .join('\n');
}

/**
 * Formats a multi-item cart checkout order inquiry according to client specification.
 */
export function formatCartOrderMessage(items: CartItem[], totalAmount: number): string {
  const itemList = items
    .map((item, idx) => {
      const lines = [
        `${idx + 1}. *${item.name}*`,
        `   Size: ${item.size}`,
        `   Price: ₹${item.price}`,
        `   Quantity: ${item.quantity}`,
      ];
      if (item.inclusions) {
        lines.push(`   Includes: ${item.inclusions}`);
      }
      lines.push(`   Subtotal: ₹${item.price * item.quantity}`);
      return lines.join('\n');
    })
    .join('\n\n');

  return [
    `HAPPY WALLS – ORDER ENQUIRY 🖼️`,
    `----------------------------------------`,
    `Selected Products:`,
    ``,
    itemList,
    ``,
    `----------------------------------------`,
    `Cart Subtotal: ₹${totalAmount}`,
    `----------------------------------------`,
    `Hello Happy Wall team! I would like to enquire about these products. Please share the next steps for placing my order.`,
  ].join('\n');
}

/**
 * Formats a custom poster booking inquiry matching the clean Happy Wall production specification.
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
