import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { OrganizationSchema } from "@/components/seo/OrganizationSchema";
import { WebSiteSchema } from "@/components/seo/WebSiteSchema";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Tremp — Modern clothing",
    template: "%s — Tremp",
  },
  description: "Discover contemporary clothing and essentials.",
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <OrganizationSchema
          name="Tremp"
          url="https://tremp.example.com"
          description="Discover contemporary clothing and essentials."
          logo="https://tremp.example.com/logo.png"
          contactPoint={{
            contactType: "customer service",
            availableLanguage: "English",
          }}
        />
        <WebSiteSchema
          name="Tremp"
          url="https://tremp.example.com"
          description="Discover contemporary clothing and essentials."
          searchUrl="https://tremp.example.com/search?q={search_term}"
        />
      </head>
      <body className="flex min-h-full flex-col">
        <Providers>
          <AnnouncementBar />
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartDrawer />
          {modal}
        </Providers>
      </body>
    </html>
  );
}
