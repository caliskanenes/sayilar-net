import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "sayilar.net",
  description: "Sayı analiz ve sesli okuma motoru",
  metadataBase: new URL("https://sayilar.net"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
