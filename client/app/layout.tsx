import type { Metadata, Viewport } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import { ClerkProvider, Show } from "@clerk/nextjs";
import Script from "next/script";
import { AuthButtons } from "@/components/auth/AuthButtons";
import { UserMenu } from "@/components/auth/UserMenu";
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
        {/*
          Theme init via next/script with strategy="beforeInteractive" so it runs
          before React hydrates and prevents flash of wrong theme.
          Using next/script instead of raw <script> silences the React warning.
        */}
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
          <header className="flex items-center justify-between px-6 py-3 border-b border-[var(--border-subtle)] bg-[var(--bg-card)]">
            <span className="font-semibold text-[var(--text-primary)] tracking-tight">
              Modulyn
            </span>
            <div className="flex items-center gap-3">
              <Show when="signed-out">
                <AuthButtons />
              </Show>
              <Show when="signed-in">
                <UserMenu />
              </Show>
            </div>
          </header>
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
