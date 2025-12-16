import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "QR Code Generator",
  description: "Free online QR code generator. Create custom QR codes with colors, download as SVG, PNG, or JPEG. No signup required.",
  keywords: ["qr code generator", "qr generator free", "create qr code online", "custom qr code", "qr code maker", "qr code download"],
  openGraph: {
    title: "Free QR Code Generator | Random Utility Apps",
    description: "Create custom QR codes with colors, download as SVG, PNG, or JPEG. Free and no signup required.",
  },
};

export default function QRGeneratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
