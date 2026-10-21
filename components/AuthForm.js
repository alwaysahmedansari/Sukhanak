"use client";

// لاگ اِن، نیا اکاؤنٹ اور پاس ورڈ کی بحالی ایک ہی فارم میں۔
// کامیابی پر Firebase کا ID ٹوکن /api/session کو بھیجا جاتا ہے، جو سیشن کوکی دیتا ہے۔

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { getClientAuth } from "@/lib/firebase/client";
import { safeNextPath } from "@/lib/session-config";

const TITLES = {
  login: "لاگ اِن",
  signup: "نیا اکاؤنٹ",
  reset: "پاس ورڈ کی بحالی",
};

const SUBMIT = {
  login: "لاگ اِن",
  signup: "اکاؤنٹ بنائیں",
  reset: "لنک بھیجیں",
};

export default function AuthForm({ next = "/" }) {
  const router = useRouter();
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  function switchMode(newMode) {
    setMode(newMode);
    setError("");
    setInfo("");
    setPassword("");
  }

  function showError(err) {
    console.error("ASAL ERROR DETAILED:", err); 
    
    // اصل ایرر کوڈ اور میسج کو بغیر کسی فلٹر کے سکرین پر دکھائیں
    const code = err?.code || "API/Server Error";
    const message = err?.message || "غیر متوقع مسئلہ پیش آیا۔";
    
    setError(`ایرر [${code}]: ${message}`);
  }

  // Firebase میں لاگ اِن ہو چکا؛ اب سرور سے سیشن کوکی لیں
  async function startSession(user, displayName) {
    const idToken = await user.getIdToken();
    const res = await fetch("/api/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken, name: displayName }),
    });
    
    const data = await res.json().catch(() => ({}));

    if (!res.ok || !data.ok) {
      // سیشن نہ بنا تو براؤزر کو بھی لاگ آؤٹ رکھیں
      await signOut(getClientAuth()).catch(() => {});
      
      const serverDetail = data.error || data.details || `HTTP Status: ${res.status} ${res.statusText}`;
      throw new Error(`Session API Failed -> ${serverDetail}`);
    }

    router.replace(safeNextPath(next));
    router.refresh();
  }

  async function onSubmit(event) {
    event.preventDefault();
    setError("");
    setInfo("");
    setBusy(true);

    try {
      const auth = getClientAuth();

      if (mode === "reset") {
        await sendPasswordResetEmail(auth, email.trim());
        setInfo("اگر یہ ای میل رجسٹر ہے تو پاس ورڈ بدلنے کا لنک بھیج دیا گیا ہے۔");
      } else if (mode === "signup") {
        const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
        await updateProfile(cred.user, { displayName: name.trim() }).catch(() => {});
        await startSession(cred.user, name.trim());
      } else {
        const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
        await startSession(cred.user);
      }
    } catch (err) {
      showError(err);
    } finally {
      setBusy(false);
    }
  }

  async function onGoogle() {
    setError("");
    setInfo("");
    setBusy(true);

    try {
      const cred = await signInWithPopup(getClientAuth(), new GoogleAuthProvider());
      await startSession(cred.user);
    } catch (err) {
      showError(err);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth">
      <h1>{TITLES[mode]}</h1>

      {mode !== "reset" && (
        <div className="tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={mode === "login"}
            className={`tab${mode === "login" ? " on" : ""}`}
            onClick={() => switchMode("login")}
          >
            لاگ اِن
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === "signup"}
            className={`tab${mode === "signup" ? " on" : ""}`}
            onClick={() => switchMode("signup")}
          >
            نیا اکاؤنٹ
          </button>
        </div>
      )}

      <div aria-live="polite">
        {error && <div className="auth-msg err">{error}</div>}
        {info && <div className="auth-msg ok">{info}</div>}
      </div>

      <form onSubmit={onSubmit}>
        {mode === "signup" && (
          <div className="field">
            <label htmlFor="auth-name">نام</label>
            <input
              id="auth-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              required
              minLength={2}
              maxLength={60}
            />
          </div>
        )}

        <div className="field">
          <label htmlFor="auth-email">ای میل</label>
          <input
            id="auth-email"
            type="email"
            dir="ltr"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </div>

        {mode !== "reset" && (
          <div className="field">
            <label htmlFor="auth-password">پاس ورڈ</label>
            <input
              id="auth-password"
              type="password"
              dir="ltr"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              required
              minLength={8}
            />
          </div>
        )}

        <button type="submit" className="btn block" disabled={busy}>
          {busy ? "…" : SUBMIT[mode]}
        </button>
      </form>

      {mode === "login" && (
        <p className="auth-foot">
          <button type="button" className="auth-link" onClick={() => switchMode("reset")}>
            پاس ورڈ بھول گئے؟
          </button>
        </p>
      )}

      {mode === "reset" && (
        <p className="auth-foot">
          <button type="button" className="auth-link" onClick={() => switchMode("login")}>
            واپس لاگ اِن پر
          </button>
        </p>
      )}

      {mode !== "reset" && (
        <>
          <div className="auth-or">یا</div>
          <button type="button" className="btn o block" onClick={onGoogle} disabled={busy}>
            گوگل سے جاری رکھیں
          </button>
        </>
      )}
    </div>
  );
}
