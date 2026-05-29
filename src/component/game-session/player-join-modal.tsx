'use client'

import { useState, useEffect } from "react";

interface PlayerJoinModalProps {
    onConfirm: (nickname: string, avatarSeed: string) => void;
}

export const PlayerJoinModal = ({ onConfirm }: PlayerJoinModalProps) => {
    const [name, setName] = useState('');
     
    const [avatarSeed, setAvatarSeed] = useState('default');

    useEffect(() => {
        const randomSeed = Math.floor(1000 + Math.random() * 9000).toString();
        setAvatarSeed(randomSeed);
    }, []);

    const handleRandomAvatar = () => {
        const newSeed = Math.floor(1000 + Math.random() * 9000).toString();
        setAvatarSeed(newSeed);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;
        onConfirm(name.trim(), avatarSeed); 
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-[#24154D] border-4 border-black rounded-2xl p-6 w-full max-w-sm text-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center gap-5">
                <h2 className="text-xl font-black uppercase tracking-wider text-center">Tạo hồ sơ đấu sĩ</h2>
                
                <div className="flex flex-col items-center gap-3">
                    <div className="w-24 h-24 bg-white rounded-2xl border-4 border-black overflow-hidden shadow-[4px_4px_0px_0px_#000] p-1 flex items-center justify-center">
                        <img 
                            src={`https://api.dicebear.com/7.x/bottts/svg?seed=${avatarSeed}`} 
                            alt="Player Avatar" 
                            className="w-full h-full object-contain animate-bounce [animation-duration:2s]"
                        />
                    </div>
                    
                    <button 
                        type="button"
                        onClick={handleRandomAvatar}
                        className="text-xs bg-blue-600 hover:bg-blue-500 border-2 border-black font-extrabold px-3 py-1.5 rounded-lg cursor-pointer"
                    >
                        Đổi ngoại hình 🎲
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
                    <input 
                        type="text" 
                        maxLength={12}
                        value={name} 
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-3 bg-white text-slate-900 border-4 border-black font-black text-md rounded-xl focus:outline-none" 
                        placeholder="Biệt danh của bạn..." 
                        required 
                    />
                    <button type="submit" className="w-full border-4 border-black rounded-full h-12 text-md font-black text-black bg-[#AAFB6C] hover:bg-[#C6FF9A] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] uppercase tracking-wider cursor-pointer">
                        Vào phòng chờ
                    </button>
                </form>
            </div>
        </div>
    );
};