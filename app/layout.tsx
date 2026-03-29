import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Noto_Sans_Devanagari, Eczar, Yatra_One, Tiro_Devanagari_Sanskrit, Martel } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { Analytics } from "@vercel/analytics/next"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoSansDevanagari = Noto_Sans_Devanagari({
  variable: "--font-noto-sans-devanagari",
  subsets: ["devanagari"],
  weight: ["400", "500", "600", "700"],
});

const eczar = Eczar({
  variable: "--font-eczar",
  subsets: ["latin", "devanagari"],
  weight: ["400", "500", "600", "700", "800"],
});

const yatraOne = Yatra_One({
  variable: "--font-yatra-one",
  subsets: ["devanagari"],
  weight: "400",
});

const tiroDevanagariSanskrit = Tiro_Devanagari_Sanskrit({
  variable: "--font-tiro-devanagari-sanskrit",
  subsets: ["devanagari"],
  weight: "400",
});

const martel = Martel({
  variable: "--font-martel",
  subsets: ["devanagari"],
  weight: ["400", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "DIET Newsletter Generator | Dnyanshree Institute of Engineering and Technology",
  description: "Official newsletter generator for Dnyanshree Institute of Engineering and Technology, Satara",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${notoSansDevanagari.variable} ${eczar.variable} ${yatraOne.variable} ${tiroDevanagariSanskrit.variable} ${martel.variable} h-full antialiased`}
    >
      <body className={`${geistSans.className} min-h-full bg-background text-foreground`}>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
          <Analytics/>
        </div>
      </body>
    </html>
  );
}
