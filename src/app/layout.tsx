import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Control de Pagos de Inquilino | SaaS Dashboard",
  description:
    "Gestión integral de alquiler mensual, prorrateo de servicios de luz (50%) y agua, y seguimiento de cobranza.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full bg-slate-50">
      <body className="min-h-full flex flex-col antialiased text-slate-800">
        {children}
      </body>
    </html>
  );
}
