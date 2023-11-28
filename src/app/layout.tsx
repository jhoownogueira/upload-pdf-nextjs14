import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Repositório TCC",
  description: "Salve e visualize repositórios de TCCs",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <head>
        <link rel="icon" href="/favicon.svg" />
      </head>
      <html lang="pt-br">
        <body className={inter.className}>{children}</body>
      </html>
    </>
  );
}
