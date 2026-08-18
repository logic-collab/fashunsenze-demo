export const NIGERIAN_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue",
  "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu",
  "FCT - Abuja", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina",
  "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo",
  "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara",
] as const;

export const PRODUCT_CATEGORIES = [
  "Dresses",
  "Tops",
  "Trousers",
  "Denim",
  "Outerwear",
  "Co-ords",
  "Skirts",
  "Bags",
  "Accessories",
  "Fragrance",
  "Shoes",
] as const;

export const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "One Size"] as const;

export const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "preparing",
  "dispatched",
  "delivered",
  "cancelled",
] as const;

export const PAYMENT_STATUSES = ["pending", "paid", "failed", "refunded"] as const;

export const PRODUCT_STATUSES = ["draft", "published", "hidden", "archived"] as const;

export const DEFAULT_WHATSAPP_NUMBER = "2348099526379";

export const ADMIN_EMAIL = "admin@fashunsenze.com";
export const ADMIN_SESSION_COOKIE = "fs_admin_session";
