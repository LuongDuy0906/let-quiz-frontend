'use client'

import { useUser } from "@/providers/user.provider";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { authService } from "@/features/auth/auth.service";

function DeleteAccountContent() {
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [message, setMessage] = useState("");
    const { setUser } = useUser();
    const router = useRouter();
    const searchParams = useSearchParams();

    const email = searchParams.get('email') || '';
    const token = searchParams.get('token') || '';

    const performDelete = async () => {
            if (!email || !token) {
                setStatus("error");
                setMessage("Thông tin xác thực không hợp lệ.");
                return;
            }

            console.log("Gửi yêu cầu xóa tài khoản với email:", email, "và token:", token);

            try {
                // Giả sử bạn có hàm này trong userService
                const response = await authService.deleteAccount(email, token);
                
                if (response.success) {
                    setStatus("success");
                    localStorage.removeItem('accessToken');
                    setUser(null);
                    
                    setTimeout(() => {
                        router.push('/');
                    }, 3000);
                } else {
                    setStatus("error");
                    setMessage(response.message || "Không thể xóa tài khoản.");
                }
            } catch (error) {
                setStatus("error");
                setMessage("Lỗi kết nối hệ thống.");
            }
        };

    useEffect(() => {        
        performDelete();
    }, [email, token, router, setUser]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-10 gap-4">
            {/* HIỆU ỨNG LOADING */}
            {status === "loading" && (
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                    <h1 className="text-2xl font-bold text-gray-700">Đang xử lý xóa tài khoản...</h1>
                    <p className="text-gray-500 text-sm">Vui lòng đợi trong giây lát</p>
                </div>
            )}

            {/* TRẠNG THÁI THÀNH CÔNG */}
            {status === "success" && (
                <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-500">
                    <CheckCircle2 className="w-16 h-16 text-green-500" />
                    <h1 className="text-3xl font-bold text-green-600">Xóa tài khoản thành công</h1>
                    <p className="text-gray-500 text-center">
                        Mọi dữ liệu của bạn đã được gỡ bỏ. <br />
                        Hệ thống sẽ tự động chuyển hướng về trang chủ...
                    </p>
                </div>
            )}

            {/* TRẠNG THÁI LỖI */}
            {status === "error" && (
                <div className="flex flex-col items-center gap-4 animate-in slide-in-from-bottom-4 duration-500">
                    <XCircle className="w-16 h-16 text-red-500" />
                    <h1 className="text-2xl font-bold text-red-600">Thao tác thất bại</h1>
                    <p className="text-gray-600 font-medium">{message}</p>
                    <button 
                        onClick={() => router.push('/')}
                        className="mt-4 bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-black transition-all"
                    >
                        Quay lại trang chủ
                    </button>
                </div>
            )}
        </div>
    );
}

// COMPONENT CHÍNH BẮT BUỘC PHẢI CÓ SUSPENSE
export default function DeleteAccountPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-10 h-10 text-gray-300 animate-spin" />
            </div>
        }>
            <DeleteAccountContent />
        </Suspense>
    );
}