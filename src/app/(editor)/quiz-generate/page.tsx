'use client'

import BaseInput from "@/component/base-input";
import { useState, useEffect, useRef } from "react";
import { ChevronDown, Check } from "lucide-react";
import { quizService } from "@/features/quiz/quiz.service";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { QuizTag } from "@/constants/constants";

export default function QuizGenerate() {
    const router = useRouter();

    const [prompt, setPrompt] = useState('');
    const [numQuestions, setNumQuestions] = useState<number>(3);
    const [timeLimit, setTimeLimit] = useState<number>(20);
    
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [selectedTopics, setSelectedTopics] = useState<QuizTag[]>([]);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // 🌟 1. Thêm State quản lý trạng thái loading khi đang sinh câu hỏi bằng AI
    const [isGenerating, setIsGenerating] = useState<boolean>(false);

    const topicOptions = [
        { value: QuizTag.GEOGRAPHY, label: "Địa lý" },
        { value: QuizTag.HISTORY, label: "Lịch sử" },
        { value: QuizTag.SPORT, label: "Thể thao" },
        { value: QuizTag.ART, label: "Mỹ thuật và văn học" },
        { value: QuizTag.ENTERTAINMENT, label: "Giải trí" },
        { value: QuizTag.SCIENCE, label: "Khoa học tự nhiên" },
        { value: QuizTag.TRIVIA, label: "Đa dạng"}
    ];

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleToggleTopic = (value: QuizTag) => {
        setSelectedTopics(prev =>
            prev.includes(value)
                ? prev.filter(item => item !== value)
                : [...prev, value]
        );
    };

    const handleGenerateQuiz = async () => {
        const realPrompt = prompt.trim();

        setIsGenerating(true);

        try {
            const quizPreview = await quizService.quizGenerate(realPrompt, numQuestions, timeLimit, selectedTopics);

            try {
                const jsonString = JSON.stringify(quizPreview);
                sessionStorage.setItem('generated_quiz_preview', jsonString);
            } catch (jsonError) {
                toast.error('Dữ liệu từ AI sai cấu trúc, không thể lưu tạm!');
                return;
            }

            if(quizPreview){
                toast.success('Khởi tạo bộ đề thành công');
                router.push('/create-quiz');
            }

        } catch (error) {
            console.error("Lỗi tổng thể hệ thống:", error);
            toast.error('Hệ thống gặp sự cố khi tạo bộ đề');
        } finally {
            setIsGenerating(false);
        }
    }

    return (
        <div className="flex flex-col h-screen overflow-hidden">
            <div className="flex flex-none flex-row h-auto gap-5 pl-5 bg-[#4E62A8]/87 justify-start items-start p-1 shadow-[0_0_10px_rgba(0,0,0,1)] relative z-50">
                <div className="w-50 h-20">
                    <a href="/" className="h-full w-full flex justify-center">
                        <img src="image/let_quiz_logo.png" className="h-full w-full" alt="Let Quiz Logo" />
                    </a>
                </div>
            </div>
            
            <div className="w-full h-full flex justify-center items-start py-10">
                <div className="flex flex-col w-4xl h-full p-10 gap-20">
                    <div className="flex flex-none flex-col w-full justify-center items-center gap-10 text-5xl font-bold text-white">
                        <p>A.I</p>
                        <p className="text-center text-4xl">Hãy nhập ý tưởng của bạn</p>
                    </div>
                    
                    <div className="flex flex-col gap-3">
                        <BaseInput 
                            onChange={(e) => setPrompt(e.target.value)} 
                            placeholder={'Nhập ý tưởng của bạn'} 
                            value={prompt} 
                            isReadonly={isGenerating} // Khóa luôn ô nhập liệu khi đang sinh đề
                        />
                        
                        <div className="flex flex-row justify-between text-white gap-6 font-bold text-lg">
                            <div className="relative flex-1">
                                <select 
                                    value={numQuestions}
                                    onChange={(e) => setNumQuestions(Number(e.target.value))}
                                    disabled={isGenerating} // Khóa select khi đang loading
                                    className="w-full h-10 bg-transparent text-white appearance-none cursor-pointer focus:outline-none disabled:opacity-50"
                                >
                                    <option value={3} className="text-black">3 câu hỏi</option>
                                    <option value={5} className="text-black">5 câu hỏi</option>
                                    <option value={7} className="text-black">7 câu hỏi</option>
                                </select>
                                <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none text-white" />
                            </div>

                            <div className="relative flex-1">
                                <select 
                                    value={timeLimit}
                                    onChange={(e) => setTimeLimit(Number(e.target.value))}
                                    disabled={isGenerating} // Khóa select khi đang loading
                                    className="w-full h-10 bg-transparent text-white appearance-none cursor-pointer focus:outline-none disabled:opacity-50"
                                >
                                    <option value={20} className="text-black">20 giây</option>
                                    <option value={25} className="text-black">25 giây</option>
                                    <option value={30} className="text-black">30 giây</option>
                                </select>
                                <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none text-white" />
                            </div>

                            <div className="relative flex-1" ref={dropdownRef}>
                                <button
                                    type="button"
                                    onClick={() => !isGenerating && setIsOpen(!isOpen)}
                                    disabled={isGenerating} // Khóa dropdown khi đang loading
                                    className="w-full h-10 bg-transparent text-white flex items-center justify-between cursor-pointer focus:outline-none disabled:opacity-50"
                                >
                                    <span className="truncate">
                                        {selectedTopics.length === 0 
                                            ? "Chọn chủ đề" 
                                            : `Đã chọn (${selectedTopics.length})`
                                        }
                                    </span>
                                    <ChevronDown className={`w-5 h-5 text-white transition-transform ${isOpen ? "rotate-180" : ""}`} />
                                </button>

                                {isOpen && (
                                    <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded shadow-xl z-50 max-h-60 overflow-y-auto py-1">
                                        {topicOptions.map((topic) => {
                                            const isChecked = selectedTopics.includes(topic.value);
                                            return (
                                                <label
                                                    key={topic.value}
                                                    className="flex items-center px-4 py-2.5 hover:bg-gray-100 cursor-pointer select-none justify-between border-b border-gray-50 last:border-none"
                                                >
                                                    <span className="text-sm text-slate-800 font-bold">{topic.label}</span>
                                                    <div className="relative flex items-center">
                                                        <input
                                                            type="checkbox"
                                                            checked={isChecked}
                                                            onChange={() => handleToggleTopic(topic.value)}
                                                            className="peer appearance-none w-4 h-4 border border-gray-400 rounded bg-white checked:bg-blue-500 checked:border-blue-500 cursor-pointer transition-colors"
                                                        />
                                                        {isChecked && (
                                                            <Check className="absolute inset-0 m-auto w-3 h-3 text-white pointer-events-none stroke-3" />
                                                        )}
                                                    </div>
                                                </label>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    {/* 🌟 4. Khu vực nút bấm Khởi tạo / Đang loading */}
                    <div className="flex justify-center items-center w-full py-12">
                        <button 
                            onClick={() => handleGenerateQuiz()} 
                            disabled={isGenerating} // Khóa nút bấm ngăn spam click liên tục
                            className={`text-white font-bold text-2xl flex items-center justify-center w-sm h-14 rounded-2xl transition-all duration-300
                                ${isGenerating 
                                    ? 'bg-gray-500 cursor-not-allowed shadow-none' 
                                    : 'bg-[#15A440] shadow-[inset_0px_-5px_4px_0px_rgba(0,0,0,0.5)] hover:bg-[#50CA75] active:shadow-[none] active:bg-[#62DA86] active:translate-y-[0.5]'
                                }`}
                        >
                            {isGenerating ? (
                                <div className="flex items-center gap-3">
                                    {/* Hiệu ứng xoay tròn SVG Spinner */}
                                    <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span className="text-xl">Đang khởi tạo...</span>
                                </div>
                            ) : (
                                "Khởi tạo"
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}