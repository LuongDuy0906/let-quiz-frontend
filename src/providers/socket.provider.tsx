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
        // Kiểm tra xem đã có kết nối hoạt động chưa, nếu có rồi thì dùng lại luôn
        if (socket && socket.connected) {
            return socket;
        }

        console.log("🔌 Đang tiến hành thiết lập kết nối Socket mới...");
        // Thay URL này bằng đúng cổng chạy server NestJS của bạn
        const socketInstance = io('http://localhost:4000', {
            transports: ['websocket'],
            autoConnect: false 
        });

        socketInstance.connect();
        
        // Lưu vào state để các component khác lắng nghe sự thay đổi
        setSocket(socketInstance); 
        
        // TRẢ VỀ TRỰC TIẾP thực thể vừa tạo để dùng ngay lập tức, tránh bị chậm state
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