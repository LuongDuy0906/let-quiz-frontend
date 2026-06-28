"use client";

import { gameSessionService } from "@/features/game-session/game-session.service";
import { useUser } from "@/providers/user.provider";
import { CircleUserRound, Link, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export const Header = () => {
    const {user, loading} = useUser();
    const router = useRouter();

    const [pinInput, setPinInput] = useState('');
    const [isVerify, setIsVerify] = useState(false);

    const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.replace(/\D/g, '');
        if (val.length <= 6) {
            setPinInput(val);
        }
    };

    const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if(e.key === 'Enter'){
            if(pinInput.length < 6){
                toast.error("Vui lòng nhập đủ mã pin với 6 chữ số");
                return;
            }

            try {
                const data = await gameSessionService.verifyRoomPin(pinInput);

                console.log(data)

                if(data === false){
                    toast.error("Mã PIN không hợp lệ");
                    return;
                }
                
                router.push(`${pinInput}`);
            } catch {
                console.log(e);
                toast.error("Lỗi khi xác thực mã PIN");
            } finally {
                setIsVerify(false);
            }
        }
    }

    return (
        <header className="flex flex-col lg:flex-row items-center justify-between gap-4 py-4 px-4 md:px-10 max-w-6xl mx-auto border-b-[#B3DFDD] border-b-2 bg-transparent select-none"> 
            <div className="flex items-center justify-center flex-none">
                <a href="/">
                    <img src="/image/let_quiz_logo.png" alt="Logo" className="h-16 md:h-20 w-auto object-contain" />
                </a>
            </div>
            
            <div className="flex flex-col sm:flex-row bg-[#7CD7F0] px-6 py-3 sm:py-2 rounded-2xl items-center gap-4 flex-1 max-w-xl w-full border-2 border-black/10">
                <div className="font-black text-lg md:text-xl text-center sm:text-right text-slate-800 uppercase tracking-wide flex-1">
                    Chơi chứ? Nhập mã PIN
                </div>
                <div className="flex items-center justify-center flex-none">
                    <input
                        type="text"
                        placeholder="123 456"
                        className="p-2 w-32 h-10 bg-white text-center text-lg font-black border-4 border-black rounded-full shadow-[inset_0px_4px_4px_0px_rgba(0,0,0,0.25)] focus:outline-none"
                        onChange={handlePinChange}
                        onKeyDown={handleKeyDown}
                        value={pinInput}
                        maxLength={6}
                        disabled={isVerify}
                    />
                </div>
            </div>
            
            <div className="flex items-center justify-center gap-4 flex-none">
                <div className="bg-white p-2.5 rounded-full border-2 border-black flex items-center justify-center hover:bg-slate-100 transition-colors cursor-pointer shadow-sm">
                    <Search className="w-5 h-5 text-black" />
                </div>
                <div className="flex items-center justify-center">
                    {
                        !user ? (
                            <button className="border-4 border-black rounded-full px-6 h-12 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25),inset_0px_-8px_4px_0px_rgba(0,0,0,0.25)] text-base font-bold text-white bg-[#801FCA] hover:bg-[#A863DD] active:shadow-none active:translate-y-1 transition-all duration-300 cursor-pointer">
                                <a href="/login">Đăng nhập</a>
                            </button>
                        ) : (
                            <a href="/profile" className="hover:scale-105 transition-transform">
                                {!user.profile.avatarUrl ? (
                                    <CircleUserRound className="w-12 h-12 text-slate-700"/>
                                ) : (
                                    <img src={user.profile.avatarUrl} alt="User Avatar" className="w-12 h-12 rounded-full border-2 border-black" />
                                )}
                            </a>
                        )
                    }
                </div>
            </div>
        </header>
    );
}