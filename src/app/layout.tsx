import { Header } from '@/component/header';
import './globals.css';
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false

export const metadata = {
  title: 'Let Quiz',
  description: 'A simple Next.js application with a custom layout.',
};

export default function RootLayout({
  children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <head>
                <link rel="icon" href="image/let_quiz_logo.png" />
            </head>
            <body className="bg-[#E0E7FF]">
                <Header />
                {children}
            </body>
        </html>
    );
}