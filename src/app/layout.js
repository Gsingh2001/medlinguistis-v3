import { ThemeProvider } from '@/context/ThemeContext';
import { UserProvider } from '@/context/UserContext';
import './globals.css';
import Chatbot from '@/components/ChatBot';

export const metadata = {
  title: 'Medlinguitis – AI for Patient Narrative Insight',
  description: 'An AI-driven platform transforming patient narratives into clinically actionable insights.',
  keywords: 'AI, NLP, patient data, healthcare, mental health, sentiment analysis, chatbot',
  authors: [{ name: 'Medlinguitis Team', url: 'https://medlinguitis.com' }],
  creator: 'Medlinguitis Team',
  metadataBase: new URL('https://medlinguitis.com'),
  openGraph: {
    title: 'Medlinguitis – AI for Patient Narrative Insight',
    description: 'Explore powerful NLP and AI tools for analyzing patient narratives.',
    url: 'https://medlinguitis.com',
    siteName: 'Medlinguitis',
    images: [
      {
        url: '/images/dark.png',
        width: 1200,
        height: 630,
        alt: 'Medlinguitis Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Medlinguitis – AI for Patient Narrative Insight',
    description: 'An AI-driven system transforming patient stories into actionable data.',
    creator: '@medlinguitis',
    images: ['/images/dark.png'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Logo and favicon */}
        <link rel="icon" href="/images/dark.png" type="image/png" />
        <link rel="apple-touch-icon" href="/images/dark.png" />
        <meta name="theme-color" content="#1976d2" />
      </head>
      <body>
        <ThemeProvider>
          <UserProvider>
            <main>
              {children}
              <Chatbot />
            </main>
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
