// سیشن کوکی کے نام اور مدت کی ایک ہی جگہ۔
// proxy.js، app/api/session/route.js اور (آگے) lib/auth.js سب یہیں سے پڑھتے ہیں۔

export const SESSION_COOKIE = "session";

// Firebase سیشن کوکی کی زیادہ سے زیادہ حد ۱۴ دن ہے
export const SESSION_DAYS = 5; 