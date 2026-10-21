// سیشن کوکی کے نام اور مدت کی ایک ہی جگہ۔
// proxy.js، app/api/session/route.js اور (آگے) lib/auth.js سب یہیں سے پڑھتے ہیں۔

export const SESSION_COOKIE = "session";

// Firebase سیشن کوکی کی زیادہ سے زیادہ حد ۱۴ دن ہے
export const SESSION_DAYS = 5;

// "next" کا راستہ صرف اپنی سائٹ کا ہو۔
// "//" یا "/\" سے شروع ہونے والے راستے دوسری سائٹ پر بھیج سکتے ہیں، اس لیے رد۔
// /login پر واپس بھیجنا بھی رد، تاکہ چکر نہ بنے۔
export function safeNextPath(value, fallback = "/") {
  if (typeof value !== "string") return fallback;
  if (!value.startsWith("/")) return fallback;
  if (value.startsWith("//") || value.startsWith("/\\")) return fallback;
  if (/[\u0000-\u001f]/.test(value)) return fallback;
  if (value === "/login" || value.startsWith("/login?") || value.startsWith("/login/")) {
    return fallback;
  }
  return value;
} 