"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lang } from "@/lib/numberWords";

export default function SearchBox({
  locale,
  placeholder,
  goLabel,
  defaultValue,
}: {
  locale: Lang;
  placeholder: string;
  goLabel: string;
  defaultValue?: string;
}) {
  const router = useRouter();
  const [value, setValue] = useState(defaultValue || "");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const v = value.trim();
    if (/^-?\d+$/.test(v)) {
      router.push(`/${locale}/${v}`);
    }
  }

  return (
    <form className="search-row" onSubmit={handleSubmit}>
      <input
        type="text"
        inputMode="numeric"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        autoComplete="off"
      />
      <button type="submit">{goLabel}</button>
    </form>
  );
}
