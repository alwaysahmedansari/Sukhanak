// لاگ اِن کے بعد براؤزر یہاں اپنا ID ٹوکن بھیجتا ہے۔
// POST   : ٹوکن کی تصدیق، پہلی بار آنے والے کا پروفائل بنانا، سیشن کوکی دینا
// DELETE : لاگ آؤٹ (کوکی ہٹانا)

import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { SESSION_COOKIE, SESSION_DAYS } from "@/lib/session-config";

const DAY_SECONDS = 24 * 60 * 60;
// سیشن صرف تازہ لاگ اِن سے بنے، پرانے ٹوکن سے نہیں
const RECENT_SIGN_IN_SECONDS = 5 * 60;

const cookieBase = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
};

function fail(message, status) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

function cleanName(value) {
  if (typeof value !== "string") return "";
  return value.replace(/\s+/g, " ").trim().slice(0, 60);
}

// ای میل کا کوئی حصہ نام یا یوزر نیم میں نہیں جاتا
async function ensureProfile(decoded, nameFromForm) {
  const db = adminDb();
  const userRef = db.collection("users").doc(decoded.uid);

  if ((await userRef.get()).exists) return;

  const displayName =
    cleanName(nameFromForm) || cleanName(decoded.name) || "نیا لکھاری";
  const photoURL =
    typeof decoded.picture === "string" && decoded.picture.startsWith("https://")
      ? decoded.picture
      : null;

  // بے ترتیب یوزر نیم ٹکرا جائے تو چند بار دوبارہ کوشش
  for (let attempt = 0; attempt < 5; attempt++) {
    const username = "u" + randomBytes(5).toString("hex");
    const nameRef = db.collection("usernames").doc(username);

    try {
      await db.runTransaction(async (tx) => {
        const [userSnap, nameSnap] = await Promise.all([
          tx.get(userRef),
          tx.get(nameRef),
        ]);

        if (userSnap.exists) return; // دوسری درخواست پہلے بنا چکی
        if (nameSnap.exists) throw new Error("USERNAME_TAKEN");

        tx.set(nameRef, {
          uid: decoded.uid,
          createdAt: FieldValue.serverTimestamp(),
        });
        tx.set(userRef, {
          displayName,
          username,
          bio: "",
          photoURL,
          role: "user",
          followersCount: 0,
          followingCount: 0,
          createdAt: FieldValue.serverTimestamp(),
        });
      });
      return;
    } catch (error) {
      if (error.message !== "USERNAME_TAKEN") throw error;
    }
  }

  throw new Error("یوزر نیم نہ بن سکا");
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return fail("درخواست درست نہیں۔", 400);
  }

  const idToken = body?.idToken;
  if (typeof idToken !== "string" || idToken.length === 0) {
    return fail("لاگ اِن کا ٹوکن موجود نہیں۔", 400);
  }

  let decoded;
  try {
    decoded = await adminAuth().verifyIdToken(idToken);
  } catch {
    return fail("لاگ اِن کی تصدیق نہ ہو سکی۔ دوبارہ کوشش کریں۔", 401);
  }

  if (Date.now() / 1000 - decoded.auth_time > RECENT_SIGN_IN_SECONDS) {
    return fail("لاگ اِن پرانا ہو چکا ہے۔ دوبارہ لاگ اِن کریں۔", 401);
  }

  try {
    await ensureProfile(decoded, body?.name);

    const sessionCookie = await adminAuth().createSessionCookie(idToken, {
      expiresIn: SESSION_DAYS * DAY_SECONDS * 1000,
    });

    const response = NextResponse.json({ ok: true });
    response.cookies.set(SESSION_COOKIE, sessionCookie, {
      ...cookieBase,
      maxAge: SESSION_DAYS * DAY_SECONDS,
    });
    return response;
  } catch (error) {
    console.error("session POST failed:", error);
    return fail("سرور پر مسئلہ آیا۔ ذرا دیر بعد کوشش کریں۔", 500);
  }
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, "", { ...cookieBase, maxAge: 0 });
  return response;
} 
