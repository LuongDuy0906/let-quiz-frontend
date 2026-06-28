import { CircleUserRound } from "lucide-react"

export const ProfileDetail = ({ user, totalQuiz }: ProfileDetailProps) => {
    return (
        <div className="w-full lg:w-96 flex-none flex flex-col border-4 border-black rounded-2xl p-6 gap-6 lg:gap-8 bg-[#D2DCFF] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] select-none">   
            <div className="flex flex-col justify-center items-center h-48 lg:h-52 w-full mt-4 lg:mt-8 gap-4">
                {
                    !user?.profile?.avatarUrl ? (
                        <CircleUserRound className="h-24 w-24 text-slate-700"/>
                    ) : (
                        <img src={user?.profile?.avatarUrl} alt="User Avatar" className="rounded-full h-24 w-24 border-2 border-black object-cover" />
                    )
                }
                <h2 className="text-xl lg:text-2xl font-black text-slate-800 uppercase tracking-wide text-center">{user?.profile?.username || "Username"}</h2>
            </div>
            
            <div className="flex flex-col sm:flex-row lg:flex-col justify-center items-center gap-4 sm:gap-12 lg:gap-4 py-4 border-y border-black/10 w-full">
                <p className="text-lg lg:text-xl font-bold text-slate-800">
                    Bộ đề: <span className="font-black text-blue-600">{totalQuiz}</span>
                </p>
                <p className="text-lg lg:text-xl font-bold text-slate-800">
                    Đánh giá: <span className="font-black text-yellow-600">{user?.profile?.averageRating?.toFixed(1) || 0} ★</span>
                </p>
            </div>
            
            <div className="flex flex-col sm:flex-row lg:flex-col justify-center items-center gap-4 lg:gap-5 mt-2 mb-4 w-full">
                <button className="border-4 border-black rounded-full w-full max-w-55 h-12 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25),inset_0px_-5px_3px_0px_rgba(0,0,0,0.25)] text-base font-black text-white bg-green-500 hover:bg-green-600 active:shadow-none active:translate-y-1 transition-all duration-300 cursor-pointer uppercase tracking-wider">
                    <a href="/create-quiz" className="block w-full h-full flex items-center justify-center">Tạo đề</a>
                </button>
                <button className="flex items-center justify-center border-4 border-black rounded-full w-full max-w-55 h-12 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25),inset_0px_-5px_3px_0px_rgba(0,0,0,0.25)] text-base font-black text-white bg-[#801FCA] hover:bg-[#A863DD] active:shadow-none active:translate-y-1 transition-all duration-300 cursor-pointer uppercase tracking-wider">
                    <a href="/profile/setting" className="flex w-full h-full items-center justify-center">Cài đặt</a>
                </button>
            </div>
        </div>
    ) 
}