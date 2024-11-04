import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider"
import { JetBrains_Mono } from "next/font/google";

const jbm = JetBrains_Mono({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: "Random Utility(?) Apps",
  description: "By Shreyas Deb",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={jbm.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          forcedTheme="dark"
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
