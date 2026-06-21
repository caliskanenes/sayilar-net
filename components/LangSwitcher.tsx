"use client";

import { usePathname, useRouter } from "next/navigation";
import { LOCALES, LOCALE_META } from "@/lib/i18n";
import { Lang } from "@/lib/numberWords";

export default function LangSwitcher({ currentLocale }: { currentLocale: Lang }) {
  const router = useRouter();
  const pathname = usePathname();

  function go(locale: Lang) {
    const parts = pathname.split("/").filter(Boolean);
    const numberStr = parts[1]; // /[locale]/[number]
    const path = numberStr && /^-?\d+$/.test(numberStr) ? `/${locale}/${numberStr}` : `/${locale}`;
    router.push(path);
  }

  return (
    <div className="lang-switch">
      {LOCALES.map((code) => (
        <button
          key={code}
          onClick={() => go(code)}
          className={code === currentLocale ? "active" : ""}
        >
          {LOCALE_META[code].name}
        </button>
      ))}
    </div>
  );
}
