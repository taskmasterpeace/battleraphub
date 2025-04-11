import { Geist, Inter } from "next/font/google";
import { ThemeProvider } from "@/components/layout/theme-provider";
import Header from "@/components/layout/Header";
import "./globals.css";
import { AuthProvider } from "@/contexts/auth.context";
const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Battle Rap Algorithm",
  description: "Rate and analyze battle rap performances",
};

const inter = Inter({ subsets: ["latin"] });

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <body className={`${inter.className} bg-gray-950 text-white min-h-screen pb-16 md:pb-0`}>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="dark">
            <Header />
            <main className="min-h-screen pt-16">{children}</main>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
