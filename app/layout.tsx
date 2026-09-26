import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'TriageOps',
  description: 'Incident triage and root cause engine',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#070709] text-zinc-100 antialiased">
        {children}
      </body>
    </html>
  );
}