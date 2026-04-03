"use client";

import { CircleUserRound, Search } from "lucide-react";
import { useEffect, useState } from "react";

export const Header = () => {
   const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const storedToken = localStorage.getItem('accessToken');
        setToken(storedToken);
    }, []);

    return (
        <header className="grid grid-cols-[300px_1fr_300px] h-40 ml-50 mr-50 border-b-[#B3DFDD] border-b-2"> 
            <div className="flex items-center justify-center">
                <a href="/"><img src="/image/let_quiz_logo.png" alt="Logo" className="h-35" /></a>
            </div>
            <div className="grid grid-cols-2 gap-10 bg-[#7CD7F0] m-6 rounded-2xl">
                <div className= "font-bold text-3xl text-center flex items-center justify-end">
                    Chơi chứ ? Nhập mã PIN
                </div>
                <div className="flex items-center justify-start">
                    <input
                        type="text"
                        placeholder="123 456"
                        className="p-2 w-fit h-15 bg-white text-center text-xl border-4 border-black-300 rounded-full shadow-[inset_0px_8px_4px_0px_rgba(0,0,0,0.25)] focus:outline-none"
                    />
                </div>
            </div>
            <div className="p-4 grid grid-cols-[80px_1fr] gap-5">
                <div className="flex items-center justify-center">
                    <div className="bg-white p-3 rounded-full flex items-center justify-center">
                        <Search className="w-full h-full"></Search>
                    </div>
                </div>
                <div className="flex items-center justify-center">
                    {
                        !token ? (
                            <button className="border-4 border-black rounded-full w-full h-14 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25),inset_0px_-8px_4px_0px_rgba(0,0,0,0.25)] text-xl font-bold text-white bg-[#801FCA] hover:bg-[#A863DD] active:shadow-[none] active:bg-[#A863DD] active:translate-y-[0.5]transition-all duration-300">
                                <a href="/login">Đăng nhập</a>
                            </button>
                        ) : (
                            <CircleUserRound  className="w-16 h-16"/>
                        )
                    }
                </div>
            </div>
        </header>
    );
}