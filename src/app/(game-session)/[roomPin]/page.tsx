'use client';

import { Lobby } from "@/component/game-session/lobby";
import { QuizPlayEngine } from "@/component/game-session/quiz-play-engine";
import { gameSessionService } from "@/features/game-session/game-session.service";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
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
            const savedPlayerId = sessionStorage.getItem('playerId');
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

        // 1. Khi Socket thiết lập kết nối thành công với Server
        socket.on("connect", () => {
            const savedPlayerId = sessionStorage.getItem('currentPlayerId');
            const savedRoomPin = sessionStorage.getItem('roomPin');

            // Gửi yêu cầu reconnect kèm theo playerId cũ của mình lên hệ thống Backend
            if (savedPlayerId && savedRoomPin === roomPin) {
                socket.emit("reconnectToRoom", {
                    roomPin: roomPin,
                    playerId: savedPlayerId
                });
            }
        });

        // 🌟 2. LẮNG NGHE SỰ KIỆN RECONNECT THÀNH CÔNG TỪ BACKEND
        socket.on("reconnectSuccess", (data: { message: string, playerId: string, roomStatus: string }) => {
            toast.success(data.message);
            setIsJoined(true);

            // Cập nhật trạng thái giao diện Frontend khớp với trạng thái thực tế của phòng ở Backend
            if (data.roomStatus === 'PLAYING') {
                setRoomStatus('PLAYING');
            } else if (data.roomStatus === 'FINISHED') {
                setRoomStatus('FINISHED');
            } else {
                setRoomStatus('WAITING');
            }
        });

        // 3. Sự kiện cập nhật danh sách người chơi trong phòng chơi
        socket.on("playerListUpdate", (data: any) => {
            // Đảm bảo bóc tách đúng mảng dữ liệu dù Backend trả về dạng Object hay mảng thô
            const list = Array.isArray(data) ? data : (data.playerList || []);
            setPlayerList(list); 

            // Cập nhật hoặc lưu vết lại mã định danh để phòng hờ người dùng F5 bất ngờ
            if (data.currentPlayerId) {
                sessionStorage.setItem('currentPlayerId', data.currentPlayerId);
                sessionStorage.setItem('roomPin', roomPin);
            }
        });

        socket.on("roomSettingsChanged", (updatedSettings: any) => {
            setGameSettings(updatedSettings);
        });

        socket.on("gameStarted", (data: { shuffleAnswers: boolean }) => {
            sessionStorage.setItem(`shuffle_answers:${roomPin}`, String(data.shuffleAnswers));
            setRoomStatus('PLAYING');
        });

        socket.on("gameFinished", () => {
            setRoomStatus('FINISHED');
        });

        socket.on("error", (err: { message: string }) => {
            toast.error(err.message);
            setIsJoined(false);
            
            // Nếu xảy ra lỗi (Phòng đã sập hoàn toàn hoặc ID hết hạn), dọn dẹp session để nhập lại từ đầu
            sessionStorage.removeItem('playerId');
            sessionStorage.removeItem('roomPin');
        });

        return () => {
            socket.off("connect");
            socket.off("reconnectSuccess"); // 🌟 Hủy lắng nghe sự kiện khi unmount component
            socket.off("playerListUpdate");
            socket.off("roomSettingsChanged");
            socket.off("gameStarted");
            socket.off("gameFinished");
            socket.off("error");
            socket.disconnect();
        };
    }, [socket, roomPin]);

    // Hàm thực hiện gia nhập phòng thủ công bằng việc gõ tên truyền thống
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
        return;
    };

    const handleStartGame = async () => {
        return;
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
                <a href="/" className="flex items-center h-full w-sm">
                    <img src="/image/let_quiz_logo.png" className="h-20 w-md" alt="Let Quiz Logo" />
                </a>
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