import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '365 Truck Repair CRM',
  description: 'CRM dashboard for 365 Truck Repair and Peaty Tire',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
