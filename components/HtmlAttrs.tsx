"use client";

import { useEffect } from "react";
import { Lang } from "@/lib/numberWords";
import { LOCALE_META } from "@/lib/i18n";

export default function HtmlAttrs({ locale }: { locale: Lang }) {
  useEffect(() => {
    document.documentElement.lang = LOCALE_META[locale].htmlLang;
    document.body.dir = LOCALE_META[locale].dir;
  }, [locale]);
  return null;
}
