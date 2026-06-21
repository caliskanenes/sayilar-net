export type Lang = "tr" | "en" | "es" | "ar" | "zh";

export function trNumber(n: number): string {
  if (n === 0) return "sıfır";
  const ones = ["", "bir", "iki", "üç", "dört", "beş", "altı", "yedi", "sekiz", "dokuz"];
  const tens = ["", "on", "yirmi", "otuz", "kırk", "elli", "altmış", "yetmiş", "seksen", "doksan"];
  const scales = ["", "bin", "milyon", "milyar", "trilyon", "katrilyon", "kentilyon"];
  const neg = n < 0;
  n = Math.abs(n);

  function threeDigits(num: number): string {
    const h = Math.floor(num / 100);
    const t = Math.floor((num % 100) / 10);
    const o = num % 10;
    let s = "";
    if (h > 0) s += (h === 1 ? "" : ones[h]) + "yüz";
    if (t > 0) s += (s ? " " : "") + tens[t];
    if (o > 0) s += (s ? " " : "") + ones[o];
    return s.trim();
  }

  const groups: number[] = [];
  let temp = n;
  if (temp === 0) groups.push(0);
  while (temp > 0) {
    groups.unshift(temp % 1000);
    temp = Math.floor(temp / 1000);
  }
  const parts: string[] = [];
  let scaleIdx = groups.length - 1;
  for (const g of groups) {
    if (g > 0) {
      let txt = threeDigits(g);
      if (scaleIdx === 1 && g === 1) txt = "bin";
      else if (scaleIdx > 0) txt = txt + " " + scales[scaleIdx];
      parts.push(txt.trim());
    }
    scaleIdx--;
  }
  const result = parts.join(" ").replace(/\s+/g, " ").trim();
  return (neg ? "eksi " : "") + result;
}

export function enNumber(n: number): string {
  if (n === 0) return "zero";
  const ones = [
    "", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten",
    "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen",
  ];
  const tens = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
  const scales = ["", "thousand", "million", "billion", "trillion", "quadrillion", "quintillion"];
  const neg = n < 0;
  n = Math.abs(n);

  function threeDigits(num: number): string {
    const h = Math.floor(num / 100);
    const rem = num % 100;
    let s = "";
    if (h > 0) s += ones[h] + " hundred";
    if (rem > 0) {
      if (s) s += " and ";
      if (rem < 20) s += ones[rem];
      else {
        const t = Math.floor(rem / 10);
        const o = rem % 10;
        s += tens[t] + (o > 0 ? "-" + ones[o] : "");
      }
    }
    return s.trim();
  }

  const groups: number[] = [];
  let temp = n;
  while (temp > 0) {
    groups.unshift(temp % 1000);
    temp = Math.floor(temp / 1000);
  }
  const parts: string[] = [];
  let scaleIdx = groups.length - 1;
  for (const g of groups) {
    if (g > 0) {
      let txt = threeDigits(g);
      if (scaleIdx > 0) txt += " " + scales[scaleIdx];
      parts.push(txt);
    }
    scaleIdx--;
  }
  return (neg ? "negative " : "") + parts.join(", ");
}

export function esNumber(n: number): string {
  if (n === 0) return "cero";
  const ones = [
    "", "uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve", "diez",
    "once", "doce", "trece", "catorce", "quince", "dieciséis", "diecisiete", "dieciocho", "diecinueve",
  ];
  const tens20 = [
    "veinte", "veintiuno", "veintidós", "veintitrés", "veinticuatro", "veinticinco",
    "veintiséis", "veintisiete", "veintiocho", "veintinueve",
  ];
  const tens = ["", "", "veinte", "treinta", "cuarenta", "cincuenta", "sesenta", "setenta", "ochenta", "noventa"];
  const hundreds = ["", "ciento", "doscientos", "trescientos", "cuatrocientos", "quinientos", "seiscientos", "setecientos", "ochocientos", "novecientos"];
  const neg = n < 0;
  n = Math.abs(n);

  function twoDigits(num: number): string {
    if (num < 20) return ones[num];
    if (num < 30) return tens20[num - 20];
    const t = Math.floor(num / 10);
    const o = num % 10;
    return tens[t] + (o > 0 ? " y " + ones[o] : "");
  }
  function threeDigits(num: number): string {
    if (num === 100) return "cien";
    const h = Math.floor(num / 100);
    const rem = num % 100;
    let s = "";
    if (h > 0) s += hundreds[h];
    if (rem > 0) s += (s ? " " : "") + twoDigits(rem);
    return s.trim();
  }

  const groups: number[] = [];
  let temp = n;
  while (temp > 0) {
    groups.unshift(temp % 1000);
    temp = Math.floor(temp / 1000);
  }
  if (groups.length === 0) groups.push(0);
  const scaleNames = ["", "mil", "millón", "mil millones", "billón"];
  const parts: string[] = [];
  let scaleIdx = groups.length - 1;
  for (const g of groups) {
    if (g > 0) {
      let txt = threeDigits(g);
      if (scaleIdx === 1) {
        txt = g === 1 ? "mil" : txt + " mil";
      } else if (scaleIdx >= 2) {
        const scaleWord = scaleNames[scaleIdx] || "";
        const pluralWord = scaleWord.endsWith("ón") ? scaleWord.slice(0, -2) + "ones" : scaleWord;
        txt = g === 1 ? "un " + scaleWord : txt + " " + pluralWord;
      }
      parts.push(txt.trim());
    }
    scaleIdx--;
  }
  return (neg ? "menos " : "") + parts.join(" ");
}

