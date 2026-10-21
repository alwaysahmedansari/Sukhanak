import "server-only";
import { cert, getApp, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

function getFirebaseAdminApp() {
  if (getApps().length > 0) {
    return getApp();
  }

  let serviceAccountString = process.env.FIREBASE_SERVICE_ACCOUNT;

  if (!serviceAccountString) {
    console.error("❌ ERROR: FIREBASE_SERVICE_ACCOUNT Vercel mein mojood nahi hai.");
    throw new Error("Missing FIREBASE_SERVICE_ACCOUNT environment variable.");
  }

  // Vercel kabhi kabhi bahar se quotes laga deta hai, unhe hata rahe hain
  if (serviceAccountString.startsWith('"') && serviceAccountString.endsWith('"')) {
    serviceAccountString = serviceAccountString.slice(1, -1);
  }

  try {
    // JSON string ko object mein convert kar rahe hain
    const serviceAccount = JSON.parse(serviceAccountString);
    
    // Private key mein line breaks (newlines) theek kar rahe hain
    if (serviceAccount.private_key) {
      serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
    }

    return initializeApp({
      credential: cert(serviceAccount),
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    });
  } catch (error) {
    console.error("❌ ERROR: Firebase Admin JSON parse nahi ho saka. Vercel ki value check karein.");
    console.error("Error Details:", error.message);
    throw error;
  }
}

const app = getFirebaseAdminApp();

export const adminAuth = getAuth(app);
export const adminDb = getFirestore(app);
export const adminStorage = getStorage(app);