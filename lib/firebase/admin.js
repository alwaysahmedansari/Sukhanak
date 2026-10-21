import "server-only";
import { cert, getApp, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

// یہ فنکشن چیک کرتا ہے کہ Firebase پہلے سے انیشلائز ہے یا نہیں
function getFirebaseAdminApp() {
  if (getApps().length > 0) {
    return getApp();
  }

  // Vercel سے وہ پوری JSON سٹرنگ لیں جو ہم نے ڈالی تھی
  const serviceAccountString = process.env.FIREBASE_SERVICE_ACCOUNT;

  if (!serviceAccountString) {
    throw new Error("Missing FIREBASE_SERVICE_ACCOUNT environment variable.");
  }

  try {
    // JSON سٹرنگ کو آبجیکٹ میں تبدیل کریں
    const serviceAccount = JSON.parse(serviceAccountString);
    
    // اگر پرائیویٹ کی میں لائن بریک کا مسئلہ ہو تو اسے ٹھیک کریں
    if (serviceAccount.private_key) {
      serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
    }

    // Firebase کو انیشلائز کریں
    return initializeApp({
      credential: cert(serviceAccount),
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    });
  } catch (error) {
    console.error("Firebase admin initialization error:", error);
    throw error;
  }
}

// ایپ کو انیشلائز کریں
const app = getFirebaseAdminApp();

// ایکسپورٹ کریں تاکہ باقی فائلز میں استعمال ہو سکیں
export const adminAuth = getAuth(app);
export const adminDb = getFirestore(app);
export const adminStorage = getStorage(app);