
import type React from "react";
import type { Metadata } from "next/types";
import { Newsreader, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

// Load Newsreader font for headings and body text
const newsreader = Newsreader({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-newsreader",
  // Include both regular and italic styles
  style: ["normal", "italic"],
  // Include multiple weights
  weight: ["400", "500", "600", "700"],
});

// Make sure the Inter font is loaded with all the weights we need
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  // Include multiple weights for UI elements
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Carlos Nexans | Math, Computer Science & Technology",
  description: "Personal blog about math, computer science, and technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Add KaTeX CSS globally */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css"
          integrity="sha384-GvrOXuhMATgEsSwCs4smul74iXGOixntILdUW9XmUC6+HX0sLNAK3q71HotJqlAn"
          crossOrigin="anonymous"
        />
        {/* Add Prism CSS globally */}
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/themes/prism-tomorrow.min.css" />
        {/* Add Geist Mono font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Geist+Mono:wght@300;400;500;600&display=swap"
        />
      </head>
      <body className={cn("min-h-screen antialiased", newsreader.variable, inter.variable)}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
