import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";

import { MatomoAnalytics } from "@/components/analytics/MatomoAnalytics";
import { Header, Footer } from "@/components/layout/HeaderFooter";
import { routing } from "@/i18n/routing";
import { createDefaultMetadata } from "@/lib/metadata";

import "../globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return createDefaultMetadata(locale);
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} className={inter.variable}>
      <body className="min-h-screen antialiased">
        <NextIntlClientProvider messages={messages}>
          <Header />
          <main>{children}</main>
          <Footer />
          <Suspense fallback={null}>
            <MatomoAnalytics />
          </Suspense>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
