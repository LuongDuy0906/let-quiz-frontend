'use client';

import { Lobby } from "@/component/game-session/lobby";
import { gameSessionService } from "@/features/game-session/game-session.service";
import { useUser } from "@/providers/user.provider";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function WaitingRoomPageWithSessionId() {
    const params = useParams();
    const {user} = useUser();
    const sessionId = params.sessionId!.toString();

    const [roomPin, setRoomPin] = useState<string>('');
    const [isMounted, setIsMounted] = useState(false);
    const [loading, setLoading] = useState(true);

    const initRoom = async () => {
        setIsMounted(true);
        if (typeof window === 'undefined') return;

        const savedPin = sessionStorage.getItem(`room_pin:${sessionId}`);

        if(!savedPin){
            toast.error("Khởi tạo phòng chơi thất bại")
        }
        
        setRoomPin(savedPin);
        setLoading(false);
    };

    useEffect(() => {
        initRoom();
    }, [sessionId]);

    if (loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-[#452E80] text-white font-bold">
                Đang tải thông tin phòng chơi...
            </div>
        );
    }
    
    return (
        <div className="flex flex-col h-screen gap-6">
            <div className="flex flex-none w-full h-24 bg-[#4E62A8]/87 px-10 shadow-[0_0_10px_rgba(0,0,0,1)]">
                <a href="/" className="flex items-center h-full w-sm"><img src="/image/let_quiz_logo.png" className="h-20 w-md" alt="Let Quiz Logo" /></a>
            </div>
            <Lobby sessionId={sessionId} pin={roomPin}/>
        </div>
    );
}