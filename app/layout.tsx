import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ToastProvider } from "@/components/ui/Toast";
import { Inter, JetBrains_Mono } from "next/font/google";

const GA_TRACKING_ID = "G-JVLX6K4ZVC";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const viewport: Viewport = {
  themeColor: "#0f0f0f",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "Random Utility Apps - Free Online Tools",
    template: "%s | Random Utility Apps",
  },
  description: "Free online utility tools collection: QR Generator, SGPA Calculator, Dictionary, Currency Converter, Color Picker, Weather App, Markdown Editor, and PDF Merger. No signup required.",
  keywords: [
    "free online tools",
    "utility apps",
    "qr code generator",
    "qr generator online free",
    "sgpa calculator",
    "gpa calculator",
    "online dictionary",
    "word lookup",
    "currency converter",
    "exchange rate calculator",
    "color picker",
    "hex color picker",
    "weather app",
    "weather forecast",
    "markdown editor",
    "markdown preview",
    "pdf merger",
    "combine pdf online",
    "free tools no signup",
  ],
  authors: [{ name: "Shreyas Deb", url: "https://github.com/shrey715" }],
  creator: "Shreyas Deb",
  publisher: "Shreyas Deb",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Random Utility Apps",
    title: "Random Utility Apps - Free Online Tools",
    description: "Free online utility tools: QR Generator, SGPA Calculator, Dictionary, Currency Converter, Color Picker, Weather, Markdown Editor, PDF Merger.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Random Utility Apps - Free Online Tools",
    description: "Free online utility tools: QR Generator, SGPA Calculator, Dictionary, Currency Converter, and more.",
    creator: "@shrey715",
  },
  alternates: {
    canonical: "/",
  },
  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/icon.png" type="image/png" />
        <meta name="google-site-verification" content="" />
        {/* Google Analytics */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}');
          `}
        </Script>
      </head>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          forcedTheme="dark"
          disableTransitionOnChange
        >
          <ToastProvider>
            {children}
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
