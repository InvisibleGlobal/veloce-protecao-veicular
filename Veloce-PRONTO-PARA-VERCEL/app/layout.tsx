import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Veloce | Central Operacional",
  description: "Central operacional Veloce para eventos, associados, rede, documentos e rotinas.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body>{children}</body></html>;
}
