export function buildWhatsAppLink(phoneNumber: string, message: string): string {
  const digits = phoneNumber.replace(/[^0-9]/g, "");
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${digits}?text=${encoded}`;
}

export function productInquiryMessage(productName: string, size?: string) {
  if (size) {
    return `Hi FashunSënze, I'm interested in ${productName}. I'd like to confirm availability in ${size}.`;
  }
  return `Hi FashunSënze, I'm interested in ${productName}. Is it available?`;
}

export function personalShopperMessage(fields: {
  category?: string;
  budget?: string;
  size?: string;
  colour?: string;
  occasion?: string;
  details?: string;
}) {
  const parts = [`Hi FashunSënze, I'd like help finding something.`];
  if (fields.category) parts.push(`I'm looking for: ${fields.category}.`);
  if (fields.occasion) parts.push(`Occasion: ${fields.occasion}.`);
  if (fields.size) parts.push(`My size is ${fields.size}.`);
  if (fields.colour) parts.push(`Preferred colour: ${fields.colour}.`);
  if (fields.budget) parts.push(`My budget is ${fields.budget}.`);
  if (fields.details) parts.push(`Additional details: ${fields.details}`);
  return parts.join(" ");
}

export function orderHelpMessage(orderNumber?: string) {
  return orderNumber
    ? `Hi FashunSënze, I need help with my order ${orderNumber}.`
    : `Hi FashunSënze, I need help with my order.`;
}
