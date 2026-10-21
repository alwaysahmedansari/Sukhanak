// سرور والا Firebase Admin کنکشن۔ یہ فائل کبھی براؤزر میں نہیں جانی چاہیے؛
// "server-only" ایسا ہو جائے تو بلڈ ہی روک دیتا ہے۔

import "server-only";
import { cert, getApp, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

function readConfig() {
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
  // .env میں نئی سطر \n کی شکل میں ہوتی ہے؛ اسے اصل نئی سطر بنانا ضروری ہے
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");

  const missing = Object.entries({
    FIREBASE_ADMIN_PROJECT_ID: projectId,
    FIREBASE_ADMIN_CLIENT_EMAIL: clientEmail,
    FIREBASE_ADMIN_PRIVATE_KEY: privateKey,
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: storageBucket,
  })
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    throw new Error(
      `Firebase Admin کی یہ قدریں .env.local میں خالی ہیں: ${missing.join(", ")}`
    );
  }

  return { projectId, clientEmail, privateKey, storageBucket };
}

// ایپ صرف ایک بار بنتی ہے
export function getAdminApp() {
  if (getApps().length > 0) return getApp();

  const { projectId, clientEmail, privateKey, storageBucket } = readConfig();

  return initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
    storageBucket,
  });
}

export function adminAuth() {
  return getAuth(getAdminApp());
}

export function adminDb() {
  return getFirestore(getAdminApp());
}

// کور تصویر وغیرہ حذف کرنے کے لیے
export function adminBucket() {
  return getStorage(getAdminApp()).bucket();
} 