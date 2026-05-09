"use client";

import BaseInput from "@/component/base-input";
import { authService } from "@/features/auth/auth.service";
import { useUser } from "@/providers/user.provider";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Login() {
    const router = useRouter();
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const {refreshProfile} = useUser();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isLogin) {
            const response = await authService.login(email, password);
            await refreshProfile();
            router.push('/')
        } else {
            const response = await authService.register(email, username, password);
            router.push('/')
        }
    }

    return (
        <div className="flex items-center justify-center pl-56 pr-56 pt-14">
            <form onSubmit={handleSubmit} className={`bg-gray-200 grid ${isLogin ? 'grid-rows-[80px_90px_100px_110px_80px_70px]' : 'grid-rows-[80px_90px_100px_110px_110px_70px_70px]'} gap-3 w-full h-fit p-12 mr-96 ml-96 rounded-4xl`}>
                <div >
                    <h1 className="text-4xl font-bold text-center">
                        {
                            isLogin ? "Đăng nhập" : "Đăng ký"
                        }
                    </h1>
                </div>
                <div className="flex justify-center">
                    <button className="bg-[#FFFCEB] h-14 w-full rounded-2xl shadow-[0px_10px_4px_0px_rgba(0,0,0,0.25)] text-xl font-bold text-[#801FCA] hover:bg-[#FFFCEB] active:shadow-[none] active:bg-[#FFFCEB] active:translate-y-[0.5]transition-all duration-300 grid grid-cols-[90px_1fr] gap-3">
                        <div className="flex items-center justify-end">
                            <img src="/image/channels4_profile-removebg-preview.png" alt="Google" className="h-6 w-6" />
                        </div>
                        <div className="flex items-center justify-center">
                            <p className="text-black font-bold text-2xl">Tiếp tục với Google</p>
                        </div>
                    </button>
                </div>
                <div>
                    <label className="text-xl text-[#666464] font-medium">
                        {
                            isLogin ? "Hoặc đăng nhập với Email" : "Hoặc đăng ký với Email"
                        }
                    </label>
                    <BaseInput type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} isReadonly={false}/>
                </div>
                {
                    !isLogin && 
                    <div>
                        <label className="text-xl text-[#666464] font-medium">Tên người dùng</label>
                        <BaseInput type="text" placeholder="Tên người dùng" onChange={(e) => setUsername(e.target.value)} isReadonly={false}/>
                    </div>
                }
                <div>
                    <div className={`flex gap-3 ${!isLogin ? 'justify-between' : ''}`}>
                        {
                            !isLogin && <label className="flex-1 text-xl text-[#666464] font-medium">Mật khẩu</label>
                        }
                        <p className={`${!isLogin ? 'flex-none' : 'flex-none'} text-xl text-[#666464] font-medium`}>Hiện thị mật khẩu</p>
                        <input type="checkbox" className="flex-initial w-6 h-6 accent-gray-400" checked={showPassword} onChange={() => setShowPassword(!showPassword)}/>
                    </div>
                    <BaseInput type={`${showPassword ? 'text' : 'password'}`} placeholder="Mật khẩu" onChange={(e) => setPassword(e.target.value)} isReadonly={false}/>
                </div>
                <div>
                    <button type="submit" className="bg-[#15A440] text-white font-bold text-2xl flex items-center justify-center w-full h-14 rounded-2xl shadow-[inset_0px_-5px_4px_0px_rgba(0,0,0,0.5)] hover:bg-[#50CA75] active:shadow-[none] active:bg-[#62DA86] active:translate-y-[0.5] transition-all duration-300">
                        {
                            isLogin ? "Đăng nhập" : "Đăng ký"
                        }
                    </button>
                </div>
                <div className={`flex ${isLogin ? 'items-end justify-between' : 'items-center justify-center'}`}>
                    <p className="text-[#666464] text-xl font-medium">
                        {
                            !isLogin ? "Có rồi ư? " : "Không có ư? "
                        }
                        <span onClick={() => setIsLogin(!isLogin)} className="hover:underline hover:cursor-pointer">
                            {
                                !isLogin ? "Đăng nhập ngay" : "Đăng ký ngay"
                            }
                        </span>
                    </p>
                    {
                        isLogin && <a href="" className="text-[#666464] text-xl font-medium">Quên mật khẩu</a>
                    }
                </div>
            </form>
        </div>
    );
}