import { Lang, numberToWords } from "./numberWords";

export function toRoman(n: number): string | null {
  if (n < 1 || n > 3999999 || !Number.isInteger(n)) return null;
  function basicRoman(num: number): string {
    const vals = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
    const syms = ["M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"];
    let res = "";
    for (let i = 0; i < vals.length; i++) {
      while (num >= vals[i]) {
        res += syms[i];
        num -= vals[i];
      }
    }
    return res;
  }
  if (n <= 3999) return basicRoman(n);
  const thousandsPart = Math.floor(n / 1000);
  const remainder = n % 1000;
  const thousandsRoman = toRoman(thousandsPart) || basicRoman(thousandsPart);
  return `[${thousandsRoman}]${remainder > 0 ? basicRoman(remainder) : ""}`;
}

export function isPrime(n: number): boolean | null {
  if (!Number.isInteger(n) || n < 2) return false;
  if (n === 2) return true;
  if (n % 2 === 0) return false;
  if (n > 1e14) return null;
  for (let i = 3; i * i <= n; i += 2) {
    if (n % i === 0) return false;
  }
  return true;
}

export function divisors(n: number): number[] | null {
  if (n <= 0 || n > 1e7) return null;
  const divs: number[] = [];
  for (let i = 1; i * i <= n; i++) {
    if (n % i === 0) {
      divs.push(i);
      if (i !== n / i) divs.push(n / i);
    }
  }
  return divs.sort((a, b) => a - b);
}

export function isPerfect(n: number, divs: number[] | null): boolean | null {
  if (!divs) return null;
  if (n <= 0) return false;
  const sum = divs.reduce((a, b) => a + b, 0) - n;
  return sum === n;
}

export function isPalindrome(n: number): boolean {
  const s = Math.abs(n).toString();
  return s === s.split("").reverse().join("");
}

export function isFibonacci(n: number): boolean {
  if (n < 0) return false;
  let a = 0,
    b = 1;
  if (n === 0) return true;
  while (b <= n) {
    if (b === n) return true;
    [a, b] = [b, a + b];
  }
  return false;
}

export function isTriangular(n: number): boolean {
  if (n < 0) return false;
  const k = Math.floor((Math.sqrt(8 * n + 1) - 1) / 2);
  return (k * (k + 1)) / 2 === n;
}

export function factorial(n: number): string | null {
  if (n < 0 || n > 170 || !Number.isInteger(n)) return null;
  let r = 1n;
  for (let i = 2; i <= n; i++) r *= BigInt(i);
  return r.toString();
}

export interface Fact {
  label: string;
  value: string;
  mono?: boolean;
}

export interface NumberAnalysis {
  n: number;
  reading: string;
  prime: boolean | null;
  roman: string | null;
  perfect: boolean | null;
  facts: Fact[];
}

// localeMap for toLocaleString grouping
const localeMap: Record<Lang, string> = {
  tr: "tr-TR",
  en: "en-US",
  es: "es-ES",
  ar: "ar-SA",
  zh: "zh-CN",
};

export function analyzeNumber(n: number, lang: Lang, t: Record<string, string>): NumberAnalysis {
  const absStr = Math.abs(n).toString();
  const digitSum = absStr.split("").reduce((a, d) => a + parseInt(d), 0);
  const divs = divisors(n);
  const prime = isPrime(n);
  const roman = toRoman(n);
  const sqrtVal = Math.sqrt(Math.abs(n));
  const isPerfectSquare = Number.isInteger(sqrtVal) && n >= 0;
  const perfect = isPerfect(n, divs);
  const locale = localeMap[lang];

  const facts: Fact[] = [];
  facts.push({ label: t.parity, value: n % 2 === 0 ? t.even : t.odd });
  facts.push({ label: t.sign, value: n > 0 ? t.positive : n < 0 ? t.negative : t.zeroSign });
  facts.push({ label: t.digitCount, value: String(absStr.length) });
  facts.push({ label: t.digitSum, value: String(digitSum) });
  facts.push({
    label: t.binary,
    value: n >= 0 ? n.toString(2) : "-" + Math.abs(n).toString(2),
    mono: true,
  });
  facts.push({
    label: t.octal,
    value: n >= 0 ? n.toString(8) : "-" + Math.abs(n).toString(8),
    mono: true,
  });
  facts.push({
    label: t.hex,
    value: (n >= 0 ? n.toString(16) : "-" + Math.abs(n).toString(16)).toUpperCase(),
    mono: true,
  });
  facts.push({ label: t.square, value: (n * n).toLocaleString(locale), mono: true });
  if (Number.isSafeInteger(n * n * n)) {
    facts.push({ label: t.cube, value: (n * n * n).toLocaleString(locale), mono: true });
  }
  facts.push({
    label: t.sqrt,
    value: isPerfectSquare ? sqrtVal.toString() : t.sqrtNA,
    mono: true,
  });
  if (divs) {
    facts.push({ label: t.divisorCount, value: String(divs.length) });
    facts.push({
      label: t.divisors,
      value: divs.length <= 30 ? divs.join(", ") : divs.slice(0, 30).join(", ") + " …",
      mono: true,
    });
  }
  facts.push({ label: t.palindrome, value: isPalindrome(n) ? t.yes : t.no });
  facts.push({ label: t.fibonacci, value: isFibonacci(n) ? t.yes : t.no });
  facts.push({ label: t.triangular, value: isTriangular(n) ? t.yes : t.no });
  const fact = factorial(n);
  facts.push({ label: t.factorial, value: fact ? fact : t.factorialNA, mono: true });

  return {
    n,
    reading: numberToWords(n, lang),
    prime,
    roman,
    perfect,
    facts,
  };
}
