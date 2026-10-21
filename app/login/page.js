import { redirect } from "next/navigation";
import AuthForm from "@/components/AuthForm";
import { getCurrentUser } from "@/lib/auth";
import { safeNextPath } from "@/lib/session-config";

export const metadata = { title: "لاگ اِن" };

// Next.js 16 میں searchParams ایک promise ہے
export default async function LoginPage({ searchParams }) {
  const { next } = await searchParams;
  const nextPath = safeNextPath(next);

  // اصل (تصدیق شدہ) سیشن ہو تو آگے بھیج دیں؛ ختم شدہ کوکی پر null آتا ہے، اس لیے چکر نہیں بنتا
  if (await getCurrentUser()) redirect(nextPath);

  return (
    <div className="auth-wrap">
      <AuthForm next={nextPath} />
    </div>
  );
} 