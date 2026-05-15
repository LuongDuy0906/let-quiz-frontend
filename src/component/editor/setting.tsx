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
        <div className="flex flex-row flex-1 justify-center items-start gap-5 pt-10">
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".jpg, .jpeg, .png, .svg, image/jpeg, image/png, image/svg+xml"/>
            {
                quiz.image === "" || !quiz.image ?
                <div className="bg-[#92498B] w-md h-96 rounded-xl flex justify-center items-center">
                    <button onClick={triggerFileInput} className="bg-[#b85bae] text-white border border-black font-medium text-xl flex items-center justify-center w-45 h-12 rounded-2xl shadow-[inset_0px_-5px_4px_0px_rgba(0,0,0,0.5)] hover:bg-[#B27EAD] active:shadow-[none] active:bg-[#B992B5] active:translate-y-[0.5] transition-all duration-300">
                        Thêm ảnh
                    </button>
                </div>
                :
                <div className="bg-[#5e3059] w-md h-96 rounded-xl flex flex-col">
                    <div className="flex flex-row flex-none w-full h-15 p-2">
                        <div className="flex h-full flex-1 gap-2 justify-start items-center">
                            <button onClick={handleRemoveImage} className="bg-[#6e6d6df1] rounded-md h-10 w-10 flex justify-center items-center text-sm font-medium text-white hover:bg-[#a5a5a5f1]"><Trash/></button>
                        </div>
                        <div className="flex h-full flex-1 justify-end items-center">
                            <button onClick={triggerFileInput} className="flex justify-center items-center bg-[#6e6d6df1] rounded-md h-10 w-25 hover:bg-[#a5a5a5f1]">
                                <p className="text-sm font-medium text-white ">Thay đổi</p>
                            </button>
                        </div>
                    </div>
                    <div className="flex-1 w-full p-2">
                        <img src={quiz.image} className="w-full h-full" alt="" />
                    </div>
                </div>
            }
            <div className="bg-[#7A8ED4] rounded-xl p-5 flex flex-col gap-5">
                <div>
                    <div className="rounded-tl-md rounded-tr-xl bg-[#1877C5] h-6 w-25 flex justify-center items-center text-white font-medium text-sm">
                        Bộ đề
                    </div>
                    <div>
                        <input name="" id="" value={quiz.title} className="w-md h-12 border-5 border-[#1877C5] bg-white rounded-b-md rounded-tr-md p-2" onChange={(e) => handleFieldChange('title', e.target.value)}/>
                    </div>
                </div>
                <div>
                    <div className="rounded-tl-md rounded-tr-xl bg-[#0B0B0B] h-6 w-25 flex justify-center items-center text-white font-medium text-sm">
                        Chú thích
                    </div>
                    <div>
                        <textarea name="" id="" className="w-md h-22 border-5 border-[#0B0B0B] bg-white rounded-b-md rounded-tr-md p-2"></textarea>
                    </div>
                </div>
                <div>
                    <div className="rounded-tl-md rounded-tr-xl bg-[#0B0B0B] h-6 w-25 flex justify-center items-center text-white font-medium text-sm">
                        Thể loại
                    </div>
                    
                    {/* Ô hiển thị các Tag đã chọn */}
                    <div className="w-md min-h-25 border-5 border-[#0B0B0B] bg-white rounded-tr-md p-2 flex flex-wrap gap-2">
                        {selectedCategories.length > 0 ? (
                            selectedCategories.map((cat: any, idx: number) => (
                                <div key={idx} className="bg-[#53BDDA] text-white px-3 py-1 rounded-md flex items-center gap-2 text-sm font-bold h-10">
                                    {cat}
                                    <button onClick={() => handleRemoveCategory(cat)} className="hover:text-red-500 cursor-pointer">
                                        <X size={14} />
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-400 text-sm italic">Chưa có thể loại nào được chọn...</p>
                        )}
                    </div>

                    {/* Phần gợi ý thể loại */}
                    <div className="w-md h-auto py-3 border-[#0B0B0B] bg-[#0B0B0B] rounded-b-md px-2">
                        <p className="text-xs text-[#BFBDBD] font-medium mb-2 uppercase tracking-wider">
                            Gợi ý cho bạn:
                        </p>
                        <div className="flex flex-wrap gap-3">
                            {SUGGESTIONS.map((cat) => (
                                <span 
                                    key={cat}
                                    onClick={() => handleAddCategory(cat)}
                                    className={`text-sm font-medium cursor-pointer transition-all
                                        ${selectedCategories.includes(cat) 
                                            ? 'text-gray-600 cursor-not-allowed' 
                                            : 'text-white underline hover:text-[#23CBFA]'}
                                    `}
                                >
                                    {cat} ,
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
                <div>
                    <select onChange={(e) => handleStatusChange(e.target.value)} name="" id="" className="bg-[#53BDDA] w-md h-10 rounded-2xl px-5 pb-1 text-white font-medium text-xl">
                        <option value="public">Công khai</option>
                        <option value="private">Giới hạn</option>
                    </select>
                </div>
            </div>
        </div>
    )
}