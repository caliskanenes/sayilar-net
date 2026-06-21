import { DICT, isLocale } from "@/lib/i18n";
import { notFound } from "next/navigation";
import SearchBox from "@/components/SearchBox";
import Link from "next/link";
import { Lang } from "@/lib/numberWords";

const EXAMPLES = [7, 42, 1453, -1, 1000000];

export default async function LocaleHome({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = DICT[locale as Lang];

  return (
    <>
      <div className="hero">
        <h1>{t.heroTitle}</h1>
        <p className="sub">{t.heroSub}</p>
        <SearchBox locale={locale as Lang} placeholder={t.placeholder} goLabel={t.go} />
        <div className="examples">
          {t.examples}{" "}
          {EXAMPLES.map((ex) => (
            <Link key={ex} href={`/${locale}/${ex}`}>
              {ex}
            </Link>
          ))}
        </div>
      </div>
      <main>
        <p className="intro-text">{t.intro}</p>
      </main>
    </>
  );
}
