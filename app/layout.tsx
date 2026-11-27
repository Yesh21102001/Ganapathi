import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnnouncementBar from "@/components/AnnouncementBar";
import { Inter, Marcellus } from "next/font/google";
import WhatsAppButton from "@/components/WhatsAppButton";
import MobileTabBar from "@/components/MobileTabBar";
import ScrollReveal from "@/components/ScrollReveal";
import EnquiryProvider from "@/components/EnquiryProvider";
import { getCollections, safe } from "@/lib/shopify";
import { buildNav, site } from "@/lib/site";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const marcellus = Marcellus({
  subsets: ["latin"],
  weight: "400", // Marcellus ships a single weight
  variable: "--font-marcellus",
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
      <body className={`${inter.variable} ${marcellus.variable} pb-16 font-sans antialiased md:pb-0`}>
        <EnquiryProvider>
          <AnnouncementBar messages={site.announcements} href={`https://wa.me/${site.whatsapp}`} />
          <Header nav={buildNav(new Map(collections.map((c) => [c.handle, c.title])))} />
          <main id="main">{children}</main>
          <Footer collections={collections} />
          <WhatsAppButton />
          <MobileTabBar />
          <ScrollReveal />
        </EnquiryProvider>
      </body>
    </html>
  );
}
