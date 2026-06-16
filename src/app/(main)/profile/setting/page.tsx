"use client";

import BaseInput from "@/component/base-input";
import { authService } from "@/features/auth/auth.service";
import { userService } from "@/features/user/user.service";
import { useUser } from "@/providers/user.provider";
import { CircleUserRound, Camera, Loader2, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";

export default function SettingPage() {
    const { user, setUser } = useUser();
    const router = useRouter();
    
    // State cho Form Profile (Username)
    const [username, setUsername] = useState("");
    const [isProfileUpdating, setIsProfileUpdating] = useState(false);
    const [isResettingPassword, setIsResettingPassword] = useState(false);
    const [isDeleteAccount, setIsDeleteAccount] = useState(false);

    // State cho Form Avatar (Debounce)
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [saveStatus, setSaveStatus] = useState<"idle" | "waiting" | "saving" | "saved">("idle");

    const fileInputRef = useRef<HTMLInputElement>(null);
    const debounceTimer = useRef<NodeJS.Timeout | null>(null);
    const pendingFile = useRef<File | null>(null);

    // Đồng bộ dữ liệu ban đầu khi user đã load xong
    useEffect(() => {
        if (user?.profile?.username) {
            setUsername(user.profile.username);
        }
    }, [user]);

    // --- LOGIC 1: CẬP NHẬT AVATAR (TỰ ĐỘNG SAU 5S) ---
    const performAvatarSave = async () => {
        if (!pendingFile.current) return;

        setSaveStatus("saving");
        try {
            // Gọi service với field 'image' khớp NestJS
            const updatedUser = await userService.updateAvatar(pendingFile.current);
            if (updatedUser) {
                setUser(updatedUser);
                setSaveStatus("saved");
                setTimeout(() => setSaveStatus("idle"), 3000);
            }
            pendingFile.current = null;
        } catch (error) {
            console.error("Lỗi lưu ảnh:", error);
            setSaveStatus("idle");
            alert("Lỗi khi tự động lưu ảnh đại diện.");
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const objectUrl = URL.createObjectURL(file);
        setPreviewImage(objectUrl);
        pendingFile.current = file;
        setSaveStatus("waiting");

        if (debounceTimer.current) clearTimeout(debounceTimer.current);
        
        debounceTimer.current = setTimeout(() => {
            performAvatarSave();
        }, 5000);
    };

    // --- LOGIC 2: CẬP NHẬT PROFILE (BẤM NÚT LƯU) ---
    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!username || isProfileUpdating) return;

        setIsProfileUpdating(true);
        try {
            // Gửi dưới dạng Object { username } để tránh bị undefined ở backend
            const updatedUser = await userService.updateProfile(username);
            if (updatedUser) {
                setUser(updatedUser);
            }
        } catch (error) {
            console.error("Lỗi cập nhật profile:", error);
        } finally {
            setIsProfileUpdating(false);
        }
    };

    // --- LOGIC 3: GỬI YÊU CẦU ĐỔI MẬT KHẨU ---
    const handleResetPassword = async () => {
        if (!user?.email || isResettingPassword) return;

        setIsResettingPassword(true);
        try {
            await authService.forgotPassword(user.email);
            alert("Yêu cầu thay đổi mật khẩu đã được gửi thành công! Hãy kiểm tra hòm thư của bạn.");
        } catch (error) {
            alert("Có lỗi xảy ra khi gửi yêu cầu đổi mật khẩu.");
        } finally {
            setIsResettingPassword(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!user?.email || isDeleteAccount) return;

        setIsDeleteAccount(true);

        try{
            await authService.sendDeleteAccount(user.email);
            alert("Yêu cầu xoá tài khoản đã được gửi thành công! Hãy kiểm tra hòm thư của bạn.");
        } catch (error) {
            alert("Có lỗi xảy ra khi gửi yêu cầu xoá tài khoản.");
        } finally {
            setIsDeleteAccount(false);
        }
    }

    // --- LOGIC 4: ĐĂNG XUẤT ---
    const handleLogOut = async () => {
        try {
             await authService.logout();
        } finally {
            localStorage.clear();
            setUser(null);
            window.location.href = '/';
        }
    };

    // Dọn dẹp bộ nhớ URL preview
    useEffect(() => {
        return () => {
            if (previewImage) URL.revokeObjectURL(previewImage);
        };
    }, [previewImage]);

    return (
        <div className="flex flex-col gap-10 justify-center items-center p-10 min-h-screen">
            
            {/* BOX 1: FORM AVATAR (TỰ ĐỘNG LƯU) */}
            <div className="flex flex-col items-center p-8 border rounded-2xl bg-[#DFDDDD] shadow-lg w-full max-w-xl">
                <h2 className="text-xl font-bold mb-6 text-gray-800">Ảnh đại diện</h2>
                
                <div className="flex flex-col items-center gap-6">
                    <div className="relative group">
                        <div 
                            className="rounded-full h-44 w-44 overflow-hidden border-4 border-gray-100 shadow-sm bg-gray-100 flex items-center justify-center cursor-pointer relative"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            {(previewImage || user?.profile?.avatarUrl) ? (
                                <img 
                                    src={previewImage || user?.profile?.avatarUrl} 
                                    alt="Avatar" 
                                    className="h-full w-full object-cover" 
                                />
                            ) : (
                                <CircleUserRound className="h-32 w-32 text-gray-400" />
                            )}
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Camera className="text-white w-8 h-8" />
                            </div>
                        </div>

                        {/* Status Badge */}
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap z-10">
                            {saveStatus === "waiting" && (
                                <div className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-[10px] font-bold border border-amber-200 animate-pulse">
                                    Sẽ tự lưu sau 5s...
                                </div>
                            )}
                            {saveStatus === "saving" && (
                                <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-[10px] font-bold border border-blue-200 flex items-center gap-1">
                                    <Loader2 className="w-3 h-3 animate-spin" /> Đang lưu...
                                </div>
                            )}
                            {saveStatus === "saved" && (
                                <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-bold border border-green-200 flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3" /> Đã lưu!
                                </div>
                            )}
                        </div>
                    </div>

                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        className="hidden" 
                        accept="image/*" 
                    />

                    <button 
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-[#3B64EA] hover:bg-[#7F99EE] text-white font-semibold py-2 px-6 rounded-full text-sm transition-all cursor-pointer"
                    >
                        Thay đổi ảnh
                    </button>
                </div>
            </div>

            {/* BOX 2: FORM THÔNG TIN (SUBMIT THỦ CÔNG) */}
            <div className="flex flex-col p-8 border rounded-2xl bg-[#DFDDDD] shadow-lg w-full max-w-xl">
                <h2 className="text-xl font-bold mb-6 text-gray-800">Thông tin cá nhân</h2>
                
                <form className="flex flex-col gap-6" onSubmit={handleProfileSubmit}>
                    <div className="w-full">
                        <label className="text-xs font-bold text-gray-500 mb-2 block uppercase tracking-tighter">Tên người dùng</label>
                        <BaseInput 
                            type="text" 
                            value={username || ""} 
                            onChange={(e) => setUsername(e.target.value)} 
                            isReadonly={false} 
                            placeholder="Nhập tên mới..."
                        />
                    </div>

                    <div className="w-full">
                        <label className="text-xs font-bold text-gray-500 mb-2 block uppercase tracking-tighter">Email</label>
                        <BaseInput 
                            type="email" 
                            placeholder={user?.email}
                            onChange={(e) => setUsername(e.target.value)}
                            isReadonly={true}
                        />
                    </div>

                    <div className="w-full flex flex-col gap-3">
                        <button 
                            type="button"
                            disabled={isResettingPassword}
                            onClick={handleResetPassword}
                            className={`underline flex items-start justify-start text-sm ${isResettingPassword ? "text-gray-400" : "text-blue-600 hover:text-blue-800 cursor-pointer"}`}
                        >
                            {isResettingPassword ? "Đang xử lý..." : "Gửi yêu cầu thay đổi mật khẩu"}
                        </button>
                        <button 
                            type="button"
                            disabled={isDeleteAccount}
                            onClick={handleDeleteAccount}
                            className={`underline flex items-start justify-start text-sm ${isDeleteAccount ? "text-gray-400" : "text-red-500 hover:text-red-700 cursor-pointer"}`}
                        >
                            {isDeleteAccount ? "Đang xử lý..." : "Gửi yêu cầu xoá tài khoản"}
                        </button>
                    </div>

                    <button 
                        type="submit" 
                        disabled={isProfileUpdating}
                        className="w-full bg-green-600 text-white font-bold py-4 rounded-xl shadow-md hover:bg-green-700 transition-all flex justify-center items-center gap-2 cursor-pointer"
                    >
                        {isProfileUpdating && <Loader2 className="w-5 h-5 animate-spin" />}
                        Lưu thông tin
                    </button>
                </form>
            </div>

            {/* BOX 3: ĐĂNG XUẤT */}
            <div className="w-full max-w-xl">
                <button 
                    type="button"
                    onClick={handleLogOut}
                    className="w-full bg-red-500 text-white font-bold py-4 rounded-2xl border-2 border-transparent hover:bg-white hover:border-red-500 hover:text-red-500 transition-all shadow-sm cursor-pointer"
                >
                    Đăng xuất tài khoản
                </button>
            </div>
        </div>
    );
}