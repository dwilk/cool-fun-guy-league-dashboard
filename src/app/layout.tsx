import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cool Fun Guy League",
  description: "Dynasty Fantasy Football League Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-dynasty-bg antialiased">
        {children}
      </body>
    </html>
  );
}



