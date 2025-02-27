import { ClientLayout } from "@/components/layouts/client-layout";
// import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";


export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <title>UBT-Onay</title>
        <meta name="description" content="The best way to evaluate" />

      </head>
      <body>
        <ClientLayout>{children}</ClientLayout>
        <Toaster />
      </body>
    </html>
  );
}

