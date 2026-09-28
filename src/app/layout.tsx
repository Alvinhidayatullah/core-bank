import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CoreBanking System',
  description: 'Modern Core Banking Simulation Web App with Glassmorphism',
  icons: {
    icon: '/logos/bi.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased text-slate-200">
        {children}
      </body>
    </html>
  );
}
