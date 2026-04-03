import { Header } from '@/component/header';
import './globals.css';

export const metadata = {
  title: 'My Next.js App',
  description: 'A simple Next.js application with a custom layout.',
};

export default function RootLayout({
  children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className="bg-[#E0E7FF]">
                <Header />
                {children}
            </body>
        </html>
    );
}