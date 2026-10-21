// براؤزر والا Firebase کنکشن: لاگ اِن اور تصاویر کی اپ لوڈ کے لیے۔
// اسے صرف کلائنٹ کمپونینٹس میں استعمال کریں۔

import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Next.js صرف سیدھے نام سے پڑھی گئی NEXT_PUBLIC_ قدریں براؤزر کو دیتا ہے،
// اس لیے ہر قدر الگ لکھی ہے (لوپ یا process.env[name] سے کام نہیں چلے گا)۔
const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// ایپ صرف ایک بار بنتی ہے، چاہے ڈیولپمنٹ میں فائل بار بار لوڈ ہو
export function getClientApp() {
  const missing = Object.entries(config)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    throw new Error(
      `Firebase کی یہ قدریں .env.local میں خالی ہیں: ${missing.join(", ")}`
    );
  }

  return getApps().length > 0 ? getApp() : initializeApp(config);
}

export function getClientAuth() {
  return getAuth(getClientApp());
}

export function getClientStorage() {
  return getStorage(getClientApp());
} 