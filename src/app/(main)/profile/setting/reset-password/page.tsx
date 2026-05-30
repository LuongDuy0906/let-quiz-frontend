'use client'

import BaseInput from "@/component/base-input";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { authService } from "@/features/auth/auth.service";
import { useUser } from "@/providers/user.provider";

export default function ResetPasswordPage() {
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const { setUser } = useUser();
    const searchParams = useSearchParams();
    const router = useRouter();

    const email = searchParams.get('email') || "";
    const token = searchParams.get('token') || "";

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!password) {
            alert("Vui lòng nhập mật khẩu mới");
            return;
        }

        setIsSubmitting(true);
        try {
            const result = await authService.changePassword(email, token, password);
            
            if (result?.success) {
                alert("Đổi mật khẩu thành công! Hệ thống sẽ đăng xuất để bạn đăng nhập lại bằng mật khẩu mới.");

                localStorage.removeItem('accessToken'); 
                setUser(null); 

                router.push('/login');
            } else {
                alert(result?.message || "Có lỗi xảy ra, vui lòng thử lại.");
            }
        } catch (error) {
            console.error("Lỗi đổi mật khẩu:", error);
            alert("Lỗi kết nối đến server.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="flex flex-col gap-7 justify-center items-center p-10">
            <h1 className="text-3xl font-bold">Thay đổi mật khẩu</h1>
            
            <form onSubmit={handleChangePassword} className="flex flex-col items-start w-xl">
                <label className="font-bold">Nhập mật khẩu mới</label>
                
                <BaseInput 
                    type="password" 
                    placeholder="Mật khẩu mới" 
                    onChange={(e) => setPassword(e.target.value)} 
                    value={password}
                    isReadonly={false}
                />

                <button 
                    type='submit' 
                    disabled={isSubmitting}
                    className="bg-[#3B64EA] hover:bg-[#7F99EE] text-white text-lg font-semibold py-3 px-6 rounded-xl transition-all cursor-pointer mt-5 disabled:bg-gray-400"
                >
                    {isSubmitting ? "Đang xử lý..." : "Cập nhật"}
                </button>
            </form>
        </div>
    )
}