"use client";

// لاگ آؤٹ: براؤزر میں Firebase سے بھی (تصاویر کی اپ لوڈ اسی لاگ اِن پر چلتی ہے)
// اور سرور پر سیشن کوکی بھی ہٹانی ہوتی ہے۔

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { getClientAuth } from "@/lib/firebase/client";

export default function LogoutButton({ className = "btn o", children = "لاگ آؤٹ" }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function onClick() {
    setBusy(true);
    try {
      await signOut(getClientAuth()).catch(() => {});
      await fetch("/api/session", { method: "DELETE" });
    } finally {
      setBusy(false);
      router.replace("/");
      router.refresh();
    }
  }

  return (
    <button type="button" className={className} onClick={onClick} disabled={busy}>
      {children}
    </button>
  );
} 