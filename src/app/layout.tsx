import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Rishav Chakravarty | Data Analytics & Computational Social Science",
  description: "MS in DACSS @ UMass Amherst | Data Science | Psychology | Digital Strategy Consultant",
  keywords: ["data analytics", "computational social science", "data science", "psychology", "digital strategy"],
  authors: [{ name: "Rishav Chakravarty" }],
  creator: "Rishav Chakravarty",
  openGraph: {
    title: "Rishav Chakravarty - Data Analytics Portfolio",
    description: "Explore my journey in data analytics, computational social science, and digital innovation",
    url: "https://rishavchakra.github.io",
    siteName: "Rishav Chakravarty Portfolio",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
