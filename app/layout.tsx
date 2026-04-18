import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "RefineSplit — Create Invoices in 30 Seconds",
  description:
    "Create professional invoices instantly without signup. Share via WhatsApp, download as PDF. Built for freelancers and small businesses.",
  keywords: ["invoice generator", "free invoice", "freelancer invoice", "GST invoice India"],
  openGraph: {
    title: "RefineSplit — Create Invoices in 30 Seconds",
    description: "No signup. No friction. Create and share invoices via WhatsApp instantly.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="min-h-screen font-sans antialiased bg-white dark:bg-[#0a0f1e]">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange={false}
        >
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
