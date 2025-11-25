import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Covenant',
  description: 'Covenant Communications - High-speed satellite internet service',
  icons: {
    icon: '/favicon/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
