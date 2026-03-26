import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "World Cup 2014",
  description: "FIFA World Cup 2014 Brazil - Interactive Chart & Match Results",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className="bg-gray-900 min-h-screen">
        {children}
      </body>
    </html>
  );
}
