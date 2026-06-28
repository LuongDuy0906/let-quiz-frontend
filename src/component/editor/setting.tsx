'use client'

import { Tag, Trash, X } from "lucide-react";
import { ChangeEvent, useEffect, useRef } from "react";

interface Props {
    quiz: any
    onUpdate: (field: any) => void
}

export const SettingPage = ({quiz, onUpdate}: Props) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

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

    const handleFieldChange = (field: string, value: string ) => {
        onUpdate({[field]: value});
    }
    
    const handleRemoveImage = () => {
        onUpdate({image: ''});
    }
    
    const triggerFileInput = () => {
        fileInputRef.current?.click();
    }

    const SUGGESTIONS = ["Sport", "History", "Entertainment", "Art & Literature", "Geography", "Trivia", "Science & Nature"];

    const selectedCategories = Array.isArray(quiz.tag) ? quiz.tag : [];

    const handleAddCategory = (cat: string) => {
        if (!selectedCategories.includes(cat)) {
            const newCategories = [...selectedCategories, cat];
            onUpdate({ tag: newCategories });
        }
    };

    const handleRemoveCategory = (catToRemove: string) => {
        const newCategories = selectedCategories.filter(cat => cat !== catToRemove);
        onUpdate({ tag: newCategories });
    };

    const handleStatusChange = (status: string) => {
        onUpdate({'status': status});
    }

    useEffect(() => {
        console.log(quiz);
    })
    
    return (
        <div className="flex flex-col lg:flex-row flex-1 justify-center items-center lg:items-start gap-6 p-4 md:p-10 w-full max-w-4xl mx-auto select-none pb-24 overflow-y-auto">
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".jpg, .jpeg, .png, .svg, image/jpeg, image/png, image/svg+xml"/>
            
            {/* Left Column: Image Selector */}
            <div className="flex flex-col w-full max-w-md gap-6 flex-none">
                {
                    quiz.image === "" || !quiz.image ?
                    <div className="bg-[#92498B] w-full h-64 sm:h-96 rounded-xl flex justify-center items-center border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <button onClick={triggerFileInput} className="bg-[#b85bae] text-white border-2 border-black font-bold text-lg flex items-center justify-center w-36 h-12 rounded-xl shadow-[inset_0px_-3px_3px_0px_rgba(0,0,0,0.5)] hover:bg-[#B27EAD] active:shadow-[none] active:bg-[#B992B5] active:translate-y-[0.5] transition-all duration-300 cursor-pointer">
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
                            <img src={quiz.image} className="w-full h-full object-contain mx-auto" alt="Quiz Cover" />
                        </div>
                    </div>
                }
            </div>

            {/* Right Column: Quiz Settings Form */}
            <div className="bg-[#7A8ED4] border-4 border-black rounded-2xl p-5 flex flex-col gap-5 w-full max-w-md lg:max-w-none shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                <div className="w-full">
                    <div className="rounded-tl-md rounded-tr-xl bg-[#1877C5] h-6 w-24 flex justify-center items-center text-white font-bold text-xs uppercase tracking-wide border-2 border-black border-b-0">
                        Bộ đề
                    </div>
                    <div className="w-full">
                        <input name="" id="" value={quiz.title} className="w-full h-12 border-4 border-black bg-white rounded-b-xl rounded-tr-xl p-3 font-bold text-slate-800 focus:outline-none" onChange={(e) => handleFieldChange('title', e.target.value)}/>
                    </div>
                </div>
                <div className="w-full">
                    <div className="rounded-tl-md rounded-tr-xl bg-[#0B0B0B] h-6 w-24 flex justify-center items-center text-white font-bold text-xs uppercase tracking-wide border-2 border-black border-b-0">
                        Chú thích
                    </div>
                    <div className="w-full">
                        <textarea name="" id="" className="w-full h-22 border-4 border-black bg-white rounded-b-xl rounded-tr-xl p-3 font-bold text-slate-800 focus:outline-none"></textarea>
                    </div>
                </div>
                <div className="w-full">
                    <div className="rounded-tl-md rounded-tr-xl bg-[#0B0B0B] h-6 w-24 flex justify-center items-center text-white font-bold text-xs uppercase tracking-wide border-2 border-black border-b-0">
                        Thể loại
                    </div>
                    
                    {/* Ô hiển thị các Tag đã chọn */}
                    <div className="w-full min-h-20 border-4 border-black bg-white rounded-tr-xl p-2 flex flex-wrap gap-2 focus:outline-none">
                        {selectedCategories.length > 0 ? (
                            selectedCategories.map((cat: any, idx: number) => (
                                <div key={idx} className="bg-[#53BDDA] text-white px-3 py-1 rounded-md flex items-center gap-2 text-sm font-bold h-8 border border-black/10">
                                    {cat}
                                    <button onClick={() => handleRemoveCategory(cat)} className="hover:text-red-500 cursor-pointer">
                                        <X size={14} />
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-400 text-sm italic p-1">Chưa có thể loại nào được chọn...</p>
                        )}
                    </div>

                    {/* Phần gợi ý thể loại */}
                    <div className="w-full h-auto py-3 border-4 border-t-0 border-[#0B0B0B] bg-[#0B0B0B] rounded-b-xl px-3">
                        <p className="text-xs text-[#BFBDBD] font-black mb-2 uppercase tracking-wider">
                            Gợi ý cho bạn:
                        </p>
                        <div className="flex flex-wrap gap-2.5">
                            {SUGGESTIONS.map((cat) => (
                                <span 
                                    key={cat}
                                    onClick={() => handleAddCategory(cat)}
                                    className={`text-xs font-bold cursor-pointer transition-all
                                        ${selectedCategories.includes(cat) 
                                            ? 'text-gray-600 cursor-not-allowed no-underline' 
                                            : 'text-white underline hover:text-[#23CBFA]'}
                                    `}
                                >
                                    {cat},
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="w-full">
                    <select onChange={(e) => handleStatusChange(e.target.value)} name="" id="" className="bg-[#53BDDA] w-full h-11 border-4 border-black rounded-2xl px-5 text-white font-black text-lg focus:outline-none cursor-pointer">
                        <option value="public">Công khai</option>
                        <option value="private">Giới hạn</option>
                    </select>
                </div>
            </div>
        </div>
    )
}