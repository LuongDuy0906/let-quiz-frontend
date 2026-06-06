import { Header } from '@/component/header';
import './globals.css';
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import { UserProvider } from '@/providers/user.provider';
import { ToastContainer } from 'react-toastify';
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
            <body className="">
                <UserProvider>
                    <Header />
                    {children}
                    <ToastContainer 
                        position="top-right" 
                        autoClose={3000} 
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                        theme="colored"
                    />
                </UserProvider>
            </body>
        </html>
    );
}