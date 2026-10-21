// سرور پر موجودہ صارف کی اصل تصدیق۔
// proxy.js صرف کوکی کی موجودگی دیکھتا ہے؛ کوکی درست ہے یا نہیں، یہ یہاں طے ہوتا ہے۔
// سرور کمپونینٹس اور API راستوں دونوں میں چلتا ہے۔

import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { SESSION_COOKIE, safeNextPath } from "@/lib/session-config";

// درست سیشن ہو تو صارف کی بنیادی معلومات، ورنہ null۔
// cache: ایک درخواست میں بار بار بلانے پر تصدیق صرف ایک بار ہوتی ہے۔
export const getCurrentUser = cache(async () => {
  const store = await cookies();
  const sessionCookie = store.get(SESSION_COOKIE)?.value;
  if (!sessionCookie) return null;

  try {
    // true: منسوخ (revoked) سیشن بھی رد۔ اس کی قیمت ہر درخواست پر ایک اضافی جانچ ہے۔
    const decoded = await adminAuth().verifySessionCookie(sessionCookie, true);
    return {
      uid: decoded.uid,
      email: decoded.email ?? null,
      emailVerified: decoded.email_verified ?? false,
      role: decoded.role ?? "user",
    };
  } catch {
    return null;
  }
});

// پروفائل (نام، یوزر نیم، تصویر، کردار)۔ لاگ اِن نہ ہو تو null۔
export const getCurrentProfile = cache(async () => {
  const user = await getCurrentUser();
  if (!user) return null;

  const snap = await adminDb().collection("users").doc(user.uid).get();
  if (!snap.exists) return null;

  const data = snap.data();
  return {
    uid: user.uid,
    displayName: data.displayName,
    username: data.username,
    photoURL: data.photoURL ?? null,
    role: data.role ?? "user",
  };
});

// صرف سرور کمپونینٹس کے صفحات کے لیے: لاگ اِن نہ ہو تو /login پر بھیجتا ہے۔
// API راستوں میں اسے نہ بلائیں؛ وہاں getCurrentUser() دیکھ کر 401 JSON لوٹائیں۔
export async function requireUser(nextPath = "/") {
  const user = await getCurrentUser();
  if (!user) {
    redirect(`/login?next=${encodeURIComponent(safeNextPath(nextPath))}`);
  }
  return user;
} 