import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LOCALES, LOCALE_META, DICT, isLocale } from "@/lib/i18n";
import HtmlAttrs from "@/components/HtmlAttrs";
import LangSwitcher from "@/components/LangSwitcher";
import { Lang } from "@/lib/numberWords";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = DICT[locale];
  const languages: Record<string, string> = {};
  LOCALES.forEach((l) => {
    languages[LOCALE_META[l].htmlLang] = `https://sayilar.net/${l}`;
  });
  return {
    title: `${t.siteName} — ${t.heroTitle}`,
    description: t.heroSub,
    alternates: {
      canonical: `https://sayilar.net/${locale}`,
      languages,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = DICT[locale as Lang];

  return (
    <>
      <HtmlAttrs locale={locale as Lang} />
      <div className="topbar">
        <div className="brand">
          <span>
            sayilar<span className="dot">.</span>net
          </span>
        </div>
        <LangSwitcher currentLocale={locale as Lang} />
      </div>
      {children}
      <footer>{t.footer}</footer>
    </>
  );
}
