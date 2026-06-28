'use client';

import { Lobby } from "@/component/game-session/lobby";
import { QuizPlayEngine } from "@/component/game-session/quiz-play-engine";
import { gameSessionService } from "@/features/game-session/game-session.service";
import { useUser } from "@/providers/user.provider";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useSocket } from "@/providers/socket.provider";
import { LogOut } from "lucide-react";

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

        socket.on("playerDisconnect", (data: { message: string }) => {
            toast.warn(data.message);
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
            socket.off("playerDisconnect");
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
            await gameSessionService.updateGameSessionSetting(
                gameSettings.showLeaderboard,
                gameSettings.shuffleQuestions,
                gameSettings.shuffleOptions,
                roomPin
            );

            const startResult = await gameSessionService.startGame(roomPin, sessionId);

            if (!startResult) return;

            toast.success("Khởi động trận đấu thành công!");
            sessionStorage.setItem(`shuffle_answers:${roomPin}`, String(gameSettings.shuffleOptions));
            
            setRoomStatus('PLAYING');

        } catch (error) {
            console.error("Lỗi hệ thống trong chuỗi bắt đầu game:", error);
        }
    };

    const handleLeaveRoom = () => {
        if (!socket) return;
        const confirmLeave = window.confirm("Bạn có chắc chắn muốn đóng phòng và thoát không?");
        if (confirmLeave) {
            socket.emit("leaveRoom");
            sessionStorage.removeItem('roomPin');
            window.location.href = "/";
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
            <div className="flex flex-none w-full h-20 md:h-24 bg-[#4E62A8]/87 px-4 md:px-10 shadow-[0_0_10px_rgba(0,0,0,1)] items-center justify-between md:justify-start gap-4 md:gap-6">
                <a href="/" className="flex items-center h-full w-auto max-w-37.5 md:max-w-none">
                    <img src="/image/let_quiz_logo.png" className="h-14 md:h-20 w-auto object-contain" alt="Let Quiz Logo" />
                </a>
                
                <button
                    onClick={handleLeaveRoom}
                    className="border-2 border-black bg-rose-500 hover:bg-rose-600 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-lg font-black uppercase text-xs md:text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-1.5 cursor-pointer animate-fade-in flex-none"
                >
                    <LogOut className="w-4 h-4" />
                    <span>Thoát phòng</span>
                </button>
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
                    onLeaveRoom={handleLeaveRoom}
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