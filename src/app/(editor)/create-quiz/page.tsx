'use client'

import { QuestionEditor } from "@/component/editor/question-editor";
import { TypeSelector } from "@/component/editor/type-seletor";
import { base64toFile, createDefaultQuestion, createDefaultQuiz, EditorStep } from "@/constants/constants";
import { Eye, Plus } from "lucide-react";
import { useState } from "react";
import { SettingPage } from "@/component/editor/setting";
import { quizService } from "@/features/quiz/quiz.service";

interface ExistQuizProp {
    existQuiz?: any; 
}

export default function CreateQuizPage({existQuiz}: ExistQuizProp) {
    const [currentStep, setCurrentStep] = useState<EditorStep>(() => {
        if(existQuiz) {
            return 'setting';
        }
        return 'type-selector';
    });

    const [activeIndex, setActiveIndex] = useState(0);
    const [onSetting, setOnSetting] = useState(false);

    const [quiz, setQuiz] = useState(() => {
        if(existQuiz) {
            return existQuiz
        }
        return createDefaultQuiz();
    });

    const handleUpdateQuizMetadata = (fields: any) => {
        setQuiz(prev => ({ ...prev, ...fields }));
    };

    const handleUpdateQuestion = (index: number, updatedFields: any) => {
        setQuiz(prev => {
            const newQuestions = [...prev.question];
            newQuestions[index] = { ...newQuestions[index], ...updatedFields };
            return { ...prev, question: newQuestions };
        });
    };
    
    const handleDeleteQuestion = (indexToDelete: number) => {
        if (quiz.question.length <= 1) {
            alert("Bộ đề phải có ít nhất một câu hỏi!");
            return;
        }

        setQuiz(prev => ({
            ...prev,
            questions: prev.question.filter((_: any, i: number) => i !== indexToDelete)
        }));

        if (indexToDelete <= activeIndex && activeIndex > 0) {
            setActiveIndex(activeIndex - 1);
        }
    };

    const addNewQuestion = () => {
        const newEmptyQ = createDefaultQuestion('single');
        
        setQuiz(prev => ({
            ...prev,
            questions: [...prev.question, newEmptyQ]
        }));
        
        setActiveIndex(quiz.question.length);
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
        const currentQuestion = quiz.question[activeIndex];
        
        switch (currentStep) {
            case 'type-selector':
                return <TypeSelector onSelect={selectTypeAndAdd}/>
            case 'single':
                return (
                    <QuestionEditor 
                        question={currentQuestion} 
                        index={activeIndex} 
                        onUpdate={(fields) => handleUpdateQuestion(activeIndex, fields)} 
                        type={currentStep} 
                    />
                );
            case 'multiple':
                return (
                    <QuestionEditor 
                        question={currentQuestion} 
                        index={activeIndex} 
                        onUpdate={(fields) => handleUpdateQuestion(activeIndex, fields)} 
                        type={currentStep} 
                    />
                );
            case 'setting':
                return (
                    <SettingPage quiz={quiz} onUpdate={handleUpdateQuizMetadata} />
                )
        }
    };

    const handleSaveQuiz = async () => {
        let finalQuizImage = quiz.image;

        if(quiz.image && quiz.image.startsWith('data:image')){
            const file = await base64toFile(quiz.image, 'quiz-cover.png');
            const res = await quizService.uploadQuizImage(file);

            finalQuizImage = res;
        };

        const updatedQuestion = await Promise.all(quiz.question.map(async (q: any, index: number) => {
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
            question: updatedQuestion
        }
        await quizService.saveQuiz(finalQuizData);
    }

    return (
        <div className="flex flex-col h-screen overflow-hidden">
            <div className="flex flex-none flex-row h-auto gap-5 bg-[#4E62A8]/87 justify-center items-center p-1 shadow-[0_0_10px_rgba(0,0,0,1)] relative z-50">
                <div className="flex flex-none justify-center items-center w-sm h-20">
                    <a href="/" className="h-full w-sm"><img src="image/let_quiz_logo.png" className="h-full w-full" alt="Let Quiz Logo" /></a>
                </div>
                <div className="flex flex-1 items-center justify-start gap-6 h-10">
                    <div onClick={handleSaveQuiz} className="bg-[#15A440] pb-2 text-white font-bold text-2xl flex items-center justify-center w-35 h-12 rounded-2xl shadow-[inset_0px_-5px_4px_0px_rgba(0,0,0,0.5)] hover:bg-[#50CA75] active:shadow-[none] active:bg-[#62DA86] active:translate-y-[0.5] transition-all duration-300">
                        Lưu
                    </div>
                    <div className="flex flex-row bg-[#43569A] text-white justify-center items-center w-35 h-12 rounded-2xl gap-2 font-medium" >
                        <div>
                            <Eye />
                        </div>
                        <div>
                            Xem trước
                        </div>
                    </div>
                </div>
            </div>
            {/* Vùng hiển thị Editor */}
            <div className="flex-1 overflow-y-auto">
                {renderComponent()}
            </div>
            <div className="flex flex-none flex-row w-full h-25 bg-[#6F82C7] shadow-[0_0_20px_rgba(0,0,0,1)] pt-1 pb-1 pl-5 pr-5">
                <div className="flex flex-1 flex-row items-center justify-start gap-4 overflow-x-auto scrollbar-hide">
                    {/* Nút Cài đặt - Có thể mở Modal để sửa quiz.title/description */}
                    <button onClick={() => {
                            setOnSetting(true);
                            setActiveIndex(-1);
                            setCurrentStep('setting');
                        }} 
                        className={`h-20 w-30 ${onSetting ? 'bg-[#23CBFA] border-2 border-white' : 'bg-[#4E62A8]/87'} text-xl text-white font-bold rounded-xl cursor-pointer flex-none`}>
                        Cài đặt
                    </button>

                    {
                        quiz.question.map((_: any, index: number) => (
                            <div 
                                key={index} 
                                onClick={() => {
                                    setActiveIndex(index);
                                    setCurrentStep(quiz.question[index].type || 'type-selector');
                                    setOnSetting(false);
                                }}
                                className={`h-20 w-30 text-sm text-white font-bold rounded-xl cursor-pointer flex flex-row p-1 flex-none transition-all
                                    ${activeIndex === index ? 'bg-[#23CBFA] scale-105 border-2 border-white' : 'bg-[#4E62A8]/87'}
                                `}
                            >
                                <div className="flex-none flex items-start w-8">   
                                    <p>{index + 1}</p>
                                </div>
                                <div className="flex-1 flex justify-center items-center">
                                    <div className="h-10 w-13 bg-[#3B56B4] border-black border rounded-sm">
                                        {/* Có thể hiện thumbnail ảnh ở đây */}
                                    </div>                                   
                                </div>
                            </div>
                        ))
                    }
                </div>

                <div className="h-full w-55 flex justify-between items-center flex-row flex-none ml-4">
                    <div className="text-white font-bold text-lg">
                        <p>Thêm câu hỏi <span>={">"}</span></p>
                    </div>
                    <button 
                        onClick={addNewQuestion} 
                        className="flex justify-center items-center h-13 w-13 bg-[#23CBFA] shadow-[inset_0px_-5px_4px_0px_rgba(0,0,0,0.5)] rounded-xl hover:h-14 hover:w-14 transition-all cursor-pointer"
                    >
                        <Plus className="h-7 w-7 text-white mb-1"/>
                    </button>
                </div>
            </div>
        </div>
    );
}