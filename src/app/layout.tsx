import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { ToastContainer } from "@/components/ui/Toast";

export const metadata: Metadata = {
  title: {
    default: "Pixel",
    template: "%s | Pixel",
  },
  description: "Profesyonel web sitenizi dakikalar icinde olusturun.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
        <ToastContainer />
      </body>
    </html>
  );
}
