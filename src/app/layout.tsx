import type { Metadata } from "next";
import { Montserrat, Lato, Libre_Baskerville } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Toaster from "@/components/Toaster";
import Script from "next/script";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
});

const libreBaskerville = Libre_Baskerville({
  variable: "--font-libre-baskerville",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.tupsicoana.com";
const ogImage = `${siteUrl}/og-image.jpg`;
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "MedicalBusiness",
  name: "Tu Psico Ana",
  url: siteUrl,
  image: ogImage,
  description: "Servicios de apoyo psicológico y acompañamiento profesional en línea.",
  areaServed: "LatAm",
  serviceType: "Apoyo psicológico y acompañamiento",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Acompañamiento Psicológico Online | Apoyo Emocional | Tu Psico Ana",
    template: "%s | Tu Psico Ana"
  },
  description: "Acompañamiento psicológico online profesional, coaching emocional y apoyo en manejo de emociones. Agenda tu sesión de acompañamiento psicológico.",
  keywords: ["acompañamiento psicológico", "apoyo psicológico", "psicólogo online", "coaching emocional", "apoyo emocional", "salud mental", "manejo de emociones", "psicólogo en línea", "consulta psicológica"],

  category: "health",
  applicationName: "Tu Psico Ana",
  openGraph: {
    type: "website",
    siteName: "Tu Psico Ana",
    locale: "es_ES",
    url: siteUrl,
    title: "Acompañamiento Psicológico Online | Apoyo Emocional",
    description: "Acompañamiento psicológico, coaching emocional y apoyo psicológico profesional en línea",
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: "Acompañamiento Psicológico y Apoyo Emocional",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Acompañamiento Psicológico Online | Tu Psico Ana",
    description: "Acompañamiento psicológico profesional y coaching emocional",
    images: [ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  verification: {
    google: "ujmZl8LTd5ljPAzptZKPQ0Ri8g6xL5-0T1FB0tk4rSY",
  },
  alternates: {
    canonical: siteUrl,
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning={true}>
      <head>
        {/* Google Tag Manager */}
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-K9V937TH');`,
          }}
        />
        {/* End Google Tag Manager */}
      </head>
      <body
        className={`${montserrat.variable} ${lato.variable} ${libreBaskerville.variable} antialiased flex flex-col min-h-screen`}
      >
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-K9V937TH"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Toaster />
        <Header />
        <main className="flex-grow flex flex-col">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
