import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "COSTECH@40 Summit",
    template: "%s | COSTECH@40",
  },
  description: "From Legacy to Future: COSTECH@40 and the road towards Tanzania Vision 2050.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    type: "website",
    siteName: "COSTECH@40 Summit",
    title: "COSTECH@40 Summit — From Legacy to Future",
    description: "28–30 October 2026 · JNICC, Dar es Salaam",
    images: [{ url: "/og.png", width: 1730, height: 909, alt: "COSTECH@40 Summit — From Legacy to Future" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "COSTECH@40 Summit — From Legacy to Future",
    description: "28–30 October 2026 · JNICC, Dar es Salaam",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
