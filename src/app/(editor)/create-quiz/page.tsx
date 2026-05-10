'use client'

import { QuizSelector } from "@/component/editor/quiz-selector";
import { QuestionEditor} from "@/component/editor/question-editor";
import { TypeSelector } from "@/component/editor/type-seletor";
import { createDefaultQuestion, EditorStep } from "@/constants/constants";
import { Plus } from "lucide-react";
import { useState } from "react";

export default function CreateQuizPage() {
    const [currentStep, setCurrentStep] = useState<EditorStep>('type-selector');
    const [activeIndex, setActiveIndex] = useState(0);
    const [quizMetadata, setQuizMetadata] = useState({ title: 'required', description: '' });
    const [questions, setQuestions] = useState<any>([createDefaultQuestion('single-choice')]);

    // --- HANDLERS (LOGIC CẬP NHẬT TỪ CON LÊN CHA) ---
    const handleUpdateQuestion = (index: number, updatedFields: any) => {
        setQuestions((prev: any) => {
            const newQuestions = [...prev];
            newQuestions[index] = { ...newQuestions[index], ...updatedFields };
            return newQuestions;
        });
    };

    const addNewQuestion = () => {
        const newEmptyQ = createDefaultQuestion();
        const newIndex = questions.length;
        
        setQuestions((prev: any) => [...prev, newEmptyQ]);
        
        setActiveIndex(newIndex);
        
        setCurrentStep('type-selector');
    };

    const selectTypeAndAdd = (type: 'single-choice' | 'multiple-choice') => {
        const defaultData = createDefaultQuestion(type);
        
        handleUpdateQuestion(activeIndex, {
            ...defaultData
        });

        setCurrentStep(type);
    };

    const renderComponent = () => {
        switch (currentStep) {
            case 'type-selector':
                return <TypeSelector onSelect={selectTypeAndAdd}/>
            case 'single-choice':
                return <QuestionEditor question={questions[activeIndex]} index={activeIndex} onUpdate={(fields) => handleUpdateQuestion(activeIndex, fields)} type="single-choice" />
            case 'multiple-choice':
                return <QuestionEditor question={questions[activeIndex]} index={activeIndex} onUpdate={(fields) => handleUpdateQuestion(activeIndex, fields)} type="multiple-choice" />
        }
    }

    return (
        <div className="flex flex-col flex-1 pt-15">
            {
                renderComponent()
            }
            <div className="flex flex-none flex-row w-full h-25 bg-[#6F82C7] shadow-[0_0_20px_rgba(0,0,0,1)] pt-1 pb-1 pl-5 pr-5">
                <div className="flex flex-1 flex-row items-center justify-start gap-4">
                    <button className="h-20 w-30 bg-[#4E62A8]/87 text-xl text-white font-bold rounded-xl cursor-pointer">
                        Cài đặt
                    </button>
                    {
                        questions.map((item: any, index: number) => (
                            <div key={index} className="h-20 w-30 bg-[#4E62A8]/87 text-sm text-white font-bold rounded-xl cursor-pointer flex flex-row p-1">
                                <div className="flex-none flex items-start w-8">   
                                    <p>{index + 1}</p>
                                </div>
                                <div className="flex-1">
                                    <div className="h-10 w-13 bg-[#3B56B4] border-black border">

                                    </div>                                   
                                </div>

                            </div>
                        ))
                    }
                </div>
                <div className="h-full w-55 flex justify-between items-center flex-row">
                    <div className="text-white font-bold text-lg">
                        <p>Thêm câu hỏi <span>={">"}</span></p>
                    </div>
                    <button onClick={addNewQuestion} className="flex justify-center items-center h-13 w-13 bg-[#23CBFA] shadow-[inset_0px_-5px_4px_0px_rgba(0,0,0,0.5)] rounded-xl hover:h-15 hover:w-15 transition-all cursor-pointer">
                        <Plus className="h-7 w-7 text-white mb-1"/>
                    </button>
                </div>
            </div>
        </div>
    );
}