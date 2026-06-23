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
    const [timeLimit, setTimeLimit] = useState<number>(10);
    
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [selectedTopics, setSelectedTopics] = useState<QuizTag[]>([]);
    const dropdownRef = useRef<HTMLDivElement>(null);

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
        try {
            console.log("1. Bắt đầu gọi API với data:", { prompt, numQuestions, timeLimit, selectedTopics });
            const quizPreview = await quizService.quizGenerate(prompt, numQuestions, timeLimit, selectedTopics);

            console.log("2. Kết quả API trả về (quizPreview):", quizPreview);

            if (!quizPreview) {
                toast.error('Khởi tạo bộ đề thất bại');
                return;
            } 

            // Bọc riêng khâu ghi vào Storage để check lỗi JSON
            try {
                const jsonString = JSON.stringify(quizPreview);
                console.log("3. Ép kiểu JSON thành công, tiến hành lưu...");
                sessionStorage.setItem('generated_quiz_preview', jsonString);
            } catch (jsonError) {
                console.error("❌ LỖI CHÍ MẠNG: Không thể ép kiểu dữ liệu sang JSON!", jsonError);
                toast.error('Dữ liệu từ AI sai cấu trúc, không thể lưu tạm!');
                return; // Ngắt luồng, không chuyển trang vì không có dữ liệu
            }

            toast.success('Khởi tạo bộ đề thành công');
            
            setTimeout(() => {
                router.push('/create-quiz');
            }, 50);

        } catch (error) {
            console.error("Lỗi tổng thể hệ thống:", error);
            toast.error('Hệ thống gặp sự cố khi tạo bộ đề');
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
                            isReadonly={false} 
                        />
                        
                        <div className="flex flex-row justify-between text-white gap-6 font-bold text-lg">
                            <div className="relative flex-1">
                                <select 
                                    value={numQuestions}
                                    onChange={(e) => setNumQuestions(Number(e.target.value))}
                                    className="w-full h-10 bg-transparent text-white appearance-none cursor-pointer focus:outline-none"
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
                                    className="w-full h-10 bg-transparent text-white appearance-none cursor-pointer focus:outline-none"
                                >
                                    <option value={10} className="text-black">10 giây</option>
                                    <option value={15} className="text-black">15 giây</option>
                                    <option value={20} className="text-black">20 giây</option>
                                </select>
                                <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none text-white" />
                            </div>

                            <div className="relative flex-1" ref={dropdownRef}>
                                <button
                                    type="button"
                                    onClick={() => setIsOpen(!isOpen)}
                                    className="w-full h-10 bg-transparent text-white flex items-center justify-between cursor-pointer focus:outline-none"
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
                    <div className="flex justify-center items-center w-full py-12">
                        <button onClick={() => handleGenerateQuiz()} className="bg-[#15A440] text-white font-bold text-2xl flex items-center justify-center w-sm h-14 rounded-2xl shadow-[inset_0px_-5px_4px_0px_rgba(0,0,0,0.5)] hover:bg-[#50CA75] active:shadow-[none] active:bg-[#62DA86] active:translate-y-[0.5] transition-all duration-300">
                            Khởi tạo 
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}