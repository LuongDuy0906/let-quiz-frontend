'use client';

import { Lobby } from "@/component/game-session/lobby";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function WaitingRoomPage() {
    const params = useParams();
    const sessionId = params.sessionId!.toString();

    const [roomPin, setRoomPin] = useState<string>('');
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        
        const savedPin = sessionStorage.getItem(`room_pin:${sessionId}`);
        if (savedPin) {
            setRoomPin(savedPin);
        }
    }, [sessionId]);
    
    return (
        <div className="flex flex-col h-screen gap-6">
            <div className="flex flex-none w-full h-24 bg-[#4E62A8]/87 px-10 shadow-[0_0_10px_rgba(0,0,0,1)]">
                <a href="/" className="flex items-center h-full w-sm"><img src="/image/let_quiz_logo.png" className="h-20 w-md" alt="Let Quiz Logo" /></a>
            </div>
            <Lobby sessionId={sessionId} pin={roomPin}/>
        </div>
    );
}