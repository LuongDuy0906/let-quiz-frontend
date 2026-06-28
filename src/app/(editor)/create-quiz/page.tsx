'use client'

import { QuestionEditor } from "@/component/editor/question-editor";
import { TypeSelector } from "@/component/editor/type-seletor";
import { base64toFile, createDefaultQuestion, createDefaultQuiz, EditorStep } from "@/constants/constants";
import { Eye, Plus } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { SettingPage } from "@/component/editor/setting";
import { quizService } from "@/features/quiz/quiz.service";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function CreateQuizPage() {
    const [quiz, setQuiz] = useState<any>(null);
    const [currentStep, setCurrentStep] = useState<EditorStep>('type-selector');
    const [activeIndex, setActiveIndex] = useState(0);
    const [onSetting, setOnSetting] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);
    const [isSaving, setIsSaving] = useState<boolean>(false);

    const isLoadedRef = useRef(false);
    const router = useRouter();

    useEffect(() => {
        if (typeof window === 'undefined') return;

        if (isLoadedRef.current) return;

        const rawData = sessionStorage.getItem('generated_quiz_preview');
        
        if (rawData) {
            try {
                const sharedQuizData = JSON.parse(rawData);
                setQuiz(sharedQuizData);

                if (sharedQuizData && (sharedQuizData._id || sharedQuizData.id)) {
                    setCurrentStep('setting');
                    setOnSetting(true);
                    setActiveIndex(-1);
                } else if (sharedQuizData && sharedQuizData.questions && sharedQuizData.questions.length > 0) {
                    setActiveIndex(0);
                    setCurrentStep(sharedQuizData.questions[0].questionType || 'single');
                    setOnSetting(false);
                } else {
                    setCurrentStep('type-selector');
                    setOnSetting(false);
                }

                isLoadedRef.current = true;
                sessionStorage.removeItem('generated_quiz_preview')
            } catch (error) {
                console.log("Lỗi đọc dữ liệu:", error);
                setQuiz(createDefaultQuiz());
                setCurrentStep('type-selector');
            }
        } else {
            setQuiz(createDefaultQuiz());
            setCurrentStep('type-selector')
        }
        
        setIsInitialized(true);
    }, []);

    const handleUpdateQuizMetadata = (fields: any) => {
        setQuiz((prev: any) => ({ ...prev, ...fields }));
    };

    const handleUpdateQuestion = (index: number, updatedFields: any) => {
        setQuiz((prev: any) => {
            const newQuestions = [...prev.questions];
            newQuestions[index] = { ...newQuestions[index], ...updatedFields };
            return { ...prev, questions: newQuestions };
        });
    };
    
    const handleDeleteQuestion = (indexToDelete: number) => {
        if (!quiz?.questions || quiz.questions.length <= 1) {
            alert("Bộ đề phải có ít nhất một câu hỏi!");
            return;
        }

        const newQuestions = quiz.questions.filter((_: any, i: number) => i !== indexToDelete);

        setQuiz((prev: any) => ({
            ...prev,
            questions: newQuestions
        }));

        let newActiveIndex = activeIndex;
        if (indexToDelete <= activeIndex && activeIndex > 0) {
            newActiveIndex = activeIndex - 1;
            setActiveIndex(newActiveIndex);
        } else if (activeIndex >= newQuestions.length) {
            newActiveIndex = newQuestions.length - 1;
            setActiveIndex(newActiveIndex);
        }

        const targetQ = newQuestions[newActiveIndex];
        if (targetQ) {
            setCurrentStep(targetQ.questionType || 'type-selector');
        } else {
            setCurrentStep('type-selector');
        }
    };


    const addNewQuestion = () => {
        const newEmptyQ = createDefaultQuestion();
        setQuiz((prev: any) => ({
            ...prev,
            questions: [...prev.questions, newEmptyQ]
        }));
        setActiveIndex(quiz.questions.length);
        setCurrentStep('type-selector');
    };

    const selectTypeAndAdd = (type: 'single' | 'multiple') => {
        const defaultData = createDefaultQuestion(type);
        handleUpdateQuestion(activeIndex, {
            ...defaultData,
            questionType: type
        });
        setCurrentStep(type);
    };

    const renderComponent = () => {
        const currentQuestion = quiz?.questions?.[activeIndex];
        console.log(quiz);
        if (!currentQuestion && currentStep !== 'setting') return null;

        const isPreExistingQuestion = !!(currentQuestion?.questionType);
        
        switch (currentStep) {
            case 'type-selector':
                if (isPreExistingQuestion) {
                    console.log(isPreExistingQuestion);
                    const activeType = currentQuestion.questionType === 'multiple' || currentQuestion.questionType === 'MULTIPLE_CHOICE' 
                        ? 'multiple' 
                        : 'single';
                    
                    return (
                        <QuestionEditor 
                            question={currentQuestion} 
                            index={activeIndex} 
                            onUpdate={(fields) => handleUpdateQuestion(activeIndex, fields)} 
                            type={activeType} 
                            onDelete={(index) => handleDeleteQuestion(index)}
                        />
                    );
                }
                return (
                    <TypeSelector onSelect={selectTypeAndAdd}/>
                );
            case 'single':
            case 'multiple':
                return (
                    <QuestionEditor 
                        question={currentQuestion} 
                        index={activeIndex} 
                        onUpdate={(fields) => handleUpdateQuestion(activeIndex, fields)} 
                        type={currentStep} 
                        onDelete={(index) => handleDeleteQuestion(index)}
                    />
                );
            case 'setting':
                return (
                    <SettingPage quiz={quiz} onUpdate={handleUpdateQuizMetadata} />
                )
        }
    };

    const handleSaveQuiz = async () => {
        if (isSaving) return;

        setIsSaving(true);

        try {
            let finalQuizImage = quiz.image;

            if(quiz.image && quiz.image.startsWith('data:image')){
                const file = await base64toFile(quiz.image, 'quiz-cover.png');
                const res = await quizService.uploadQuizImage(file);
                finalQuizImage = res;
            };

            const updatedQuestion = await Promise.all(quiz.questions.map(async (q: any, index: number) => {
                if(q.image && q.image.startsWith('data:image')){
                    const file = await base64toFile(q.image, `image-${index}.png`);
                    const res = await quizService.uploadQuizImage(file);
                    return {...q, image: res}
                }
                return q;
            }))

            const finalQuizData = {
                ...quiz,
                image: finalQuizImage,
                questions: updatedQuestion
            }
            const response = await quizService.saveQuiz(finalQuizData);

            if(response){
                setTimeout(() => {
                    router.push('/');
                }, 1500);
            }
        } catch (error: any) {
            console.error("Lỗi khi lưu bộ đề:", error);
            toast.error(error?.message || "Đã xảy ra lỗi khi lưu bộ đề");
        } finally {
            setIsSaving(false);
        }
    }

    if (!isInitialized) {
        return (
            <div className="w-screen h-screen flex items-center justify-center bg-[#4E62A8] text-white font-bold text-xl">
                Đang nạp cấu trúc bộ đề...
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen overflow-hidden select-none">
            <div className="flex flex-none flex-col sm:flex-row w-full h-auto gap-4 px-4 bg-[#4E62A8]/87 justify-between items-center py-2 shadow-[0_0_10px_rgba(0,0,0,1)] relative z-50">
                <div className="flex flex-none justify-center items-center w-36 h-12">
                    <a href="/" className="h-full w-full flex justify-center">
                        <img src="image/let_quiz_logo.png" className="h-full w-auto object-contain" alt="Let Quiz Logo" />
                    </a>
                </div>
                <div className="flex items-center justify-center sm:justify-end gap-3 h-auto py-1 w-full sm:w-auto">
                    {/* 🌟 Cập nhật lại nút bấm Lưu */}
                    <div 
                        onClick={() => !isSaving && handleSaveQuiz()}
                        className={`pb-1 text-white font-black text-lg flex items-center justify-center w-28 h-10 rounded-xl transition-all duration-300
                            ${isSaving 
                                ? 'bg-gray-500 opacity-70 cursor-not-allowed shadow-none pointer-events-none' 
                                : 'bg-[#15A440] shadow-[inset_0px_-3px_3px_0px_rgba(0,0,0,0.5)] hover:bg-[#50CA75] active:shadow-[none] active:bg-[#62DA86] active:translate-y-[0.5] cursor-pointer'
                            }`}
                    >
                        {isSaving ? (
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span className="text-sm">Lưu...</span>
                            </div>
                        ) : (
                            "Lưu"
                        )}
                    </div>
                    <div className="flex flex-row bg-[#43569A] text-white justify-center items-center w-28 h-10 rounded-xl gap-2 text-sm font-bold cursor-pointer" >
                        <Eye className="w-4 h-4" />
                        <span>Xem trước</span>
                    </div>
                </div>
            </div>
            
            <div className="flex-1 overflow-y-auto">
                {renderComponent()}
            </div>
            
            <div className="flex flex-none flex-row w-full h-24 bg-[#6F82C7] shadow-[0_0_20px_rgba(0,0,0,1)] py-2 px-4">
                <div className="flex flex-1 flex-row items-center justify-start gap-4 overflow-x-auto scrollbar-hide">
                    <button onClick={() => {
                            setOnSetting(true);
                            setActiveIndex(-1);
                            setCurrentStep('setting');
                        }} 
                        className={`h-16 w-24 ${onSetting ? 'bg-[#23CBFA] border-2 border-white' : 'bg-[#4E62A8]/87'} text-sm text-white font-bold rounded-xl cursor-pointer flex-none`}>
                        Cài đặt
                    </button>

                    {/* 🌟 ĐẢM BẢO ĐỒNG BỘ DÙNG ĐÚNG THUỘC TÍNH SỐ ÍT: quiz?.question */}
                    {
                        quiz?.questions?.map((_: any, index: number) => (
                            <div 
                                key={index} 
                                onClick={() => {
                                    setActiveIndex(index);
                                    setCurrentStep(quiz.questions[index].questionType || 'type-selector');
                                    setOnSetting(false);
                                }}
                                className={`h-16 w-24 text-xs text-white font-bold rounded-xl cursor-pointer flex flex-row p-1 flex-none transition-all items-center
                                    ${activeIndex === index ? 'bg-[#23CBFA] scale-105 border-2 border-white' : 'bg-[#4E62A8]/87'}
                                `}
                            >
                                <div className="flex-none flex items-center justify-center w-6">   
                                    <p>{index + 1}</p>
                                </div>
                                <div className="flex-1 flex justify-center items-center">
                                    <div className="h-8 w-10 bg-[#3B56B4] border-black border rounded-sm"></div>                                     
                                </div>
                            </div>
                        ))
                    }
                </div>

                <div className="h-full w-32 sm:w-48 flex justify-between items-center flex-row flex-none ml-2 sm:ml-4 gap-2">
                    <div className="text-white font-bold text-xs sm:text-sm hidden xs:block">
                        <p>Thêm câu hỏi <span>={">"}</span></p>
                    </div>
                    <button 
                        onClick={addNewQuestion} 
                        className="flex justify-center items-center h-10 w-10 sm:h-12 sm:w-12 bg-[#23CBFA] shadow-[inset_0px_-3px_3px_0px_rgba(0,0,0,0.5)] rounded-xl hover:scale-105 transition-all cursor-pointer flex-none"
                    >
                        <Plus className="h-5 w-5 sm:h-6 sm:w-6 text-white"/>
                    </button>
                </div>
            </div>
        </div>
    );
}