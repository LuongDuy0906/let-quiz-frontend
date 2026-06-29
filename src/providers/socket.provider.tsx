'use client'

import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface SocketContextType {
    socket: Socket | null;
    connectSocket: () => Socket;
    disconnectSocket: () => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
    const [socket, setSocket] = useState<Socket | null>(null);

    const connectSocket = () => {
        if (socket && socket.connected) {
            return socket;
        }

        const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

        console.log("Đang tiến hành thiết lập kết nối Socket mới...");
        const socketInstance = io('http://localhost:4000', {
            transports: ['websocket'],
            autoConnect: false,
            auth: {
                token: token
            }
        });

        socketInstance.connect();
        
        setSocket(socketInstance); 
        
        return socketInstance;
    };

    const disconnectSocket = () => {
        if (socket) {
            socket.disconnect();
            setSocket(null);
        }
    };

    useEffect(() => {
        return () => { socket?.disconnect(); };
    }, [socket]);

    return (
        <SocketContext.Provider value={{ socket, connectSocket, disconnectSocket }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) throw new Error('useSocket phải được đặt trong SocketProvider');
    return context;
};