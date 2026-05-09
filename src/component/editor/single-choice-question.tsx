'use client'

import { CopyPlus, Trash } from "lucide-react";
import { useEffect } from "react";

interface Props {
    question: any;
    index: number;
    onUpdate: (fields: any) => void;
}

export const SingleChoiceQuestion = ({question, index, onUpdate}: Props) => {
    useEffect(() => {
        console.log(question);
    }, [])
    return (
        <div className="flex flex-row flex-1 justify-center items-start gap-5">
            <div className="grid grid-rows-[1fr_250px] w-md gap-10">
                <div className="bg-[#92498B] w-md h-80 rounded-xl flex justify-center items-center">
                    <button className="bg-[#92498B] text-gray-400 border border-black font-medium text-xl flex items-center justify-center w-45 h-12 rounded-2xl shadow-[inset_0px_-5px_4px_0px_rgba(0,0,0,0.5)] hover:bg-[#50CA75] active:shadow-[none] active:bg-[#62DA86] active:translate-y-[0.5] transition-all duration-300">
                        Thêm ảnh
                    </button>
                </div>
                <div className="flex flex-col gap-5 justify-start items-center">
                    <button className="bg-[#040404]/42 flex flex-row justify-center items-center gap-3 text-white font-medium text-sm w-xs h-7 rounded-xl">
                        <CopyPlus />
                        <p>Sao chép</p>
                    </button>
                    <button className="bg-[#040404]/42 flex flex-row justify-center items-center gap-3 text-red-500 font-medium text-sm w-xs h-7 rounded-xl">
                        <Trash />
                        <p>Xóa câu hỏi</p>
                    </button>
                </div>
            </div>
            <div className="bg-[#7A8ED4] rounded-xl p-5 flex flex-col gap-5">
                <div>
                    <div className="rounded-tl-md rounded-tr-xl bg-[#1877C5] h-6 w-25 flex justify-center items-center text-white font-medium text-sm">
                        Câu hỏi
                    </div>
                    <div>
                        <input name="" id="" placeholder={question.content} className="w-md h-13 border-5 border-[#1877C5] bg-white rounded-b-md rounded-tr-md p-2" />
                    </div>
                </div>
                <div className="">
                    <div className="rounded-tl-md rounded-tr-xl bg-[#18C574] h-6 w-25 flex justify-center items-center text-white font-medium text-sm">
                        Đáp án đúng
                    </div>
                    <div>
                        <input placeholder={question.option.find((opt: any) => opt.isCorrect)?.content || "Nhập đáp án đúng"} className="w-md h-11 border-5 border-[#18C574] bg-white rounded-b-md rounded-tr-md p-2"></input>
                    </div>
                </div>
                <div>
                    <div className="rounded-tl-md rounded-tr-xl bg-[#DE1D20] h-6 w-25 flex justify-center items-center text-white font-medium text-sm">
                        Đáp án sai
                    </div>
                    <div>
                        {
                            question.option
                                .filter((opt: any) => !opt.isCorrect)
                                    .map((item: any, index: number, filteredArray: any[]) => (
                                        <div key={index}>
                                            <input placeholder={item.content} className={`w-md h-11 border-5 border-[#DE1D20] bg-white ${index === filteredArray.length - 1 ? 'rounded-b-md rounded-tr-md' : 'rounded-br-md rounded-tr-md'}  p-2`}></input>
                                        </div>
                                    ))
                        }
                    </div>
                </div>
                <div>
                    <div className="rounded-tl-md rounded-tr-xl bg-[#0B0B0B] h-6 w-25 flex justify-center items-center text-white font-medium text-sm">
                        Giải thích
                    </div>
                    <div>
                        <textarea name="" id="" placeholder={question.content} className="w-md h-20 border-5 border-[#0B0B0B] bg-white rounded-b-md rounded-tr-md p-2"></textarea>
                    </div>
                </div>
            </div>
        </div>
    )
}