import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Stadium Eats - Premium In-Seat Food Delivery',
  description: 'Never miss a moment of the game while enjoying your favorite stadium food. Premium in-seat delivery service for sports stadiums.',
  keywords: 'stadium food, food delivery, sports stadium, in-seat delivery, stadium eats',
  authors: [{ name: 'Stadium Eats' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  openGraph: {
    title: 'Stadium Eats - Premium In-Seat Food Delivery',
    description: 'Never miss a moment of the game while enjoying your favorite stadium food.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Stadium Eats - Premium In-Seat Food Delivery',
    description: 'Never miss a moment of the game while enjoying your favorite stadium food.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <Navigation />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
