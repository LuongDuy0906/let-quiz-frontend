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
        const val = e.target.value.replace(/\D/g, ''); // Chỉ cho phép nhập số
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
                const data = await gameSessionService.getSessionId(pinInput);

                if(data?.sessionId){
                    sessionStorage.setItem(`room_quiz:${data?.sessionId}`, pinInput);
                    router.push(`play/${data?.sessionId}`);
                }
            } catch {
                console.log(e);
                toast.error("Lỗi khi xác thực mã PIN");
            } finally {
                setIsVerify(false);
            }
        }
    }

    return (
        <header className={`grid ${user ? 'grid-cols-[300px_1fr_200px]' : 'grid-cols-[300px_1fr_300px]' } h-40 ml-50 mr-50 border-b-[#B3DFDD] border-b-2`}> 
            <div className="flex items-center justify-center">
                <a href="/"><img src="/image/let_quiz_logo.png" alt="Logo" className="h-35" /></a>
            </div>
            <div className="grid grid-cols-2 bg-[#7CD7F0] m-6 rounded-2xl">
                <div className= "font-bold text-3xl text-center flex items-center justify-end">
                    Chơi chứ ? Nhập mã PIN
                </div>
                <div className="flex items-center justify-center">
                    <input
                        type="text"
                        placeholder="123 456"
                        className="p-2 w-fit h-15 bg-white text-center text-xl border-4 border-black-300 rounded-full shadow-[inset_0px_8px_4px_0px_rgba(0,0,0,0.25)] focus:outline-none"
                        onChange={handlePinChange}
                        onKeyDown={handleKeyDown}
                        value={pinInput}
                        maxLength={6}
                        disabled={isVerify}
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
                        !user ? (
                            <button className="border-4 border-black rounded-full w-full h-14 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25),inset_0px_-8px_4px_0px_rgba(0,0,0,0.25)] text-xl font-bold text-white bg-[#801FCA] hover:bg-[#A863DD] active:shadow-none active:translate-y-1 transition-all duration-300">
                                    <a href="/login">Đăng nhập</a>
                            </button>
                        ) : (
                            <a href="/profile">
                                {!user.profile.avatarUrl ? (
                                    <CircleUserRound  className="w-16 h-16"/>
                                ) : (
                                    <img src={user.profile.avatarUrl} alt="User Avatar" className="w-16 h-16 rounded-full" />
                                )}
                            </a>
                        )
                    }
                </div>
            </div>
        </header>
    );
}