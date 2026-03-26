import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DÜNYA KUPASI 2014 — Spor Gazetesi",
  description: "FIFA World Cup 2014 Brazil - Haberler, Maç Sonuçları, Analizler",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className="bg-[#131313] min-h-screen text-white">
        {children}
      </body>
    </html>
  );
}
