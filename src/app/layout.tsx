import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["200", "300"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Elite Health Club — Premium Wellness & Fitness Destination",
  description:
    "Discover world-class fitness, Olympic-sized pools, luxury resort suites, and expert coaching at Elite Health Club. Elevate your wellness journey today.",
  openGraph: {
    title: "Elite Health Club — Premium Wellness & Fitness Destination",
    description:
      "World-class fitness meets resort-style luxury. Pool, gym, tennis, badminton, and luxury suites — all in one destination.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${poppins.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
