'use client'

import { SocketProvider } from '@/providers/socket.provider';
import './globals.css';
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import { ToastContainer } from 'react-toastify';
config.autoAddCss = false

export default function PlayLayout({
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
                <SocketProvider>
                    {children}
                    <ToastContainer 
                    position="top-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="colored"
                    />
                </SocketProvider>
            </body>
        </html>
    );
}