import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rishav Chakravarty | Data Analytics & Computational Social Science",
  description:
    "Portfolio of Rishav Chakravarty, focused on data analytics, computational social science, machine learning, behavioral analytics, and digital strategy.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-slate-950 text-white antialiased">
        {children}
      </body>
    </html>
  );
}