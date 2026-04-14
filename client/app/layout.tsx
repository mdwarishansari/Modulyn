import type { Metadata, Viewport } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import Script from "next/script";
import { Navbar } from "@/components/shared/Navbar";
import { ToastProvider } from "@/components/ui/Toast";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Modulyn — Modular Event Platform",
    template: "%s | Modulyn",
  },
  description:
    "A multi-tenant modular event operating platform for colleges, clubs, and organizations.",
  keywords: ["events", "hackathon", "quiz", "contest", "modular", "platform"],
  authors: [{ name: "Modulyn" }],
  creator: "Modulyn",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  openGraph: {
    type: "website",
    locale: "en_IN",
    title: "Modulyn — Modular Event Platform",
    description: "Run complete events from one system. Quiz, hackathon, coding, and more.",
    siteName: "Modulyn",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)",  color: "#0c0c10"  },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${geistMono.variable}`}
    >
      <head>
        <Script id="theme-init" strategy="beforeInteractive">{`
          (function() {
            try {
              var theme = localStorage.getItem('modulyn_theme');
              var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
              if (theme === 'dark' || (!theme && prefersDark)) {
                document.documentElement.classList.add('dark');
              }
            } catch(e) {}
          })();
        `}</Script>
      </head>
      <body className="min-h-dvh flex flex-col bg-[var(--bg-base)] text-[var(--text-primary)] antialiased">
        <ClerkProvider>
          <ToastProvider>
            <Navbar />
            <ErrorBoundary>
              <main className="flex-1">
                {children}
              </main>
            </ErrorBoundary>
          </ToastProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
