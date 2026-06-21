"use client";

import { Lang } from "@/lib/numberWords";
import { LOCALE_META } from "@/lib/i18n";

export default function SpeakButton({
  text,
  locale,
  label,
  notSupportedLabel,
}: {
  text: string;
  locale: Lang;
  label: string;
  notSupportedLabel: string;
}) {
  function speak() {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      alert(notSupportedLabel);
      return;
    }
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = LOCALE_META[locale].speechLang;
    window.speechSynthesis.speak(utter);
  }

  return (
    <div className="speak-row">
      <button onClick={speak}>🔊 {label}</button>
    </div>
  );
}
