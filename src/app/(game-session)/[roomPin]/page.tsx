'use client';

import { Lobby } from "@/component/game-session/lobby";
import { QuizPlayEngine } from "@/component/game-session/quiz-play-engine";
import { gameSessionService } from "@/features/game-session/game-session.service";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { LogOut } from "lucide-react";
import { useSocket } from "@/providers/socket.provider";

export default function WaitingRoomPageWithRoomPin() {
    const params = useParams();
    const roomPin = params.roomPin!.toString();
    const { socket, connectSocket } = useSocket();
    
    const [isMounted, setIsMounted] = useState(false);
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
        setIsMounted(true);
        if (typeof window === 'undefined') return;

        try {
            const savedPlayerId = sessionStorage.getItem('currentPlayerId');
            const savedRoomPin = sessionStorage.getItem('roomPin');

            // Nếu phát hiện có thông tin cũ của đúng phòng này, chủ động mở kết nối Socket
            if (savedPlayerId && savedRoomPin === roomPin) {
                setIsJoined(true); // Bật trạng thái đã join để ẩn form nhập Nickname
                connectSocket();   
            }

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
            console.log("Không tìm được thông tin phòng chơi", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        initRoom();
    }, [roomPin]);

    useEffect(() => {
        if (!socket) return;

        socket.on("connect", () => {
            const savedPlayerId = sessionStorage.getItem('currentPlayerId');
            const savedRoomPin = sessionStorage.getItem('roomPin');

            if (savedPlayerId && savedRoomPin === roomPin) {
                socket.emit("reconnectToRoom", {
                    roomPin: roomPin,
                    playerId: savedPlayerId
                });
            }
        });

        socket.on("reconnectSuccess", (data: { message: string, playerId: string, roomStatus: string }) => {
            toast.success(data.message);
            setIsJoined(true);

            if (data.roomStatus === 'PLAYING') {
                setRoomStatus('PLAYING');
            } else if (data.roomStatus === 'FINISHED') {
                setRoomStatus('FINISHED');
            } else {
                setRoomStatus('WAITING');
            }
        });

        socket.on("playerListUpdate", (data: any) => {
            const list = Array.isArray(data) ? data : (data.playerList || []);
            setPlayerList(list); 

            if (data.currentPlayerId) {
                sessionStorage.setItem('currentPlayerId', data.currentPlayerId);
                sessionStorage.setItem('roomPin', roomPin);
            }
        });

        socket.on("roomSettingsChanged", (updatedSettings: any) => {
            setGameSettings(updatedSettings);
        });

        socket.on("playerDisconnect", (data: { message: string }) => {
            toast.warn(data.message);
        });

        socket.on("roomClosed", (data: { message: string }) => {
            toast.warn(data.message || "Phòng chơi đã bị đóng bởi Giáo viên.");
            sessionStorage.removeItem('currentPlayerId');
            sessionStorage.removeItem('roomPin');
            setTimeout(() => {
                window.location.href = "/";
            }, 2000);
        });

        socket.on("gameStarted", (data: { shuffleAnswers: boolean }) => {
            sessionStorage.setItem(`shuffle_answers:${roomPin}`, String(data.shuffleAnswers));
            setRoomStatus('PLAYING');
        });

        socket.on("playerLeaved", (data: { message: string }) => {
            toast.warn(data.message);
        });

        socket.on("gameFinished", () => {
            setRoomStatus('FINISHED');
        });

        socket.on("error", (err: { message: string }) => {
            toast.error(err.message);
            setIsJoined(false);

            sessionStorage.removeItem('currentPlayerId');
            sessionStorage.removeItem('roomPin');
        });

        return () => {
            socket.off("connect");
            socket.off("reconnectSuccess");
            socket.off("playerListUpdate");
            socket.off("roomSettingsChanged");
            socket.off("playerDisconnect");
            socket.off("playerLeaved")
            socket.off("roomClosed");
            socket.off("gameStarted");
            socket.off("gameFinished");
            socket.off("error");
            socket.disconnect();
        };
    }, [socket, roomPin]);

    const handleConfirmJoin = (nickname: string, avatarSeed: string) => {
        const socketInstance = connectSocket(); 
        socketInstance.emit("joinRoom", {
            roomPin: roomPin,
            name: nickname,
            avatar: avatarSeed,
        });
        setIsJoined(true);
    };

    const handleSettingsChange = (key: keyof typeof gameSettings) => {
        return;
    };

    const handleStartGame = async () => {
        return;
    };

    const handleLeaveRoom = () => {
        if (!socket) return;
        const confirmLeave = window.confirm("Bạn có chắc chắn muốn rời khỏi phòng chơi không?");
        if (confirmLeave) {
            socket.emit("leaveRoom");
            sessionStorage.removeItem('currentPlayerId');
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
                
                {isJoined && (
                    <button
                        onClick={handleLeaveRoom}
                        className="border-2 border-black bg-rose-500 hover:bg-rose-600 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-lg font-black uppercase text-xs md:text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-1.5 cursor-pointer flex-none"
                    >
                        <LogOut className="w-4 h-4" />
                        <span>Thoát phòng</span>
                    </button>
                )}
            </div>
            
            {roomStatus === 'WAITING' && (
                <Lobby 
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
                <QuizPlayEngine roomPin={roomPin} />
            )}

            {roomStatus === 'FINISHED' && (
                <div className="text-white p-10">
                    <h2>Trận đấu kết thúc! Xem thứ hạng của bạn</h2>
                </div>
            )}
        </div>
    );
}