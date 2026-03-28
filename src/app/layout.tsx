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
    default: "RideShift RVA",
    template: "%s | RideShift RVA",
  },
  description:
    "Move green, save green. Earn local rewards for car-free commuting in Richmond, VA.",
  applicationName: "RideShift RVA",
  openGraph: {
    title: "RideShift RVA",
    description:
      "Move green, save green. Earn local rewards for car-free commuting in Richmond, VA.",
    siteName: "RideShift RVA",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "RideShift RVA",
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
            <div className="mx-auto max-w-xl">
              <p className="font-semibold text-zinc-700">
                Built at <a href="https://rvahacks.org" target="_blank" rel="noopener noreferrer" className="text-green-600 underline underline-offset-2 hover:text-green-700">Hack for RVA</a>
              </p>
              <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
                Cities thrive when people move through them intentionally. Our platform connects eco-conscious commuters with local businesses — turning every bus ride, bike share, and carpool into a stepping stone toward exclusive weekly rewards.
              </p>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
