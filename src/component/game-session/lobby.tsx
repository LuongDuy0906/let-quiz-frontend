'use client'

import { Copy, Eye, Search, LogOut } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState } from "react";
import { PlayerJoinModal } from "./player-join-modal";

interface Player {
    _id: string;
    name: string;
    avatar: string;
}

interface LobbyProps {
    pin: string;
    sessionId?: string;
    playerList: Player[];
    isJoined: boolean;
    gameSettings: {
        showLeaderboard: boolean;
        shuffleQuestions: boolean;
        shuffleOptions: boolean;
    };
    onConfirmJoin: (nickname: string, avatarSeed: string) => void;
    onSettingsChange: (key: 'showLeaderboard' | 'shuffleQuestions' | 'shuffleOptions') => void;
    onStartGame: () => Promise<void>;
}

export const Lobby = ({ 
    sessionId, 
    pin, 
    playerList, 
    isJoined, 
    gameSettings, 
    onConfirmJoin, 
    onSettingsChange, 
    onStartGame,
}: LobbyProps) => {
    
    const [joinRoomUrl, setJoinRoomUrl] = useState('');
    const [isMounted, setIsMounted] = useState(false);
    const [quiz, setQuiz] = useState<any>();
    
    const [bgVolume, setBgVolume] = useState(50);
    const [fxVolume, setFxVolume] = useState(50);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setJoinRoomUrl(`${window.location.origin}/join/${pin}`);
        }
        setIsMounted(true);

        const quizData = sessionId
            ? sessionStorage.getItem(`room_quiz:${sessionId}`)
            : sessionStorage.getItem(`room_quiz:${pin}`);
        
        if (quizData) {
            setQuiz(JSON.parse(quizData));
        }
    }, [pin, sessionId]);

    return (
        <div className="flex flex-col lg:flex-row justify-center items-stretch gap-6 w-full max-w-6xl mx-auto px-4 py-6 select-none">
            {/* Left Card: Room joining details & active player list */}
            <div className="flex flex-col border-4 border-black rounded-2xl w-full lg:flex-1 bg-[#3B529A] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
                <div className="flex-none flex flex-col md:grid md:grid-cols-[200px_1fr_200px] w-full bg-[#2241AE] p-6 md:p-4 gap-6 md:gap-4 border-b-4 border-black items-center">
                    <div className="flex flex-col text-center font-bold text-white gap-3 w-full">
                        <p className="text-sm md:text-base font-black uppercase tracking-wider">Tham gia tại</p>
                        <img src="/image/let_quiz_logo.png" alt="Let Quiz" className="h-12 md:h-16 w-auto object-contain mx-auto"/>
                    </div>
                    <div className="flex flex-col items-center gap-4 w-full">
                        <div className="text-white text-base md:text-lg font-black uppercase tracking-widest">
                            <p>Mã PIN</p>
                        </div>
                        <div className="text-4xl md:text-5xl text-yellow-300">
                            {isMounted && pin && pin.length === 6 ? 
                                <p className="flex gap-3 md:gap-4 font-black tracking-wider [text-shadow:2px_2px_0_#000]">
                                    <span>{pin.slice(0, 3)}</span>
                                    <span>{pin.slice(3, 6)}</span>
                                </p>
                                : 
                                <p className="font-black">------</p>
                            }
                        </div>
                        <div className="flex flex-row gap-6 md:gap-8 text-white font-bold text-sm md:text-base">
                            <p className="cursor-pointer hover:text-yellow-300 transition-colors flex items-center gap-1.5"><Copy size={16} className="inline"/> Sao chép</p>
                            <p className="cursor-pointer hover:text-yellow-300 transition-colors flex items-center gap-1.5"><Eye size={16} className="inline"/> Ẩn</p>
                        </div>
                    </div>
                    <div className="flex justify-center items-center w-full">
                        <QRCodeSVG 
                            value={joinRoomUrl} 
                            size={110}
                            bgColor={"#ffffff"}
                            fgColor={"#000000"}
                            level={"L"}
                            className="border-4 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-1.5 bg-white"
                        />
                    </div>
                </div>

                <div className="flex flex-col justify-center items-center bg-[#516BC4] w-full flex-1">
                    <div className="w-full h-72 md:h-96 p-6 overflow-y-auto border-b-4 border-black bg-black/10">
                        {!playerList || playerList.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full w-full text-white">
                                <div className="text-lg font-bold flex flex-row justify-center items-center gap-1 w-full text-center">
                                    <span>Đang chờ người tham gia</span>
                                    <span className="flex flex-row items-center gap-1 ml-1 pt-2">
                                        <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                        <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                        <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"></span>
                                    </span>
                                </div>
                                <p className="text-xs text-gray-200 mt-2 text-center">Hãy chia sẻ mã PIN hoặc mã QR để mọi người cùng vào</p>
                            </div>
                        ) : (
                            <div className="flex flex-wrap gap-3 md:gap-4 justify-start items-start w-full">
                                {playerList.map((player) => (
                                    <div 
                                        key={player._id} 
                                        className="bg-amber-400 text-slate-900 font-black px-4 py-2 rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_#000] flex items-center gap-3 animate-fade-in text-sm md:text-base"
                                    >
                                        <div className="w-7 h-7 md:w-8 md:h-8 bg-white border border-black rounded-full overflow-hidden p-0.5 flex-none">
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
                    <div className="flex w-full justify-center items-center p-6 md:p-8 bg-[#2241AE]/40">
                        {sessionId ? (
                            <button 
                                onClick={onStartGame}
                                className="border-4 border-black rounded-full w-full max-w-xs h-14 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25),inset_0px_-8px_4px_0px_rgba(0,0,0,0.25)] text-xl font-black text-black bg-[#AAFB6C] hover:bg-[#C6FF9A] active:shadow-[none] active:bg-[#D1F8B3] active:translate-y-[0.5] transition-all duration-300 cursor-pointer uppercase tracking-wider"
                            >
                                Bắt đầu thôi
                            </button>
                        ) : (
                            <button className="flex flex-row items-center justify-center gap-2 border-4 border-black rounded-full w-full max-w-xs h-14 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25),inset_0px_-8px_4px_0px_rgba(0,0,0,0.25)] text-lg md:text-xl font-bold text-white bg-black uppercase tracking-wider">
                                <span>Chờ chủ phòng</span>
                                <span className="flex flex-row items-center gap-1 ml-1 pt-2">
                                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"></span>
                                </span>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Right Card: Quiz metadata & settings */}
            <div className="flex flex-col w-full lg:w-96 border-4 border-black rounded-2xl bg-[#3B529A] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden flex-none">
                <div className="flex flex-row flex-none bg-[#2241AE] p-4 gap-3 border-b-4 border-black items-center">
                    <div className="w-24 h-24 flex-none border-2 border-black rounded-lg overflow-hidden bg-white/10">
                        <img src={quiz?.image || "/placeholder-quiz.png"} alt="Quiz Cover" className="h-full w-full object-cover"/>
                    </div>
                    <div className="flex-1 flex flex-col min-w-0">
                        <p className="text-white font-black text-lg md:text-xl line-clamp-2 leading-snug [text-shadow:1px_1px_0_#000]">{quiz?.title}</p>
                        <div className="flex flex-row justify-between w-full text-white font-bold items-center mt-2">
                            <p className="bg-purple-700 px-2 py-0.5 border border-black rounded-md text-xs">{quiz?.totalQuestions || 0} câu hỏi</p>
                            <a href="#" className="flex text-white gap-1 items-center text-xs hover:underline"><Search size={14} /> <span>Xem trước</span></a>
                        </div>
                    </div>
                </div>

                <div className="flex-1 flex flex-col bg-[#516BC4] p-4 gap-4">
                    <div className="text-white">
                        <h3 className="text-lg md:text-xl font-black uppercase tracking-wider [text-shadow:1.5px_1.5px_0_#000]">Âm lượng</h3>
                        <div className="flex flex-col w-full gap-3 mt-3">
                            <div className="flex flex-row gap-4 justify-between items-center">
                                <label className="text-sm md:text-base font-bold flex-none">Âm nền: </label>
                                <input type="range" min={0} max={100} value={bgVolume} onChange={(e) => setBgVolume(Number(e.target.value))} className="w-full accent-black cursor-pointer max-w-37.5 md:max-w-none flex-1" />
                            </div>
                            <div className="flex flex-row gap-4 justify-between items-center">
                                <label className="text-sm md:text-base font-bold flex-none">Hiệu ứng: </label>
                                <input type="range" min={0} max={100} value={fxVolume} onChange={(e) => setFxVolume(Number(e.target.value))} className="w-full accent-black cursor-pointer max-w-37.5 md:max-w-none flex-1" />
                            </div>
                        </div>
                    </div>

                    {sessionId && (
                        <div className="text-white border-t-2 border-black/25 pt-4">
                            <h3 className="text-lg md:text-xl font-black uppercase tracking-wider [text-shadow:1.5px_1.5px_0_#000]">Cấu hình</h3>
                            <div className="flex flex-col w-full gap-3 mt-3">
                                <div className="flex items-center gap-3">
                                    <input 
                                        type="checkbox" 
                                        id="showLeaderboard"
                                        checked={gameSettings.showLeaderboard}
                                        disabled={!sessionId}
                                        onChange={() => onSettingsChange('showLeaderboard')}
                                        className="w-5 h-5 cursor-pointer accent-black rounded border-2 border-black"
                                    />
                                    <label htmlFor="showLeaderboard" className="text-sm md:text-base font-bold cursor-pointer select-none">Hiển thị bảng xếp hạng</label>
                                </div>
                                <div className="flex items-center gap-3">
                                    <input 
                                        type="checkbox" 
                                        id="shuffleQuestions"
                                        checked={gameSettings.shuffleQuestions}
                                        disabled={!sessionId}
                                        onChange={() => onSettingsChange('shuffleQuestions')}
                                        className="w-5 h-5 cursor-pointer accent-black rounded border-2 border-black"
                                    />
                                    <label htmlFor="shuffleQuestions" className="text-sm md:text-base font-bold cursor-pointer select-none">Tráo đổi vị trí câu hỏi</label>
                                </div>
                                <div className="flex items-center gap-3">
                                    <input 
                                        type="checkbox" 
                                        id="shuffleOptions"
                                        checked={gameSettings.shuffleOptions}
                                        disabled={!sessionId}
                                        onChange={() => onSettingsChange('shuffleOptions')}
                                        className="w-5 h-5 cursor-pointer accent-black rounded border-2 border-black"
                                    />
                                    <label htmlFor="shuffleOptions" className="text-sm md:text-base font-bold cursor-pointer select-none">Tráo đổi vị trí đáp án</label>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {!isJoined && <PlayerJoinModal onConfirm={onConfirmJoin} />}
        </div>
    );
};