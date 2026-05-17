import { PageTransition } from "components/animations/page-transition";
import { CartProvider } from "components/cart/cart-context";
import { EditorialFooter } from "components/layout/editorial-footer";
import { EditorialNavbar } from "components/layout/editorial-navbar";
import { WelcomeToast } from "components/welcome-toast";
import { Bodoni_Moda, JetBrains_Mono } from "next/font/google";
import { getCart } from "lib/shopify";
import { ReactNode } from "react";
import { Toaster } from "sonner";
import "./globals.css";
import { baseUrl } from "lib/utils";

const bodoniModa = Bodoni_Moda({
  subsets: ['latin'],
  variable: '--font-bodoni-moda',
  weight: ['400', '500', '700'],
  style: ['normal', 'italic'],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  weight: ['400', '500', '600'],
});

const { SITE_NAME } = process.env;

export const metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: SITE_NAME!,
    template: `%s | ${SITE_NAME}`,
  },
  description: 'Premium aftermarket carbon fiber and performance automotive parts. By Car Enthusiasts. For Car Enthusiasts.',
  robots: {
    follow: true,
    index: true,
  },
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const cart = getCart();

  return (
    <html lang="en" className={`${bodoniModa.variable} ${jetbrainsMono.variable}`}>
      <body>
        <CartProvider cartPromise={cart}>
          <EditorialNavbar />
          <main>
            <PageTransition>
              {children}
            </PageTransition>
            <EditorialFooter />
            <Toaster closeButton />
            <WelcomeToast />
          </main>
        </CartProvider>
      </body>
    </html>
  );
}
