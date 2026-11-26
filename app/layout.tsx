import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Inter, Cormorant_Garamond } from "next/font/google";
import WhatsAppButton from "@/components/WhatsAppButton";
import MobileTabBar from "@/components/MobileTabBar";
import EnquiryProvider from "@/components/EnquiryProvider";
import { getCollections, safe } from "@/lib/shopify";
import { buildNav, site } from "@/lib/site";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-cormorant",
});

export const metadata: Metadata = {
  title: { default: site.name, template: `%s | ${site.name}` },
  description:
    "Clothing and home textiles for the whole family: sarees, ethnic wear, kids wear, bedsheets and bath towels.",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const collections = await safe(getCollections(), []);

  return (
    <html lang="en">
      <body className={`${inter.variable} ${cormorant.variable} pb-16 font-sans antialiased md:pb-0`}>
        <EnquiryProvider>
          {site.offer && (
            <div className="bg-[#2A1A14] px-4 py-2 text-center text-xs text-[#FBF7F1]">
              {site.offer}
            </div>
          )}
          <Header nav={buildNav(collections)} />
          <main id="main">{children}</main>
          <Footer collections={collections} />
          <WhatsAppButton />
          <MobileTabBar />
        </EnquiryProvider>
      </body>
    </html>
  );
}
