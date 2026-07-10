'use client'

import { Check, CopyPlus, Trash, X } from "lucide-react";
import React, { ChangeEvent, useEffect, useRef } from "react";

interface Props {
    question: any;
    index: number;
    onUpdate: (fields: any) => void;
    type: string;
    onDelete: (index: number) => void;
    isAiGenerated?: boolean;
}

export const QuestionEditor = ({question, index, onUpdate, type, onDelete, isAiGenerated}: Props) => {

    const fileInputRef = useRef<HTMLInputElement>(null);

    const correctOpt = question?.options?.find((opt: any) => opt?.isCorrect);

    const handleFieldChange = (field: string, value: string ) => {
        onUpdate({[field]: value});
    }

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if(file){
            const reader = new FileReader();

            reader.onloadend = () => {
                onUpdate({image: reader.result as string});
            }
            reader.readAsDataURL(file);
        }
    }

    const handleRemoveImage = () => {
        onUpdate({image: ''});
    }

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    }

    const handleOptionChange = (targetOption: any, updates: any) => {
        if (!question?.options) return;

        const updatedOptions = question.options.map((opt: any) => 
            opt === targetOption ? { ...opt, ...updates } : opt
        );

        onUpdate({ options: updatedOptions });
    };

    const handleToggleCorrect = (targetOption: any) => {
        const newOptions = question.options.map((opt: any) =>
            opt === targetOption ? { ...opt, isCorrect: !opt.isCorrect } : opt
        );
        onUpdate({ options: newOptions });
    };
    
    useEffect(() => {
        console.log(question);
    })

    return (
        <div className="flex flex-col lg:flex-row flex-1 justify-center items-center lg:items-start gap-6 p-4 md:p-10 w-full max-w-4xl mx-auto select-none pb-24 overflow-y-auto">
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".jpg, .jpeg, .png, .svg, image/jpeg, image/png, image/svg+xml"/>
            
            {/* Left Column: Image Editor & Actions */}
            <div className="flex flex-col w-full max-w-md gap-6 flex-none">
                {
                    question.image === "" || !question.image ?
                    <div className="bg-[#92498B] w-full h-64 sm:h-96 rounded-xl flex justify-center items-center border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <button onClick={triggerFileInput} className="bg-[#b85bae] text-white border-2 border-black font-bold text-lg flex items-center justify-center w-36 h-12 rounded-xl shadow-[inset_0px_-3px_3px_0px_rgba(0,0,0,0.5)] hover:bg-[#c971bf] active:shadow-[none] active:translate-y-0.5 transition-all duration-300 cursor-pointer">
                            Thêm ảnh
                        </button>
                    </div>
                    :
                    <div className="bg-[#5e3059] w-full h-64 sm:h-96 rounded-xl flex flex-col border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
                        <div className="flex flex-row flex-none w-full h-12 p-2 bg-black/20 border-b-2 border-black/10">
                            <div className="flex h-full flex-1 gap-2 justify-start items-center">
                                <button onClick={handleRemoveImage} className="bg-[#6e6d6df1] border border-black rounded-md h-8 w-8 flex justify-center items-center text-sm font-medium text-white hover:bg-red-600 transition-colors cursor-pointer"><Trash className="w-4 h-4"/></button>
                            </div>
                            <div className="flex h-full flex-1 justify-end items-center">
                                <button onClick={triggerFileInput} className="flex justify-center items-center bg-[#6e6d6df1] border border-black rounded-md h-8 w-20 hover:bg-[#a5a5a5f1] cursor-pointer">
                                    <p className="text-xs font-bold text-white">Thay đổi</p>
                                </button>
                            </div>
                        </div>
                        <div className="flex-1 w-full p-2 bg-black/10">
                            <img src={question.image} className="w-full h-full object-contain mx-auto" alt="Question" />
                        </div>
                    </div>
                }
                
                <div className="flex flex-row sm:flex-col gap-3 justify-center items-center w-full">
                    <button className="bg-black/40 hover:bg-black/60 flex flex-row justify-center items-center gap-2 text-white font-bold text-xs sm:text-sm w-full max-w-45 h-8 rounded-lg cursor-pointer border border-white/10 transition-colors">
                        <CopyPlus className="w-4 h-4" />
                        <p>Sao chép</p>
                    </button>
                    <button onClick={() => onDelete(index)} className="bg-red-950/40 hover:bg-red-950/60 flex flex-row justify-center items-center gap-2 text-red-400 font-bold text-xs sm:text-sm w-full max-w-45 h-8 rounded-lg cursor-pointer border border-red-500/20 transition-colors">
                        <Trash className="w-4 h-4" />
                        <p>Xóa câu hỏi</p>
                    </button>
                </div>
            </div>
            
            {/* Right Column: Question Details Form */}
            <div className="bg-[#7A8ED4] border-4 border-black rounded-2xl p-5 flex flex-col gap-5 w-full max-w-md lg:max-w-none shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                <div className="w-full">
                    <div className="flex flex-row justify-between items-end mb-0.5">
                        <div className="rounded-tl-md rounded-tr-xl bg-[#1877C5] h-6 w-24 flex justify-center items-center text-white font-bold text-xs uppercase tracking-wide border-4 border-black border-b-0">
                            Câu hỏi
                        </div>
                        {isAiGenerated && (
                            <span className="bg-purple-600 px-3 py-0.5 text-white font-bold text-[10px] uppercase tracking-wide rounded-t-md border-2 border-black border-b-0">
                                AI khởi tạo
                            </span>
                        )}
                    </div>
                    <div className="w-full">
                        <input name="" id="" value={question.content} className="w-full h-12 border-4 border-black bg-white rounded-b-xl rounded-tr-xl p-3 font-bold text-slate-800 focus:outline-none" onChange={(e) => handleFieldChange('content', e.target.value)}/>
                    </div>
                </div>
                {
                    type === 'single' ?
                    <div className="flex flex-col gap-5 w-full">
                        <div className="w-full">
                            <div className="rounded-tl-md rounded-tr-xl bg-[#18C574] h-6 w-28 flex justify-center items-center text-white font-bold text-xs uppercase tracking-wide border-2 border-[#18C574] border-b-0">
                                Đáp án đúng
                            </div>
                            <div className="w-full">
                                <input value={correctOpt?.content} className="w-full h-11 border-4 border-[#18C574] bg-white rounded-b-xl rounded-tr-xl p-3 font-bold text-slate-800 focus:outline-none" onChange={(e) => handleOptionChange(correctOpt, { content: e.target.value })}/>
                            </div>
                        </div>
                        <div className="w-full">
                            <div className="rounded-tl-md rounded-tr-xl bg-[#DE1D20] h-6 w-28 flex justify-center items-center text-white font-bold text-xs uppercase tracking-wide border-2 border-[#DE1D20] border-b-0">
                                Đáp án sai
                            </div>
                            <div className="flex flex-col w-full">
                                {
                                    question.options
                                        .filter((opt: any) => !opt?.isCorrect)
                                            .map((item: any, index: number, filteredArray: any[]) => (
                                                <div key={index} className="w-full">
                                                    <input value={item.content} onChange={(e) => handleOptionChange(item, { content: e.target.value })} className={`w-full h-11 border-4 border-[#DE1D20] bg-white ${index === 2 ? "rounded-tr-xl rounded-b-xl" : "rounded-tr-xl rounded-br-xl"} p-3 font-bold text-slate-800 focus:outline-none`}></input>
                                                </div>
                                            ))
                                }
                            </div>
                        </div>
                    </div>
                    :
                    <div className="flex flex-col w-full">
                        <div className="rounded-tl-md rounded-tr-xl bg-[#3A3C3B] h-6 w-24 flex justify-center items-center text-white font-bold text-xs uppercase tracking-wide border-4 border-black border-b-0">
                            Đáp án
                        </div>
                        <div className="flex flex-col w-full">
                            {
                                question.options.map((item: any, index: number) => {
                                    const isCorrect = item.isCorrect === true;
                                    return (
                                        <div key={index} className="flex flex-row w-full items-stretch">
                                            <div className="w-12 flex-none">
                                                <button onClick={() => handleToggleCorrect(item)} className={`flex justify-center items-center font-black text-white w-full h-full ${isCorrect ? 'bg-[#18C574]' : 'bg-[#DE1D20]'} border-4 border-r-2 border-black ${index === 3 ? "rounded-bl-xl" : ""} shadow-[inset_0px_-3px_3px_0px_rgba(0,0,0,0.4)] cursor-pointer`}>
                                                    {
                                                        isCorrect ? <Check className="w-5 h-5"/> : <X className="w-5 h-5" />
                                                    }
                                                </button>
                                            </div>
                                            <input onChange={(e) => handleOptionChange(item, {content: e.target.value})} placeholder={item.content} value={item.content} className={`flex-1 w-full h-12 border-4 border-l-2 border-black bg-white rounded-r-xl p-3 font-bold text-slate-800 focus:outline-none`} />
                                        </div>
                                    );
                                })
                            }
                        </div>
                    </div>
                }
                
                <div className="w-full">
                    <div className="rounded-tl-md rounded-tr-xl bg-[#0B0B0B] h-6 w-24 flex justify-center items-center text-white font-bold text-xs uppercase tracking-wide border-2 border-black border-b-0">
                        Thông tin
                    </div>
                    <div className="w-full">
                        <textarea name="" id="" placeholder={question.information} value={question.information || ""} className="w-full h-20 border-4 border-black bg-white rounded-b-xl rounded-tr-xl p-3 font-bold text-slate-800 focus:outline-none" onChange={(e) => handleFieldChange('information', e.target.value)}></textarea>
                    </div>
                </div>
            </div>
        </div>
    )
}