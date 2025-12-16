import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Color Picker",
  description: "Free online color picker tool. Pick colors, save palettes, and export as CSS variables. Hex, RGB color codes with click-to-copy.",
  keywords: ["color picker", "hex color picker", "color palette generator", "color picker online", "css color picker", "rgb color picker", "color palette tool"],
  openGraph: {
    title: "Free Color Picker & Palette Tool | Random Utility Apps",
    description: "Pick colors, save palettes, export as CSS. Free online color picker tool.",
  },
};

export default function ColorPickerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
