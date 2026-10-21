import "server-only";
import { cert, getApp, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

function getFirebaseAdminApp() {
  if (getApps().length > 0) {
    return getApp();
  }

  const serviceAccountString = process.env.FIREBASE_SERVICE_ACCOUNT;

  if (!serviceAccountString) {
    throw new Error("Missing FIREBASE_SERVICE_ACCOUNT environment variable.");
  }

  try {
    // JSON string ko parse karein
    const serviceAccount = JSON.parse(serviceAccountString);
    
    // Private key ke line breaks theek karein
    if (serviceAccount.private_key) {
      serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
    }

    return initializeApp({
      credential: cert(serviceAccount),
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    });
  } catch (error) {
    console.error("Firebase Admin Initialization Error:", error);
    throw error;
  }
}

const app = getFirebaseAdminApp();

export const adminAuth = getAuth(app);
export const adminDb = getFirestore(app);
export const adminStorage = getStorage(app);