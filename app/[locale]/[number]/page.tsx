import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DICT, isLocale, LOCALES, LOCALE_META } from "@/lib/i18n";
import { analyzeNumber } from "@/lib/analyze";
import { Lang } from "@/lib/numberWords";
import SpeakButton from "@/components/SpeakButton";

function parseNum(numberStr: string): number | null {
  if (!/^-?\d+$/.test(numberStr)) return null;
  const n = parseInt(numberStr, 10);
  if (!Number.isSafeInteger(n)) return null;
  return n;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; number: string }>;
}): Promise<Metadata> {
  const { locale, number } = await params;
  if (!isLocale(locale)) return {};
  const n = parseNum(number);
  const t = DICT[locale as Lang];

  if (n === null) {
    return {
      title: `${t.errorTitle} — sayilar.net`,
      robots: { index: false, follow: true },
    };
  }

  const data = analyzeNumber(n, locale as Lang, t);
  const description = `${number}: "${data.reading}". ${t.prime} ${
    data.prime === null ? "?" : data.prime ? t.yes : t.no
  }. ${t.roman}: ${data.roman || t.romanNA}.`;

  const languages: Record<string, string> = {};
  LOCALES.forEach((l) => {
    languages[LOCALE_META[l].htmlLang] = `https://sayilar.net/${l}/${number}`;
  });

  return {
    title: `${number} ${t.pageTitleSuffix}`,
    description,
    alternates: {
      canonical: `https://sayilar.net/${locale}/${number}`,
      languages,
    },
    openGraph: {
      title: `${number} — sayilar.net`,
      description,
      type: "website",
    },
  };
}

export default async function NumberPage({
  params,
}: {
  params: Promise<{ locale: string; number: string }>;
}) {
  const { locale, number } = await params;
  if (!isLocale(locale)) notFound();
  const t = DICT[locale as Lang];
  const n = parseNum(number);

  if (n === null) {
    return (
      <main>
        <div className="error-box">
          <div>{t.errorTitle}</div>
          <div className="error-sub">{t.errorBody}</div>
        </div>
      </main>
    );
  }

  const data = analyzeNumber(n, locale as Lang, t);
  const primeTagClass = data.prime === null ? "" : data.prime ? "yes" : "no";
  const primeTagText = data.prime === null ? "?" : data.prime ? t.yes : t.no;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: `${number} - sayilar.net`,
    description: `${number}: ${data.reading}`,
    url: `https://sayilar.net/${locale}/${number}`,
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="specimen">
        <div className="specimen-id">
          <span>SAYILAR.NET</span>
          <span>FILE №{number}</span>
        </div>
        <div className="big-number">{number}</div>
        <div className="reading">&ldquo;{data.reading}&rdquo;</div>
        <div className="reading-tags">
          <span className={`tag ${primeTagClass}`}>
            {t.prime}: {primeTagText}
          </span>
          <span className="tag">
            {t.roman}: {data.roman || t.romanNA}
          </span>
          {data.perfect ? <span className="tag yes">{t.perfect}: {t.yes}</span> : null}
        </div>
        <SpeakButton
          text={data.reading}
          locale={locale as Lang}
          label={t.speak}
          notSupportedLabel={t.notSupported}
        />
      </div>

      <div className="grid">
        {data.facts.map((f, i) => (
          <div className="fact" key={i}>
            <span className="label">{f.label}</span>
            <div className={`value ${f.mono ? "mono" : ""}`}>{f.value}</div>
          </div>
        ))}
      </div>
    </main>
  );
}
