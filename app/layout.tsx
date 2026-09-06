import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
  title: 'La peña del Buggati · Quiniela',
  icons: { icon: { url: './favicon.svg?v=2', type: 'image/svg+xml' } },
  description: 'Bote común, turnos y estadísticas de nuestra peña de quiniela.',
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
