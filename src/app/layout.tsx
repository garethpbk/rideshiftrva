import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "./providers";
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
  metadataBase: new URL(process.env.NEXTAUTH_URL ?? "http://localhost:3000"),
  title: {
    default: "Ride Shift RVA",
    template: "%s | Ride Shift RVA",
  },
  description:
    "Move green, save green. Earn local rewards for car-free commuting in Richmond, VA.",
  applicationName: "Ride Shift RVA",
  openGraph: {
    title: "Ride Shift RVA",
    description:
      "Move green, save green. Earn local rewards for car-free commuting in Richmond, VA.",
    siteName: "Ride Shift RVA",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ride Shift RVA",
    description:
      "Move green, save green. Earn local rewards for car-free commuting in Richmond, VA.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#16a34a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
