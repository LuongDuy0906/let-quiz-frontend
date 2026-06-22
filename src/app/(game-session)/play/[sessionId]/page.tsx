'use client';

import { Lobby } from "@/component/game-session/lobby";
import { QuizPlayEngine } from "@/component/game-session/quiz-play-engine";
import { gameSessionService } from "@/features/game-session/game-session.service";
import { useUser } from "@/providers/user.provider";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useSocket } from "@/providers/socket.provider";

export default function WaitingRoomPageWithSessionId() {
    const params = useParams();
    const { user } = useUser();
    const sessionId = params.sessionId!.toString();
    const { socket, connectSocket } = useSocket();

    const [roomPin, setRoomPin] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [roomStatus, setRoomStatus] = useState<'WAITING' | 'PLAYING' | 'FINISHED'>('WAITING');
    const [playerList, setPlayerList] = useState<any[]>([]);
    const [isJoined, setIsJoined] = useState(false);
    
    const [gameSettings, setGameSettings] = useState({
        showLeaderboard: true,
        shuffleQuestions: false,
        shuffleOptions: false,
    });

    const initRoom = async () => {
        if (typeof window === 'undefined') return;
        const savedPin = sessionStorage.getItem(`room_pin:${sessionId}`);
        if (!savedPin) {
            toast.error("Khởi tạo phòng chơi thất bại");
        }
        setRoomPin(savedPin || '');
        setLoading(false);
    };

    useEffect(() => {
        initRoom();
    }, [sessionId]);

    useEffect(() => {
        if (!socket) return;

        socket.on("playerListUpdate", (data: any) => {
            if (data && data.playerList) {
                setPlayerList(data.playerList); 
            } else if (Array.isArray(data)) {
                setPlayerList(data);
            }
        });

        socket.on("gameStarted", () => {
            setRoomStatus('PLAYING');
        });

        socket.on("gameFinished", () => {
            setRoomStatus('FINISHED');
        });

        socket.on("error", (err: { message: string }) => {
            toast.error(err.message);
            setIsJoined(false);
        });

        return () => {
            socket.off("playerListUpdate");
            socket.off("gameStarted");
            socket.off("gameFinished");
            socket.off("error");
            socket.disconnect();
        };
    }, [socket]);

    const handleConfirmJoin = (nickname: string, avatarSeed: string, userId: string | null) => {
        const socketInstance = connectSocket(); 
        socketInstance.emit("joinRoom", {
            roomPin: roomPin,
            name: nickname,
            avatar: avatarSeed,
            userId: userId
        });
        setIsJoined(true);
    };

    const handleSettingsChange = (key: keyof typeof gameSettings) => {
        if (!sessionId) return;
        setGameSettings(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const handleStartGame = async () => {
        if (!sessionId) return;

        try {
            const settingsResult = await gameSessionService.updateGameSessionSetting(
                gameSettings.showLeaderboard,
                gameSettings.shuffleQuestions,
                gameSettings.shuffleOptions,
                roomPin
            );

            if (!settingsResult) return;

            const startResult = await gameSessionService.startGame(roomPin, sessionId);

            if (!startResult) return;

            toast.success("Khởi động trận đấu thành công!");
            sessionStorage.setItem(`shuffle_answers:${roomPin}`, String(gameSettings.shuffleOptions));
            
            setRoomStatus('PLAYING');

        } catch (error) {
            console.error("Lỗi hệ thống trong chuỗi bắt đầu game:", error);
        }
    };

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
                <a href="/" className="flex items-center h-full w-50">
                    <img src="/image/let_quiz_logo.png" className="h-20 w-full" alt="Let Quiz Logo" />
                </a>
            </div>
            
            {roomStatus === 'WAITING' && (
                <Lobby 
                    sessionId={sessionId} 
                    pin={roomPin}
                    playerList={playerList}
                    isJoined={isJoined}
                    gameSettings={gameSettings}
                    onConfirmJoin={handleConfirmJoin}
                    onSettingsChange={handleSettingsChange}
                    onStartGame={handleStartGame}
                />
            )}

            {roomStatus === 'PLAYING' && (
                <QuizPlayEngine roomPin={roomPin} sessionId={sessionId} />
            )}

            {roomStatus === 'FINISHED' && (
                <div className="text-white p-10">
                    <h2>Trận đấu kết thúc! Bảng xếp hạng chung cuộc</h2>
                </div>
            )}
        </div>
    );
}