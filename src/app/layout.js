import { ThemeProvider } from '@/context/ThemeContext';
import { UserProvider } from '@/context/UserContext';  // import your UserProvider
import './globals.css';
import Chatbot from '@/components/ChatBot';

export const metadata = {
  title: 'My Next.js App',
  description: 'With Dark Mode Toggle',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <UserProvider>
              <main >
                {children}
                <Chatbot/>
              </main>

          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
