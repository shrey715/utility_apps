import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Currency Converter",
  description: "Free currency converter with real-time exchange rates. Convert between 150+ currencies instantly. No signup required.",
  keywords: ["currency converter", "exchange rate calculator", "money converter", "forex calculator", "convert currency online", "usd to inr", "eur to usd"],
  openGraph: {
    title: "Free Currency Converter | Random Utility Apps",
    description: "Convert between 150+ currencies with real-time exchange rates. Free and instant.",
  },
};

export default function CurrencyConverterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
