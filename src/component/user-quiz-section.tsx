import { CircleUserRound } from "lucide-react"

export const UserQuizSection = (user: any) => {
    return (
        <div className="flex-1 flex flex-col border rounded-lg p-4 gap-4 bg-[#D2DCFF] shadow-sm w-full items-center justify-center">   
            <div className="h-20 w-20 rounded-full">
                {
                    !user.avatar ? (
                        <CircleUserRound  className="w-16 h-16"/>
                    ) : (
                        <img src={user.avatar} alt="User Avatar" className="w-20 h-20 rounded-full" />
                    )
                }
            </div>
        </div>
    )
}