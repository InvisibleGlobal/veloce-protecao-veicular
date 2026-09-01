import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import "./refinement.css";

export const metadata: Metadata = {
  title: "Veloce | Central operacional",
  description: "Gestão operacional de proteção veicular.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{__html:'try{document.documentElement.dataset.theme=localStorage.getItem("veloce-theme")==="dark"?"dark":"light"}catch(e){}'}}/></head>
      <body>{children}</body>
    </html>
  );
}
