import Link from "next/link";
import { Noto_Naskh_Arabic, Noto_Nastaliq_Urdu } from "next/font/google";
import "./globals.css";

// نسخ: نیویگیشن، بٹن، میٹا اور چھوٹا متن
const naskh = Noto_Naskh_Arabic({
  subsets: ["arabic"],
  variable: "--font-ui",
  display: "swap",
});

// نستعلیق: لوگو، عنوان اور مضمون کا متن
const nastaliq = Noto_Nastaliq_Urdu({
  subsets: ["arabic"],
  variable: "--font-disp",
  display: "swap",
});

export const metadata = {
  title: { default: "سُخنک", template: "%s — سُخنک" },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#121212" },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="ur" dir="rtl" className={`${naskh.variable} ${nastaliq.variable}`}>
      <body>
        <header className="top">
          <Link className="logo" href="/" aria-label="سُخنک">
            سُخنک
          </Link>

          <form className="q-form" action="/search" role="search">
            <input
              className="q"
              name="q"
              type="search"
              placeholder="تلاش کریں"
              aria-label="تلاش"
            />
          </form>

          <nav className="nav">
            <Link className="ib" href="/write" aria-label="لکھیں" title="لکھیں">
              <svg
                viewBox="0 0 24 24"
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.1 2.1 0 0 1 3 3L12 14l-4 1 1-4z" />
              </svg>
            </Link>
          </nav>
        </header>

        <main className="wrap">{children}</main>

        <footer className="foot">
          <nav>
            <Link href="/about">ہمارے بارے میں</Link>
            <Link href="/guidelines">اصولِ تحریر</Link>
            <Link href="/privacy">پرائیویسی</Link>
            <Link href="/contact">رابطہ</Link>
          </nav>
          © سُخنک
        </footer>
      </body>
    </html>
  );
} 