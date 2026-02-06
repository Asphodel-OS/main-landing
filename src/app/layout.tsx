import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Asphodel Studios | Hyper-Object",
  description: "A scroll-driven 3D experience for Asphodel Studios",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