export function arNumber(n: number): string {
  if (n === 0) return "صفر";
  const ones = ["", "واحد", "اثنان", "ثلاثة", "أربعة", "خمسة", "ستة", "سبعة", "ثمانية", "تسعة"];
  const teens = ["عشرة", "أحد عشر", "اثنا عشر", "ثلاثة عشر", "أربعة عشر", "خمسة عشر", "ستة عشر", "سبعة عشر", "ثمانية عشر", "تسعة عشر"];
  const tens = ["", "", "عشرون", "ثلاثون", "أربعون", "خمسون", "ستون", "سبعون", "ثمانون", "تسعون"];
  const hundredsWord = "مئة";
  const neg = n < 0;
  n = Math.abs(n);

  function twoDigits(num: number): string {
    if (num < 10) return ones[num];
    if (num < 20) return teens[num - 10];
    const t = Math.floor(num / 10);
    const o = num % 10;
    return o > 0 ? ones[o] + " و" + tens[t] : tens[t];
  }
  function threeDigits(num: number): string {
    const h = Math.floor(num / 100);
    const rem = num % 100;
    let s = "";
    if (h > 0) s += h === 1 ? "مئة" : h === 2 ? "مئتان" : ones[h] + " " + hundredsWord;
    if (rem > 0) s += (s ? " و" : "") + twoDigits(rem);
    return s.trim();
  }

  const groups: number[] = [];
  let temp = n;
  while (temp > 0) {
    groups.unshift(temp % 1000);
    temp = Math.floor(temp / 1000);
  }
  if (groups.length === 0) groups.push(0);
  const scales = ["", "ألف", "مليون", "مليار", "تريليون"];
  const parts: string[] = [];
  let scaleIdx = groups.length - 1;
  for (const g of groups) {
    if (g > 0) {
      let txt = threeDigits(g);
      if (scaleIdx > 0) {
        const scaleWord = scales[scaleIdx];
        txt = g === 1 ? scaleWord : txt + " " + scaleWord;
      }
      parts.push(txt.trim());
    }
    scaleIdx--;
  }
  return (neg ? "سالب " : "") + parts.join(" و");
}

export function zhNumber(n: number): string {
  if (n === 0) return "零";
  const digits = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
  const units = ["", "十", "百", "千"];
  const bigUnits = ["", "万", "亿", "兆"];
  const neg = n < 0;
  n = Math.abs(n);

  function fourDigits(num: number): string {
    let s = "";
    const str = String(num).padStart(4, "0");
    let zeroFlag = false;
    for (let i = 0; i < 4; i++) {
      const d = parseInt(str[i]);
      const unit = units[3 - i];
      if (d === 0) {
        zeroFlag = true;
      } else {
        if (zeroFlag && s !== "") s += "零";
        zeroFlag = false;
        if (!(d === 1 && unit === "十" && s === "")) s += digits[d];
        s += unit;
      }
    }
    return s.replace(/^一十/, "十");
  }

  const groups: number[] = [];
  let temp = n;
  while (temp > 0) {
    groups.unshift(temp % 10000);
    temp = Math.floor(temp / 10000);
  }
  if (groups.length === 0) groups.push(0);
  const parts: string[] = [];
  let scaleIdx = groups.length - 1;
  for (const g of groups) {
    if (g > 0) {
      parts.push(fourDigits(g) + bigUnits[scaleIdx]);
    } else if (parts.length > 0) {
      parts.push("零");
    }
    scaleIdx--;
  }
  return (
    (neg ? "负" : "") +
    parts.join("").replace(/零+/g, "零").replace(/零$/, "")
  );
}

export function numberToWords(n: number, lang: Lang): string {
  switch (lang) {
    case "tr":
      return trNumber(n);
    case "en":
      return enNumber(n);
    case "es":
      return esNumber(n);
    case "ar":
      return arNumber(n);
    case "zh":
      return zhNumber(n);
    default:
      return enNumber(n);
  }
}
