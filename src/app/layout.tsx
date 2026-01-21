import type { Metadata } from "next";
import { Montserrat, Lato, Libre_Baskerville } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Toaster from "@/components/Toaster";

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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://tupsicoana.com";
const ogImage = `${siteUrl}/og-image.jpg`;
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "MedicalBusiness",
  name: "Tu Psico Ana",
  url: siteUrl,
  image: ogImage,
  description: "Servicios de apoyo psicológico y terapia profesional en línea.",
  areaServed: "LatAm",
  serviceType: "Apoyo psicológico y terapia",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Terapia Individual Online | Acompañamiento Psicológico | Tu Psico Ana",
    template: "%s | Tu Psico Ana",
  },
  description: "Terapia individual online. Acompañamiento psicológico profesional, coaching emocional y apoyo en manejo de emociones. Agenda tu sesión de terapia psicológica.",
  keywords: ["terapia individual", "terapia psicológica", "psicólogo online", "acompañamiento psicológico", "coaching emocional", "apoyo emocional", "salud mental", "manejo de emociones", "psicólogo en línea", "consulta psicológica"],
  category: "health",
  applicationName: "Tu Psico Ana",
  viewport: "width=device-width, initial-scale=1",
  openGraph: {
    type: "website",
    siteName: "Tu Psico Ana",
    locale: "es_ES",
    url: siteUrl,
    title: "Terapia Individual Online | Acompañamiento Psicológico",
    description: "Terapia individual, coaching emocional y apoyo psicológico profesional en línea",
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: "Terapia Individual y Acompañamiento Psicológico",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Terapia Individual Online | Tu Psico Ana",
    description: "Acompañamiento psicológico profesional, terapia y coaching emocional",
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
  alternates: {
    canonical: siteUrl,
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning={true}>
      <body
        className={`${montserrat.variable} ${lato.variable} ${libreBaskerville.variable} antialiased flex flex-col min-h-screen`}
      >
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
