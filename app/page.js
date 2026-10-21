import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import { getCurrentProfile } from "@/lib/auth";

// عارضی صفحہ: فیڈ آنے والی کھیپوں میں بنے گی۔
// فی الحال صرف لاگ اِن کی حالت دکھاتا ہے تاکہ لاگ اِن کو آزمایا جا سکے۔
export default async function Home() {
  const profile = await getCurrentProfile();

  return (
    <section className="empty">
      {profile ? (
        <>
          <p>آپ {profile.displayName} کے طور پر لاگ اِن ہیں۔</p>
          <LogoutButton />
        </>
      ) : (
        <>
          <p>فیڈ جلد یہاں آئے گی۔</p>
          <Link className="btn" href="/login">
            لاگ اِن
          </Link>
        </>
      )}
    </section>
  );
} 