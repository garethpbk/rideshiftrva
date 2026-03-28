import type { Metadata, Viewport } from "next";
import { Urbanist, Figtree } from "next/font/google";
import { Providers } from "./providers";
import { SiteHeader } from "@/components/SiteHeader";
import "./globals.css";

const urbanist = Urbanist({
  variable: "--font-urbanist",
  subsets: ["latin"],
});

const figtree = Figtree({
  variable: "--font-figtree",
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
      className={`${urbanist.variable} ${figtree.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>
          <SiteHeader />
          <div className="flex-1">{children}</div>
          <footer className="px-4 py-8 text-center border-t border-zinc-100">
            <p className="font-semibold text-zinc-700">
              Built at the Richmond Civic Hackathon
            </p>
            <p className="mt-1 text-sm text-zinc-500">
              A real solution for real Richmonders — no car required.
            </p>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
