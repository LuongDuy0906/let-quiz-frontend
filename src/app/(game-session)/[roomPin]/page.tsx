'use client';

import { Lobby } from "@/component/game-session/lobby";
import { gameSessionService } from "@/features/game-session/game-session.service";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function WaitingRoomPageWithRoomPin() {
    const params = useParams();
    const roomPin = params.roomPin!.toString();
    
    const [isMounted, setIsMounted] = useState(false);
    const [loading, setLoading] = useState(true);

    const initRoom = async () => {
        setIsMounted(true);
        if (typeof window === 'undefined') return;

        try {
            const savedQuiz = sessionStorage.getItem(`room_quiz:${roomPin}`);

            if (roomPin && savedQuiz) {
                setLoading(false);
                return;
            }

            if (roomPin && !savedQuiz) {
                const data = await gameSessionService.getGameSession(roomPin);
                if (data?.quizInfo) {
                    sessionStorage.setItem(`room_quiz:${roomPin}`, JSON.stringify(data.quizInfo));
                }
                setLoading(false);
                return;
            }
            
        } catch (error) {
            console.log("Không tìm được thông tin phòng chơi", error); //
        } finally {
            setLoading(false); //
        }
    };

    useEffect(() => {
        initRoom();
    }, [roomPin]);

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
            <Lobby pin={roomPin}/>
        </div>
    );
}