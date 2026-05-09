import { CircleUserRound } from "lucide-react"

export const ProfileDetail = ({ user, totalQuiz }: ProfileDetailProps) => {
    return (
        <div className="flex-none flex flex-col border rounded-lg p-4 gap-14 bg-[#D2DCFF] shadow-sm w-96">   
            <div className= "flex flex-none flex-col justify-center items-center h-52 w-full mt-14 gap-8">
                {
                    !user?.profile?.avatarUrl ? (
                        <CircleUserRound className="h-full"/>
                    ) : (
                        <img src={user?.profile?.avatarUrl} alt="User Avatar" className="rounded-full h-full w-fit" />
                    )
                }
                <h2 className="text-3xl font-bold">{user?.profile?.username || "User name"}</h2>
            </div>
            <div className="flex flex-col justify-start items-center gap-5">
                <p className="text-3xl font-bold">
                    Bộ đề: {totalQuiz}
                </p>
                <p className="text-3xl font-bold">
                    Đánh giá: {user?.profile?.averageRating?.toFixed(1) || 0}
                </p>
            </div>
            <div className="flex flex-col justify-between items-center gap-7 mb-14">
                <button className="border-4 border-black rounded-full w-56 h-16 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25),inset_0px_-8px_4px_0px_rgba(0,0,0,0.25)] text-xl font-bold text-white bg-green-500 hover:bg-[#A863DD] active:shadow-none active:translate-y-1 transition-all duration-300">
                    <a href="/create-quiz">Tạo đề</a>
                </button>
                <button className="border-4 border-black rounded-full w-56 h-16 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25),inset_0px_-8px_4px_0px_rgba(0,0,0,0.25)] text-xl font-bold text-white bg-[#801FCA] hover:bg-[#A863DD] active:shadow-none active:translate-y-1 transition-all duration-300">
                    <a href="/profile/setting">Cài đặt</a>
                </button>
            </div>
        </div>
    ) 
}