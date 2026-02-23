import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '3PL Valuation Tool | Fulfill',
  icons: { icon: '/favicon.ico' },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Inject public env vars at runtime for Webflow Cloud compatibility.
  // Webflow Cloud only provides env vars at runtime, not build time,
  // so NEXT_PUBLIC_* vars won't be inlined into the client bundle.
  const publicEnv = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_CALENDAR_URL: process.env.NEXT_PUBLIC_CALENDAR_URL,
  };

  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.__ENV__=${JSON.stringify(publicEnv)}`,
          }}
        />
      </head>
      <body>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          {children}
        </div>
      </body>
    </html>
  );
}
