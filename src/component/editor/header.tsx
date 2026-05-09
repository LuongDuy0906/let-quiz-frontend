"use client";

import { Eye } from "lucide-react";

export const Header = () => {
    return (
        <div className="flex flex-row h-auto gap-5 bg-[#4E62A8]/87 justify-center items-center p-5 shadow-[0_0_10px_rgba(0,0,0,1)] relative z-50">
            <div className="flex flex-none justify-center items-center w-md h-20">
                <img src="image/let_quiz_logo.png" className="h-full w-sm" alt="Let Quiz Logo" />
            </div>
            <div className="flex flex-1 items-center justify-start gap-6 h-20 ">
                <div className="bg-[#15A440] text-white font-bold text-2xl flex items-center justify-center w-30 h-14 rounded-2xl shadow-[inset_0px_-5px_4px_0px_rgba(0,0,0,0.5)] hover:bg-[#50CA75] active:shadow-[none] active:bg-[#62DA86] active:translate-y-[0.5] transition-all duration-300">
                    Lưu
                </div>
                <div className="flex flex-row bg-[#43569A] text-white justify-center items-center w-30 h-14 rounded-2xl gap-2 font-medium" >
                    <div>
                        <Eye />
                    </div>
                    <div>
                        Xem trước
                    </div>
                </div>
            </div>
        </div>
    )
}