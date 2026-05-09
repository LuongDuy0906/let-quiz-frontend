import { Header } from '@/component/editor/header';
import './globals.css';
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import { UserProvider } from '@/providers/user.provider';
import { Children } from 'react';
config.autoAddCss = false

export const metadata = {
  title: 'Let Quiz',
  description: 'A simple Next.js application with a custom layout.',
};

export default function EditorLayout({
  children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <head>
                <link rel="icon" href="image/let_quiz_logo.png" />
            </head>
            <body className="bg-[#4E62A8]/87 flex flex-col min-h-screen">
                <UserProvider>
                    <Header />
                    <main className='flex flex-1 flex-col'>
                        {children}
                    </main>
                </UserProvider>
            </body>
        </html>
    );
}