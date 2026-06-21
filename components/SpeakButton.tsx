"use client";

import { useState } from "react";
import { Lang } from "@/lib/numberWords";
import { LOCALE_META } from "@/lib/i18n";

function getVoicesAsync(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    const existing = window.speechSynthesis.getVoices();
    if (existing.length > 0) {
      resolve(existing);
      return;
    }
    let resolved = false;
    const onVoicesChanged = () => {
      if (resolved) return;
      resolved = true;
      window.speechSynthesis.removeEventListener("voiceschanged", onVoicesChanged);
      resolve(window.speechSynthesis.getVoices());
    };
    window.speechSynthesis.addEventListener("voiceschanged", onVoicesChanged);
    setTimeout(() => {
      if (resolved) return;
      resolved = true;
      window.speechSynthesis.removeEventListener("voiceschanged", onVoicesChanged);
      resolve(window.speechSynthesis.getVoices());
    }, 1000);
  });
}

function pickVoice(voices: SpeechSynthesisVoice[], targetLang: string): SpeechSynthesisVoice | null {
  const target = targetLang.toLowerCase();
  const targetPrefix = target.split("-")[0];
  let match = voices.find((v) => v.lang.toLowerCase() === target);
  if (match) return match;
  match = voices.find((v) => v.lang.toLowerCase().startsWith(targetPrefix));
  if (match) return match;
  return null;
}

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
  const [unavailable, setUnavailable] = useState(false);

  async function speak() {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      alert(notSupportedLabel);
      return;
    }
    window.speechSynthesis.cancel();

    const targetLang = LOCALE_META[locale].speechLang;
    const voices = await getVoicesAsync();
    const voice = pickVoice(voices, targetLang);

    if (!voice && voices.length > 0) {
      setUnavailable(true);
    } else {
      setUnavailable(false);
    }

    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = targetLang;
    if (voice) utter.voice = voice;
    window.speechSynthesis.speak(utter);
  }

  return (
    <div className="speak-row">
      <button onClick={speak}>🔊 {label}</button>
      {unavailable && (
        <div className="speak-warning">
          {LOCALE_META[locale].name} {"\u2014"} bu dil için sesli okuma cihazınızda
          kurulu değil (tarayıcı veya işletim sistemi dil paketi eksik olabilir).
        </div>
      )}
    </div>
  );
}