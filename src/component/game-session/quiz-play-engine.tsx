'use client'

import { useEffect, useState } from "react";
import { useSocket } from "@/providers/socket.provider";
import { Award, Clock, Users, CheckCircle2, XCircle, LogOut } from "lucide-react";
import { toast } from "react-toastify";
import { apiFetch, handleApiResponse } from "@/lib/api";

interface QuizPlayEngineProps {
    roomPin: string;
    sessionId?: string;
}

export const QuizPlayEngine = ({ roomPin, sessionId }: QuizPlayEngineProps) => {
    const { socket } = useSocket();

    const [gameState, setGameState] = useState<'COUNTDOWN' | 'PLAYING' | 'TIMEOUT' | 'LEADERBOARD' | 'FINAL_LEADERBOARD' | 'SUMMARY' | 'ENDED'>('COUNTDOWN');
    const [countdownSec, setCountdownSec] = useState<number>(3);
    const [timer, setTimer] = useState<number>(0);
    const [summaryData, setSummaryData] = useState<any>(null);

    const [question, setQuestion] = useState<any>(null);
    const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(null);
    const [selectedAnswerIds, setSelectedAnswerIds] = useState<string[]>([]);
    const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);

    const [answeredStats, setAnsweredStats] = useState({ answeredCount: 0, totalPlayers: 0 });
    const [leaderboard, setLeaderboard] = useState<any[]>([]);
    const [correctOptionIds, setCorrectOptionIds] = useState<string[]>([]);
    const [isAnswerRevealed, setIsAnswerRevealed] = useState<boolean>(false);
    const [quizQuestions, setQuizQuestions] = useState<any[]>([]);

    useEffect(() => {
        if (!socket) return;

        socket.on("countdown", (data: { second: number }) => {
            setGameState('COUNTDOWN');
            setCountdownSec(data.second);
            setSelectedAnswerId(null);
            setSelectedAnswerIds([]);
            setHasSubmitted(false);
            setCorrectOptionIds([]);
            setIsAnswerRevealed(false);
        });

        socket.on("questionRecived", (data: any) => {
            setGameState('PLAYING');
            setQuestion(data);
            setTimer(data.duration);
            setSelectedAnswerId(null);
            setSelectedAnswerIds([]);
            setHasSubmitted(false);
            setCorrectOptionIds([]);
            setIsAnswerRevealed(false);
        });

        socket.on("timerTick", (data: { remaining: number }) => {
            setTimer(data.remaining);
        });

        socket.on("playerAnsweredUpdate", (data: { answeredCount: number; totalPlayers: number }) => {
            setAnsweredStats(data);
        });

        socket.on("revealAnswer", (data: { correctOptionIds: string[] }) => {
            setCorrectOptionIds(data.correctOptionIds);
            setIsAnswerRevealed(true);
        });

        socket.on("liveLeaderboard", (data: any[]) => {
            setGameState('LEADERBOARD');
            setLeaderboard(data);
        });

        socket.on("finalLeaderboard", (data: any[]) => {
            setGameState('FINAL_LEADERBOARD');
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
            socket.off("revealAnswer");
            socket.off("liveLeaderboard");
            socket.off("finalLeaderboard");
            socket.off("questionFinishedWithoutLeaderboard");
            socket.off("gameEnded");
        };
    }, [socket]);

    const handleOptionClick = (answerId: string) => {
        if (hasSubmitted || gameState !== 'PLAYING') return;

        if (question?.questionType === 'multiple') {
            setSelectedAnswerIds(prev =>
                prev.includes(answerId)
                    ? prev.filter(id => id !== answerId)
                    : [...prev, answerId]
            );
        } else {
            setSelectedAnswerId(answerId);
            handleSubmitAnswer(answerId);
        }
    };

    const handleSubmitAnswer = (answerIdStr: string) => {
        if (hasSubmitted || gameState !== 'PLAYING') return;

        setHasSubmitted(true);

        socket.emit("submitAnswer", {
            questionId: question?.questionId,
            answerId: answerIdStr,
        });
    };

    const handleExitToHome = () => {
        if (!socket) {
            window.location.href = "/";
            return;
        }

        if (sessionId) {
            socket.emit("gameEnded");
            sessionStorage.removeItem('roomPin');
            window.location.href = "/";
        } else {
            sessionStorage.removeItem('currentPlayerId');
            sessionStorage.removeItem('roomPin');
            window.location.href = "/";
        }
    };

    const handleFetchSummary = async () => {
        try {
            const summaryRes = await apiFetch(`/player-record/${roomPin}`);
            const summaryDataResult = await handleApiResponse(summaryRes);
            setSummaryData(summaryDataResult || {});

            const quizRes = await apiFetch(`/game-session/get-game-session-and-room-pin/${roomPin}`);
            const quizDataResult = await handleApiResponse(quizRes);
            const fullQuestions = quizDataResult?.quizInfo?.questions || [];
            setQuizQuestions(fullQuestions);

            if (quizDataResult?.quizInfo) {
                const storageKey = sessionId ? `room_quiz:${sessionId}` : `room_quiz:${roomPin}`;
                sessionStorage.setItem(storageKey, JSON.stringify(quizDataResult.quizInfo));
            }

            setGameState('SUMMARY');
        } catch (e: any) {
            console.error('Lấy thông tin tổng kết thất bại', e.message);
            toast.error(e.message);
        }
    };

    const handleExportCSV = () => {
        const questionsList = quizQuestions;
        const headers = ["Thứ hạng", "Người chơi", ...questionsList.map((_, i) => `Câu ${i + 1}`), "Tổng điểm"];
        
        const rows = leaderboard.map((player, idx) => {
            const playerAnswers = summaryData?.[player.playerId] || {};
            
            const questionCells = questionsList.map((q: any) => {
                const ans = playerAnswers[q._id];
                if (ans && ans.answerId) {
                    const chosenLetters = ans.answerId.split(',')
                        .map((id: string) => {
                            const optIndex = q.options.findIndex((opt: any) => opt._id === id);
                            return optIndex !== -1 ? String.fromCharCode(65 + optIndex) : '';
                        })
                        .filter(Boolean)
                        .join(', ');
                        
                    return `${chosenLetters} (${ans.isCorrect ? 'Đúng' : 'Sai'})`;
                }
                return "-";
            });
            
            return [
                `${idx + 1}`,
                player.name,
                ...questionCells,
                `${player.score}`
            ];
        });
        
        const csvContent = [
            headers.map(val => `"${val.replace(/"/g, '""')}"`).join(";"),
            ...rows.map(row => row.map(val => `"${val.replace(/"/g, '""')}"`).join(";"))
        ].join("\n");
        
        const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `Bao_cao_room_${roomPin || 'session'}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
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
                            className={`flex items-center justify-between p-3 rounded-xl border-2 border-black font-bold text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] ${index === 0 ? 'bg-amber-400 scale-105' : index === 1 ? 'bg-slate-300' : index === 2 ? 'bg-amber-600 text-white' : 'bg-white'
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

    if (gameState === 'FINAL_LEADERBOARD') {
        const top1 = leaderboard[0];
        const top2 = leaderboard[1];
        const top3 = leaderboard[2];
        const remainingPlayers = leaderboard.slice(3);

        return (
            <div className="flex flex-col flex-1 items-center p-4 md:p-6 w-full max-w-4xl mx-auto h-[calc(100vh-120px)] overflow-y-auto select-none pb-12">
                <div className="text-center mb-8 animate-bounce mt-4">
                    <Award className="w-12 h-12 md:w-16 md:h-16 text-yellow-400 mx-auto mb-2" />
                    <h2 className="text-2xl md:text-4xl font-black text-white uppercase tracking-widest [text-shadow:2px_2px_0_#000] md:[text-shadow:3px_3px_0_#000]">
                        Bảng Vàng Vinh Danh
                    </h2>
                    <p className="text-emerald-300 text-sm md:text-lg font-bold mt-1">Chúc mừng các nhà vô địch!</p>
                </div>

                <div className="flex items-end justify-center gap-3 md:gap-6 w-full max-w-2xl mb-12 h-72 md:h-80 px-2 md:px-4 mt-8">
                    {/* 2nd Place (Left) */}
                    {top2 ? (
                        <div className="flex flex-col items-center flex-1 animate-fade-in">
                            <div className="flex flex-col items-center mb-2">
                                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-slate-100 border-2 md:border-4 border-slate-400 overflow-hidden shadow-lg relative">
                                    <img src={`https://api.dicebear.com/7.x/bottts/svg?seed=${top2.avatar}`} alt="" className="w-full h-full" />
                                    <span className="absolute -top-1 -right-1 bg-slate-400 text-white rounded-full w-5 h-5 md:w-6 md:h-6 flex items-center justify-center font-black text-[10px] md:text-xs border border-white">
                                        2
                                    </span>
                                </div>
                                <span className="text-white font-bold mt-2 text-xs md:text-sm line-clamp-1 max-w-[80px] md:max-w-[120px]">{top2.name}</span>
                                <span className="text-slate-300 font-extrabold text-[10px] md:text-xs">{top2.score} Đ</span>
                            </div>
                            <div className="w-full bg-slate-400 h-24 md:h-28 rounded-t-xl border-4 border-b-0 border-black shadow-[3px_-3px_0px_0px_rgba(0,0,0,0.15)] flex items-center justify-center">
                                <span className="text-black font-black text-2xl md:text-4xl">2nd</span>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1"></div>
                    )}

                    {/* 1st Place (Middle) */}
                    {top1 ? (
                        <div className="flex flex-col items-center flex-1 animate-fade-in scale-105">
                            <div className="flex flex-col items-center mb-2">
                                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-slate-100 border-2 md:border-4 border-yellow-400 overflow-hidden shadow-2xl relative ring-2 md:ring-4 ring-yellow-400/30">
                                    <img src={`https://api.dicebear.com/7.x/bottts/svg?seed=${top1.avatar}`} alt="" className="w-full h-full" />
                                    <span className="absolute -top-1 -right-1 bg-yellow-400 text-black rounded-full w-6 h-6 md:w-7 md:h-7 flex items-center justify-center font-black text-xs md:text-sm border border-white animate-pulse">
                                        1
                                    </span>
                                </div>
                                <span className="text-yellow-300 font-black mt-2 text-sm md:text-base line-clamp-1 max-w-[100px] md:max-w-[140px] [text-shadow:1px_1px_0_#000]">{top1.name}</span>
                                <span className="text-yellow-400 font-black text-xs md:text-sm [text-shadow:1px_1px_0_#000]">{top1.score} Đ</span>
                            </div>
                            <div className="w-full bg-amber-400 h-32 md:h-36 rounded-t-xl border-4 border-b-0 border-black shadow-[4px_-4px_0px_0px_rgba(0,0,0,0.2)] flex items-center justify-center">
                                <span className="text-black font-black text-3xl md:text-5xl">1st</span>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1"></div>
                    )}

                    {/* 3rd Place (Right) */}
                    {top3 ? (
                        <div className="flex flex-col items-center flex-1 animate-fade-in">
                            <div className="flex flex-col items-center mb-2">
                                <div className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-slate-100 border-2 md:border-4 border-amber-600 overflow-hidden shadow-lg relative">
                                    <img src={`https://api.dicebear.com/7.x/bottts/svg?seed=${top3.avatar}`} alt="" className="w-full h-full" />
                                    <span className="absolute -top-1 -right-1 bg-amber-700 text-white rounded-full w-4 h-4 md:w-5 md:h-5 flex items-center justify-center font-black text-[9px] md:text-xs border border-white">
                                        3
                                    </span>
                                </div>
                                <span className="text-white font-bold mt-2 text-xs md:text-sm line-clamp-1 max-w-[70px] md:max-w-[100px]">{top3.name}</span>
                                <span className="text-amber-500 font-extrabold text-[10px] md:text-xs">{top3.score} Đ</span>
                            </div>
                            <div className="w-full bg-amber-700 h-18 md:h-20 rounded-t-xl border-4 border-b-0 border-black shadow-[2px_-2px_0px_0px_rgba(0,0,0,0.1)] flex items-center justify-center">
                                <span className="text-white font-black text-2xl md:text-3xl">3rd</span>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1"></div>
                    )}
                </div>

                {remainingPlayers.length > 0 && (
                    <div className="w-full max-w-2xl flex flex-col gap-3 bg-[#3B529A] p-4 md:p-6 rounded-2xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                        {remainingPlayers.map((player, index) => (
                            <div 
                                key={player.playerId || index}
                                className="flex items-center justify-between p-3 bg-black/10 rounded-xl border border-black/15 text-white font-bold text-sm md:text-base"
                            >
                                <div className="flex items-center gap-3 md:gap-4">
                                    <span className="text-lg md:text-xl font-black">#{index + 4}</span>
                                    <div className="w-8 h-8 rounded-full bg-slate-100 border border-black overflow-hidden">
                                        <img src={`https://api.dicebear.com/7.x/bottts/svg?seed=${player.avatar}`} alt="" className="w-full h-full" />
                                    </div>
                                    <span className="text-base md:text-lg">{player.name}</span>
                                </div>
                                <span className="font-black tracking-wide">{player.score} Điểm</span>
                            </div>
                        ))}
                    </div>
                )}

                <div className="mt-8 flex gap-4">
                    <button
                        onClick={handleFetchSummary}
                        className="inline-block border-4 border-black bg-amber-400 text-black px-8 py-3 rounded-full text-lg font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform active:translate-y-0 cursor-pointer"
                    >
                        Tổng Kết Phiên Chơi
                    </button>
                    <button
                        onClick={handleExitToHome}
                        className="inline-block border-4 border-black bg-emerald-400 text-black px-8 py-3 rounded-full text-lg font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform active:translate-y-0 cursor-pointer"
                    >
                        Quay Về Trang Chủ
                    </button>
                </div>
            </div>
        );
    }

    if (gameState === 'SUMMARY') {
        const questionsList = quizQuestions;

        const isHost = !!sessionId;
        const currentPlayerId = typeof window !== 'undefined' ? sessionStorage.getItem('currentPlayerId') : null;

        return (
            <div className="flex flex-col flex-1 items-center p-6 w-full max-w-5xl mx-auto h-[calc(100vh-120px)] overflow-y-auto select-none pb-12">
                <div className="text-center mb-8 mt-4 animate-bounce">
                    <Award className="w-16 h-16 text-yellow-400 mx-auto mb-2" />
                    <h2 className="text-4xl font-black text-white uppercase tracking-widest [text-shadow:3px_3px_0_#000]">
                        Tổng Kết Phiên Chơi
                    </h2>
                    <p className="text-emerald-300 text-lg font-bold mt-1">
                        {isHost ? "Bảng chi tiết kết quả của cả phòng đấu" : "Bảng chi tiết kết quả cá nhân"}
                    </p>
                </div>

                {isHost ? (
                    <div className="w-full bg-[#3B529A] p-6 rounded-2xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-x-auto mt-4">
                        <table className="w-full text-left border-collapse border border-black/20 text-white font-bold">
                            <thead>
                                <tr className="bg-[#2241AE] border-b-4 border-black">
                                    <th className="p-3 text-lg border-r border-black/20">Người chơi</th>
                                    {questionsList.map((q: any, i: number) => (
                                        <th key={q._id || i} className="p-3 text-center border-r border-black/20" title={q.content}>
                                            Câu {i + 1}
                                        </th>
                                    ))}
                                    <th className="p-3 text-center">Tổng điểm</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leaderboard.map((player, idx) => {
                                    const playerAnswers = summaryData?.[player.playerId] || {};
                                    return (
                                        <tr key={player.playerId || idx} className="border-b border-black/20 hover:bg-[#4E62A8]/50">
                                            <td className="p-3 flex items-center gap-3 border-r border-black/20 bg-black/10">
                                                <span className="text-sm text-yellow-300">#{idx + 1}</span>
                                                <div className="w-8 h-8 rounded-full bg-slate-100 border border-black overflow-hidden flex-none">
                                                    <img src={`https://api.dicebear.com/7.x/bottts/svg?seed=${player.avatar}`} alt="" className="w-full h-full" />
                                                </div>
                                                <span className="text-sm line-clamp-1">{player.name}</span>
                                            </td>
                                            {questionsList.map((q: any, qIdx: number) => {
                                                const ans = playerAnswers[q._id];
                                                let cellBg = "bg-slate-700/50";
                                                let cellIcon = "-";
                                                
                                                if (ans && ans.answerId) {
                                                    const chosenLetters = ans.answerId.split(',')
                                                        .map((id: string) => {
                                                            const optIndex = q.options.findIndex((opt: any) => opt._id === id);
                                                            return optIndex !== -1 ? String.fromCharCode(65 + optIndex) : '';
                                                        })
                                                        .filter(Boolean)
                                                        .join(', ');

                                                    if (ans.isCorrect) {
                                                        cellBg = "bg-emerald-600/70 text-emerald-200";
                                                        cellIcon = `${chosenLetters} (✓)`;
                                                    } else {
                                                        cellBg = "bg-rose-600/70 text-rose-200";
                                                        cellIcon = `${chosenLetters} (✗)`;
                                                    }
                                                }

                                                return (
                                                    <td key={q._id || qIdx} className={`p-3 text-center text-sm border-r border-black/20 ${cellBg}`}>
                                                        {cellIcon}
                                                    </td>
                                                );
                                            })}
                                            <td className="p-3 text-center text-yellow-300 font-extrabold bg-black/10">
                                                {player.score} Điểm
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="w-full max-w-3xl bg-[#3B529A] p-6 rounded-2xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-white mt-4">
                        <h3 className="text-2xl font-black mb-6 text-center border-b-2 border-white/10 pb-3">
                            Kết quả bài làm của bạn
                        </h3>
                        <div className="flex flex-col gap-4">
                            {questionsList.map((q: any, i: number) => {
                                const playerAnswers = summaryData?.[currentPlayerId || ""] || {};
                                const ans = playerAnswers[q._id];
                                let statusClass = "bg-slate-700/50 border-slate-500";
                                let resultText = "Không trả lời";
                                let scoreText = "0 điểm";

                                if (ans) {
                                     if (ans.isCorrect) {
                                         statusClass = "bg-emerald-600/40 border-emerald-500";
                                         resultText = "Chính xác";
                                         scoreText = `+${ans.score} điểm`;
                                     } else {
                                         statusClass = "bg-rose-600/40 border-rose-500";
                                         resultText = "Chưa chính xác";
                                         scoreText = "0 điểm";
                                     }
                                }

                                return (
                                    <div key={q._id || i} className={`p-4 rounded-xl border-2 flex flex-col gap-3 ${statusClass}`}>
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-4 border-b border-white/10 pb-2">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-sm text-gray-300 font-bold">Câu hỏi {i + 1}</span>
                                                <span className="text-base font-black leading-snug">{q.content}</span>
                                            </div>
                                            <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start flex-none text-left md:text-right w-full md:w-auto border-t border-white/5 md:border-none pt-2 md:pt-0">
                                                <span className="font-black text-base md:text-lg">{resultText}</span>
                                                <span className="text-sm font-bold text-yellow-300">{scoreText}</span>
                                            </div>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-1">
                                            {q.options?.map((opt: any, optIdx: number) => {
                                                const isOptCorrect = opt.isCorrect;
                                                const isOptChosen = ans?.answerId?.split(',').includes(opt._id);

                                                let optBg = "bg-black/20 border-white/10 text-white/70";
                                                if (isOptCorrect) {
                                                    optBg = "bg-emerald-500/20 border-emerald-500 text-emerald-200 font-bold";
                                                } else if (isOptChosen) {
                                                    optBg = "bg-rose-500/20 border-rose-500 text-rose-200 font-bold";
                                                }

                                                return (
                                                    <div 
                                                        key={opt._id || optIdx}
                                                        className={`p-3 rounded-lg border flex items-center justify-between text-sm ${optBg}`}
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <span className="bg-black/30 w-6 h-6 rounded flex items-center justify-center font-bold text-xs">
                                                                {String.fromCharCode(65 + optIdx)}
                                                            </span>
                                                            <span className="line-clamp-2">{opt.content}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1.5 flex-none">
                                                            {isOptCorrect && (
                                                                <span className="bg-emerald-500 text-white text-[10px] px-1.5 py-0.5 rounded font-black uppercase">
                                                                    Đúng
                                                                </span>
                                                            )}
                                                            {isOptChosen && (
                                                                <span className="bg-blue-500 text-white text-[10px] px-1.5 py-0.5 rounded font-black uppercase">
                                                                    Bạn chọn
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                <div className="mt-8 flex flex-wrap gap-4 justify-center">
                    {isHost && (
                        <button
                            onClick={handleExportCSV}
                            className="inline-block border-4 border-black bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-3 rounded-full text-lg font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none transition-transform cursor-pointer"
                        >
                            Xuất báo cáo
                        </button>
                    )}
                    <button
                        onClick={() => setGameState('FINAL_LEADERBOARD')}
                        className="inline-block border-4 border-black bg-slate-300 hover:bg-slate-400 text-black px-6 py-3 rounded-full text-lg font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none transition-transform cursor-pointer"
                    >
                        Quay lại vinh danh
                    </button>
                    <button
                        onClick={handleExitToHome}
                        className="inline-block border-4 border-black bg-emerald-400 text-black px-8 py-3 rounded-full text-lg font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform active:translate-y-0 cursor-pointer"
                    >
                        Quay Về Trang Chủ
                    </button>
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
                    <button
                        onClick={handleExitToHome}
                        className="inline-block border-4 border-black bg-amber-400 text-black px-8 py-3 rounded-full text-lg font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform active:translate-y-0 cursor-pointer"
                    >
                        Quay Về Trang Chủ
                    </button>
                </div>
            </div>
        );
    }

    const totalDuration = question?.duration || 30;
    const timeElapsed = Math.max(0, Math.min(totalDuration - timer, totalDuration));
    const timeRatio = timeElapsed / totalDuration;
    const scoreMultiplier = 1 - (timeRatio * 0.5);
    const displayScore = Math.round(1000 * scoreMultiplier);

    return (
        <div className="flex flex-col flex-1 w-full max-w-5xl mx-auto p-4 gap-6 select-none">
            <div className="flex flex-col md:grid md:grid-cols-3 w-full bg-[#2241AE] p-4 rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-white font-black text-base md:text-lg gap-3 md:gap-0 items-center">
                <div className="flex items-center gap-2 justify-center md:justify-start w-full md:w-auto">
                    <span className="bg-purple-700 px-4 py-1 border-2 border-black rounded-lg w-full text-center md:w-auto">
                        Câu hỏi: {question?.currentQuestionIndex} / {question?.totalQuestions}
                    </span>
                </div>
                <div className="flex items-center gap-2 justify-center w-full md:w-auto">
                    <div className="flex items-center gap-2 bg-black/40 px-4 py-1 rounded-full border border-white/20 text-yellow-400">
                        <Clock className="w-5 h-5 animate-spin" />
                        <span>Điểm: {displayScore}</span>
                    </div>
                </div>
                <div className="flex items-center gap-2 justify-center md:justify-end w-full md:w-auto">
                    <div className="flex items-center gap-2 bg-emerald-600 px-4 py-1 border-2 border-black rounded-lg w-full justify-center md:w-auto">
                        <Users className="w-5 h-5" />
                        <span>Đã nộp: {answeredStats.answeredCount} / {answeredStats.totalPlayers}</span>
                    </div>
                </div>
            </div>

            <div className="flex flex-col flex-1 bg-[#3B529A] rounded-2xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-4 md:p-8 min-h-45 md:min-h-55 justify-center items-center text-center relative overflow-hidden gap-4">
                <h3 className="text-xl md:text-3xl font-black text-white max-w-3xl leading-snug [text-shadow:2px_2px_0_#000]">
                    {question?.title}
                </h3>

                {question?.image && (
                    <div className="w-full max-w-xs md:max-w-md max-h-45 md:max-h-60 rounded-xl border-4 border-black overflow-hidden bg-black/20 flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mt-2">
                        <img 
                            src={question.image} 
                            alt="Hình ảnh câu hỏi" 
                            className="max-w-full max-h-45 md:max-h-60 object-contain" 
                        />
                    </div>
                )}

                {gameState === 'TIMEOUT' && !isAnswerRevealed && (
                    <div className="absolute inset-0 bg-black/70 flex flex-col justify-center items-center z-10 animate-fade-in">
                        <div className="text-red-400 font-black text-3xl md:text-5xl uppercase tracking-wider mb-2 [text-shadow:3px_3px_0_#000]">
                            Hết Giờ!
                        </div>
                        <p className="text-gray-300 font-bold text-sm md:text-lg">Đang tính toán kết quả phòng đấu...</p>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full pb-6">
                {question?.options?.map((opt: any, index: number) => {
                    const colors = [
                        'bg-red-500 hover:bg-red-600 text-white',
                        'bg-blue-500 hover:bg-blue-600 text-white',
                        'bg-amber-500 hover:bg-amber-600 text-black',
                        'bg-emerald-500 hover:bg-emerald-600 text-white'
                    ];
                    const selectedColor = colors[index % colors.length];
                    const isCurrentSelected = question?.questionType === 'multiple'
                        ? selectedAnswerIds.includes(opt.id)
                        : selectedAnswerId === opt.id;

                    const isCorrect = correctOptionIds.includes(opt.id);

                    let revealStyle = "";
                    if (isAnswerRevealed) {
                        if (isCorrect) {
                            revealStyle = "scale-105 border-green-400 ring-4 ring-green-400/50 shadow-[6px_6px_0px_0px_rgba(0,255,0,0.3)] z-10 font-extrabold";
                        } else {
                            revealStyle = "opacity-20 scale-95 pointer-events-none";
                        }
                    } else {
                        revealStyle = hasSubmitted && !isCurrentSelected
                            ? 'opacity-40 scale-95 cursor-not-allowed'
                            : '';
                    }

                    return (
                        <button
                            key={opt.id}
                            disabled={hasSubmitted || gameState !== 'PLAYING'}
                            onClick={() => handleOptionClick(opt.id)}
                            className={`w-full h-20 md:h-24 rounded-2xl border-4 border-black font-black text-lg md:text-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 flex items-center px-4 md:px-6 relative cursor-pointer group text-left ${selectedColor} ${revealStyle} ${!isAnswerRevealed && isCurrentSelected ? 'ring-4 ring-white border-white -translate-y-1 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]' : 'active:translate-y-1 active:shadow-none'
                                }`}
                        >
                            <span className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-black/20 flex items-center justify-center text-xl md:text-2xl font-black mr-3 md:mr-4 border border-black/10 flex-none">
                                {String.fromCharCode(65 + index)}
                            </span>
                            <span className="flex-1 line-clamp-2 pr-8 text-sm md:text-base">{opt.text}</span>

                            {isAnswerRevealed && isCorrect && (
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 bg-green-500 text-white p-1 rounded-full border-2 border-black animate-bounce shadow-md">
                                    <CheckCircle2 className="w-6 h-6" />
                                </div>
                            )}

                            {!isAnswerRevealed && isCurrentSelected && (
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 bg-white text-black p-1 rounded-full border-2 border-black animate-bounce">
                                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>

            {question?.questionType === 'multiple' && !hasSubmitted && gameState === 'PLAYING' && (
                <div className="flex justify-center w-full mt-2 pb-6">
                    <button
                        onClick={() => handleSubmitAnswer(selectedAnswerIds.join(','))}
                        disabled={selectedAnswerIds.length === 0}
                        className="w-full max-w-md h-14 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-xl rounded-2xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                        <span>Nộp bài</span>
                        {selectedAnswerIds.length > 0 && (
                            <span className="bg-black/20 px-2 py-0.5 rounded-lg text-sm font-bold">
                                {selectedAnswerIds.length} lựa chọn
                            </span>
                        )}
                    </button>
                </div>
            )}
        </div>
    );
};