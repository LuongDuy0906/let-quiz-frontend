'use client'

import { useEffect, useState } from "react";
import { useSocket } from "@/providers/socket.provider";
import { Award, Clock, Users, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "react-toastify";

interface QuizPlayEngineProps {
    roomPin: string;
    sessionId?: string;
}

export const QuizPlayEngine = ({ roomPin, sessionId }: QuizPlayEngineProps) => {
    const { socket } = useSocket();

    const [gameState, setGameState] = useState<'COUNTDOWN' | 'PLAYING' | 'TIMEOUT' | 'LEADERBOARD' | 'ENDED'>('COUNTDOWN');
    const [countdownSec, setCountdownSec] = useState<number>(3);
    const [timer, setTimer] = useState<number>(0);
    
    const [question, setQuestion] = useState<any>(null);
    const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(null);
    const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
    
    const [answeredStats, setAnsweredStats] = useState({ answeredCount: 0, totalPlayers: 0 });
    const [leaderboard, setLeaderboard] = useState<any[]>([]);

    useEffect(() => {
        if (!socket) return;

        socket.on("countdown", (data: { second: number }) => {
            setGameState('COUNTDOWN');
            setCountdownSec(data.second);
            setSelectedAnswerId(null);
            setHasSubmitted(false);
        });

        socket.on("questionRecived", (data: any) => {
            setGameState('PLAYING');
            setQuestion(data);
            setTimer(data.duration);
            setSelectedAnswerId(null);
            setHasSubmitted(false);
        });

        socket.on("timerTick", (data: { remaining: number }) => {
            setTimer(data.remaining);
        });

        socket.on("playerAnsweredUpdate", (data: { answeredCount: number; totalPlayers: number }) => {
            setAnsweredStats(data);
        });

        socket.on("timeout", (data: { message: string }) => {
            setGameState('TIMEOUT');
        });

        socket.on("liveLeaderboard", (data: any[]) => {
            setGameState('LEADERBOARD');
            setLeaderboard(data);
        });

        socket.on("questionFinishedWithoutLeaderboard", () => {
            setGameState('TIMEOUT');
        });

        socket.on("gameEnded", (data: { message: string }) => {
            setGameState('ENDED');
            toast.info(data.message);
        });

        return () => {
            socket.off("countdown");
            socket.off("questionRecived");
            socket.off("timerTick");
            socket.off("playerAnsweredUpdate");
            socket.off("timeout");
            socket.off("liveLeaderboard");
            socket.off("questionFinishedWithoutLeaderboard");
            socket.off("gameEnded");
        };
    }, [socket]);

    const handleSubmitAnswer = (answerId: string) => {
        if (hasSubmitted || gameState !== 'PLAYING') return;

        setSelectedAnswerId(answerId);
        setHasSubmitted(true);

        const scoreBase = timer * 50; 
        const calculatedScore = scoreBase > 1000 ? 1000 : scoreBase < 0 ? 0 : scoreBase;

        socket.emit("submitAnswer", {
            questionId: question?.questionId,
            answerId: answerId,
            score: calculatedScore
        });
    };

    if (gameState === 'COUNTDOWN') {
        return (
            <div className="flex flex-col flex-1 justify-center items-center h-[calc(100vh-120px)] w-full">
                <div className="text-center animate-pulse">
                    <h2 className="text-3xl font-black text-white uppercase tracking-widest mb-6 [text-shadow:2px_2px_0_#000]">
                        Sẵn sàng câu tiếp theo
                    </h2>
                    <div className="w-40 h-40 rounded-full bg-amber-400 border-8 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center text-7xl font-black text-black">
                        {countdownSec}
                    </div>
                </div>
            </div>
        );
    }

    if (gameState === 'LEADERBOARD') {
        return (
            <div className="flex flex-col flex-1 items-center p-6 w-full max-w-2xl mx-auto h-[calc(100vh-120px)] overflow-y-auto">
                <div className="flex items-center gap-3 mb-6">
                    <Award className="w-10 h-10 text-yellow-400" />
                    <h2 className="text-3xl font-black text-white uppercase tracking-wider [text-shadow:2px_2px_0_#000]">
                        Bảng Xếp Hạng Tạm Thời
                    </h2>
                </div>
                <div className="w-full flex flex-col gap-3 bg-[#3B529A] p-6 rounded-2xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                    {leaderboard.map((player, index) => (
                        <div 
                            key={player._id || index}
                            className={`flex items-center justify-between p-3 rounded-xl border-2 border-black font-bold text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] ${
                                index === 0 ? 'bg-amber-400 scale-105' : index === 1 ? 'bg-slate-300' : index === 2 ? 'bg-amber-600 text-white' : 'bg-white'
                            }`}
                        >
                            <div className="flex items-center gap-4">
                                <span className="text-xl font-black">#{index + 1}</span>
                                <div className="w-8 h-8 rounded-full bg-slate-100 border border-black overflow-hidden">
                                    <img src={`https://api.dicebear.com/7.x/bottts/svg?seed=${player.avatar}`} alt="" className="w-full h-full" />
                                </div>
                                <span className="text-lg">{player.name}</span>
                            </div>
                            <span className="font-black tracking-wide">{player.score} Điểm</span>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (gameState === 'ENDED') {
        return (
            <div className="flex flex-col flex-1 justify-center items-center h-[calc(100vh-120px)] w-full">
                <div className="text-center p-8 bg-[#3B529A] border-4 border-black rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-w-md">
                    <Award className="w-24 h-24 text-yellow-400 mx-auto mb-4 animate-bounce" />
                    <h2 className="text-4xl font-black text-white uppercase tracking-wider mb-2 [text-shadow:2px_2px_0_#000]">
                        Hạ Màn!
                    </h2>
                    <p className="text-xl font-bold text-green-300 mb-6">Trò chơi đã kết thúc thành công</p>
                    <a href="/" className="inline-block border-4 border-black bg-amber-400 text-black px-8 py-3 rounded-full text-lg font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform active:translate-y-0">
                        Quay Về Trang Chủ
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col flex-1 w-full max-w-5xl mx-auto p-4 gap-6 select-none">
            <div className="grid grid-cols-3 w-full bg-[#2241AE] p-4 rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-white font-black text-lg">
                <div className="flex items-center gap-2 justify-start">
                    <span className="bg-purple-700 px-4 py-1 border-2 border-black rounded-lg">
                        Câu hỏi: {question?.currentQuestionIndex} / {question?.totalQuestions}
                    </span>
                </div>
                <div className="flex items-center gap-2 justify-center">
                    <div className="flex items-center gap-2 bg-black/40 px-4 py-1 rounded-full border border-white/20 text-yellow-400">
                        <Clock className="w-5 h-5 animate-spin" />
                        <span>Còn lại: {timer}s</span>
                    </div>
                </div>
                <div className="flex items-center gap-2 justify-end">
                    <div className="flex items-center gap-2 bg-emerald-600 px-4 py-1 border-2 border-black rounded-lg">
                        <Users className="w-5 h-5" />
                        <span>Đã nộp: {answeredStats.answeredCount} / {answeredStats.totalPlayers}</span>
                    </div>
                </div>
            </div>

            <div className="flex flex-col flex-1 bg-[#3B529A] rounded-2xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-8 min-h-[220px] justify-center items-center text-center relative overflow-hidden">
                <h3 className="text-3xl font-black text-white max-w-3xl leading-snug [text-shadow:2px_2px_0_#000]">
                    {question?.title}
                </h3>
                
                {gameState === 'TIMEOUT' && (
                    <div className="absolute inset-0 bg-black/70 flex flex-col justify-center items-center z-10 animate-fade-in">
                        <div className="text-red-400 font-black text-5xl uppercase tracking-wider mb-2 [text-shadow:3px_3px_0_#000]">
                            Hết Giờ!
                        </div>
                        <p className="text-gray-300 font-bold text-lg">Đang tính toán kết quả phòng đấu...</p>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-2 gap-4 w-full pb-6">
                {question?.options?.map((opt: any, index: number) => {
                    const colors = [
                        'bg-red-500 hover:bg-red-600 text-white',
                        'bg-blue-500 hover:bg-blue-600 text-white',
                        'bg-amber-500 hover:bg-amber-600 text-black',
                        'bg-emerald-500 hover:bg-emerald-600 text-white'
                    ];
                    const selectedColor = colors[index % colors.length];
                    const isCurrentSelected = selectedAnswerId === opt._id;

                    return (
                        <button
                            key={opt._id}
                            disabled={hasSubmitted || gameState !== 'PLAYING'}
                            onClick={() => handleSubmitAnswer(opt.id)}
                            className={`w-full h-24 rounded-2xl border-4 border-black font-black text-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center px-6 relative cursor-pointer group text-left ${selectedColor} ${
                                hasSubmitted && !isCurrentSelected ? 'opacity-40 scale-95 cursor-not-allowed' : ''
                            } ${isCurrentSelected ? 'ring-4 ring-white border-white -translate-y-1 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]' : 'active:translate-y-1 active:shadow-none'}`}
                        >
                            <span className="w-10 h-10 rounded-xl bg-black/20 flex items-center justify-center text-2xl font-black mr-4 border border-black/10">
                                {String.fromCharCode(65 + index)}
                            </span>
                            <span className="flex-1 line-clamp-2 pr-8">{opt.text}</span>
                            
                            {isCurrentSelected && (
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 bg-white text-black p-1 rounded-full border-2 border-black animate-bounce">
                                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};