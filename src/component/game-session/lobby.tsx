'use client'

import { Copy, Eye, Search } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState } from "react";
import { useSocket } from "@/providers/socket.provider";
import { PlayerJoinModal } from "./player-join-modal";

interface LobbyProps {
    pin: string;

    sessionId?: string;
}

interface Player {
    _id: string;
    name: string;
    avatar: string;
}

export const Lobby = ({ sessionId, pin }: LobbyProps) => {
    const { socket, connectSocket } = useSocket();
    
    const [joinRoomUrl, setJoinRoomUrl] = useState('');
    const [playerList, setPlayerList] = useState<Player[]>([]);
    const [isMounted, setIsMounted] = useState(false);
    const [quiz, setQuiz] = useState<any>();
    
    const [isJoined, setIsJoined] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setJoinRoomUrl(`${window.location.origin}/play/${pin}`);
        }
        setIsMounted(true);

        let quizData;

        if(sessionId){
            quizData = sessionStorage.getItem(`room_quiz:${sessionId}`);
        } else {
            quizData = sessionStorage.getItem(`room_quiz:${pin}`);
        }
        
        if (quizData) {
            setQuiz(JSON.parse(quizData));
        }
    }, [pin]);

    const handleConfirmJoin = (nickname: string, avatarSeed: string, userId: string | null) => {
        const socketInstance = connectSocket(); 

        socketInstance.emit("joinRoom", {
            roomPin: pin,
            name: nickname,
            avatar: avatarSeed,
            userId: userId
        });

        setIsJoined(true);
    };

    useEffect(() => {
        if (!socket) return;
        socket.on("playerListUpdate", (updatedPlayers: Player[]) => {
            setPlayerList(updatedPlayers);
        });

        console.log(playerList)

        socket.on("error", (err: { message: string }) => {
            alert(err.message);
            setIsJoined(false);
        });

        return () => {
            socket.off("playerListUpdate");
            socket.off("error");
        };
    }, [socket]);

    return (
        <div className="flex flex-row justify-center items-center gap-6 pt-10">
            <div className="flex flex-col border border-black rounded-xl w-4xl h-auto">
                <div className="flex-none grid grid-cols-[200px_1fr_170px] w-full bg-[#2241AE] p-2 rounded-t-xl">
                    <div className="flex flex-col text-center font-bold text-white gap-5">
                        <p>Tham gia tại</p>
                        <img src="/image/let_quiz_logo.png" alt="" className="h-20 w-md"/>
                    </div>
                    <div className="flex flex-col items-center gap-6">
                        <div className="text-white text-xl font-medium">
                            <p>Mã PIN</p>
                        </div>
                        <div className="text-4xl text-green-400">
                            {isMounted && pin && pin.length === 6 ? 
                                <p className="flex gap-4 font-bold">
                                    <span>{pin.slice(0, 3)}</span>
                                    <span>{pin.slice(3, 6)}</span>
                                </p>
                                : 
                                <p>------</p>
                            }
                        </div>
                        <div className="flex flex-row gap-10 text-white font-medium">
                            <p><Copy className="inline cursor-pointer"/> Sao chép</p>
                            <p><Eye className="inline cursor-pointer"/> Ẩn</p>
                        </div>
                    </div>
                    <div className="flex justify-center items-center">
                        <QRCodeSVG 
                            value={joinRoomUrl} 
                            size={128}
                            bgColor={"#ffffff"}
                            fgColor={"#000000"}
                            level={"L"}
                            className="border-10 border-white rounded-xl"
                        />
                    </div>
                </div>

                <div className="flex flex-col justify-center items-center bg-[#516BC4] w-full rounded-b-xl">
                    <div className="flex-none justify-between items-center w-full h-96 p-6 overflow-y-auto">
                        { !playerList || playerList.length === 0 ? (
                            <div className="flex flex-col items-center justify-center flex-1 text-white h-full w-full">
                                <div className="text-lg font-bold flex flex-row justify-center items-center gap-1 w-full">
                                    <span>Đang chờ người tham gia</span>
                                    <span className="flex flex-row items-center gap-1 ml-1 pt-2">
                                        <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                        <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                        <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"></span>
                                    </span>
                                </div>
                                <p className="text-xs text-gray-200 mt-2">Hãy chia sẻ mã PIN hoặc mã QR để mọi người cùng vào</p>
                            </div>
                        ) : (
                            <div className="flex flex-wrap gap-4 justify-start items-start w-full">
                                {playerList.map((player) => (
                                    <div 
                                        key={player._id} 
                                        className="bg-amber-400 text-slate-900 font-black px-4 py-2 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_#000] flex items-center gap-3 animate-fade-in"
                                    >
                                        <div className="w-8 h-8 bg-white border border-black rounded-full overflow-hidden p-0.5 flex-none">
                                            <img 
                                                src={`https://api.dicebear.com/7.x/bottts/svg?seed=${player.avatar}`} 
                                                alt="" 
                                                className="w-full h-full"
                                            />
                                        </div>
                                        <span>{player.name}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="flex flex-1 w-full justify-center items-center p-10">
                        {
                            sessionId ? 
                                <button className="border-4 border-black rounded-full w-60 h-14 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25),inset_0px_-8px_4px_0px_rgba(0,0,0,0.25)] text-xl font-bold text-black bg-[#AAFB6C] hover:bg-[#C6FF9A] active:shadow-[none] active:bg-[#D1F8B3] active:translate-y-[0.5] transition-all duration-300 cursor-pointer">
                                    Bắt đầu thôi
                                </button>
                            : 
                                <button className="flex flex-row items-center justify-center gap-2 border-4 border-black rounded-full w-xs h-14 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25),inset_0px_-8px_4px_0px_rgba(0,0,0,0.25)] text-xl font-bold text-white bg-black">
                                    <span>Chờ chủ phòng bắt đầu</span>
                                    <span className="flex flex-row items-center gap-1 ml-1 pt-2">
                                        <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                        <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                        <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"></span>
                                    </span>
                                </button>
                        }
                        
                    </div>
                </div>
            </div>

            <div className="flex flex-col w-lg h-full border border-black rounded-xl overflow-hidden shadow-sm">
                <div className="flex flex-row flex-none bg-[#2241AE] p-2 rounded-t-xl gap-3">
                    <div className="flex-1">
                        <img src={quiz?.image || "/placeholder-quiz.png"} alt="" className="h-35 rounded-xl object-cover w-full"/>
                    </div>
                    <div className="flex-1 flex flex-col gap-5">
                        <p className="text-white font-medium text-2xl line-clamp-2">{quiz?.title}</p>
                        <div className="flex flex-row justify-between w-full text-white font-medium items-center mt-auto pb-2">
                            <p className="bg-purple-700 px-3 py-1 rounded-lg text-sm">{quiz?.totalQuestions || 0} Câu hỏi</p>
                            <a href="#" className="flex text-white gap-1 items-center text-sm hover:underline"><Search size={16} /> <span>Xem trước</span></a>
                        </div>
                    </div>
                </div>
                {
                    sessionId ? 
                        <div className="flex-1 flex flex-col bg-[#516BC4] min-h-50">
                            <div className="p-4 text-white">
                                <h3 className="text-xl font-medium [text-shadow:-2px_-2px_0_#000,2px_-2px_0_#000,-2px_2px_0_#000,2px_2px_0_#000]">Âm lượng</h3>
                                <div className="flex flex-col w-full gap-2">
                                    <div className="flex flex-row gap-15 mt-5">
                                        <label className="text-lg font-normal flex-none" htmlFor="">Âm lượng nền: </label>
                                        <input type="range" min={0} max={100} name="" id="" className="w-full accent-black cursor-pointer flex-1"/>
                                    </div>
                                    <div className="flex flex-row gap-6">
                                        <label className="text-lg font-normal flex-none" htmlFor="">Hiệu ứng âm thanh: </label>
                                        <input type="range" min={0} max={100} name="" id="" className="w-full accent-black cursor-pointer flex-1"/>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 text-white">
                                <h3 className="text-xl font-medium [text-shadow:-2px_-2px_0_#000,2px_-2px_0_#000,-2px_2px_0_#000,2px_2px_0_#000]">Phòng chơi</h3>
                                <div className="flex flex-col w-full justify-between">
                                    <div className="flex flex-row gap-5 mt-5 items-center">
                                        <input type="checkbox" className="w-5 h-5"/>
                                        <label htmlFor="" className="text-xl font-normal">Hiện thị bảng xếp hạng</label>
                                    </div>
                                    <div className="flex flex-row gap-5 mt-5 items-center">
                                        <input type="checkbox" className="w-5 h-5"/>
                                        <label htmlFor="" className="text-xl font-normal">Tráo đổi vị trí câu hỏi</label>
                                    </div>
                                    <div className="flex flex-row gap-5 mt-5 items-center">
                                        <input type="checkbox" className="w-5 h-5"/>
                                        <label htmlFor="" className="text-xl font-normal">Tráo đổi vị trí đáp án</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    :
                        <div className="flex-1 flex flex-col bg-[#516BC4] min-h-50">
                            <div className="p-4 text-white">
                                <h3 className="text-xl font-medium [text-shadow:-2px_-2px_0_#000,2px_-2px_0_#000,-2px_2px_0_#000,2px_2px_0_#000]">Âm lượng</h3>
                                <div className="flex flex-col w-full gap-2">
                                    <div className="flex flex-row gap-15 mt-5">
                                        <label className="text-lg font-normal flex-none" htmlFor="">Âm lượng nền: </label>
                                        <input type="range" min={0} max={100} name="" id="" className="w-full accent-black cursor-pointer flex-1"/>
                                    </div>
                                    <div className="flex flex-row gap-6">
                                        <label className="text-lg font-normal flex-none" htmlFor="">Hiệu ứng âm thanh: </label>
                                        <input type="range" min={0} max={100} name="" id="" className="w-full accent-black cursor-pointer flex-1"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                }
            </div>

            {!isJoined && <PlayerJoinModal onConfirm={handleConfirmJoin} />}
        </div>
    );
}