import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TradeEvidence",
  description: "Evidence-based trading intelligence for self-directed traders.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
