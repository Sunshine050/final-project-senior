import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EMS 1669 - Emergency Care System",
  description: "ระบบบริหารจัดการการแพทย์ฉุกเฉิน",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

