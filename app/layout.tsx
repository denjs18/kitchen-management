import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import BottomNav from '@/components/BottomNav';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Mon Frigo',
  description: 'Gestion du garde-manger et recettes',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={`${inter.className} bg-gray-50 min-h-screen`}>
        <div className="pb-20">
          {children}
        </div>
        <BottomNav />
      </body>
    </html>
  );
}
