import './globals.css';
import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import { Navbar } from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'] });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk' });

export const metadata: Metadata = {
  title: 'RenderLab - Rendering Performance Observatory',
  description: 'Interactive benchmarking environment for analyzing CSR and Edge rendering strategies in modern web systems. A research-grade observatory for modern web performance.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  keywords: ['rendering', 'performance', 'benchmark', 'CSR', 'Edge', 'web performance', 'observatory'],
  openGraph: {
    title: 'RenderLab - Rendering Performance Observatory',
    description: 'Interactive benchmarking environment for evaluating CSR and Edge rendering strategies in modern web systems.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} ${spaceGrotesk.variable} bg-background text-foreground`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
