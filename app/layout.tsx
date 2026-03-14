import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL || "http://localhost:3000"),
  title: {
    default: "AtoZ Movies – Movies, Web Series & Reviews",
    template: "%s | AtoZ Movies",
  },
  description:
    "AtoZ Movies is the ultimate destination for Bollywood, Hollywood, South Hindi Dubbed movies and web series. Reviews, ratings, trailers and more.",
  keywords: [
    "movies",
    "bollywood",
    "hollywood",
    "web series",
    "reviews",
    "hindi dubbed",
  ],
  openGraph: {
    type: "website",
    siteName: "AtoZ Movies",
    locale: "en_US",
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Source+Sans+3:wght@300;400;600;700&display=swap"
          rel="stylesheet"
        />

        {/* Google Tag (gtag.js) */}
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID || 'G-KQKT2E0W2C'}`}
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GA_ID || 'G-KQKT2E0W2C'}');
            `,
          }}
        />

        {/* Google AdSense Auto Ads */}
        <script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT || 'ca-pub-2610891548777436'}`}
          crossOrigin="anonymous"
        ></script>
      </head>
      <body className="bg-[#f4f4f5] dark:bg-[#0a0a0a] text-[#111] dark:text-white antialiased transition-colors duration-200">
        <Providers>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "#111",
                color: "#fff",
                border: "1px solid #222",
              },
              success: { iconTheme: { primary: "#e50914", secondary: "#fff" } },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
