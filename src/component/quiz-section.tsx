'use client'

import { gameSessionService } from "@/features/game-session/game-session.service";
import { faStar } from "@fortawesome/free-solid-svg-icons/faStar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";

export const QuizSection = ({ _id, title, image, rating, name, totalQuestions, type, isAiGenerated }: Props) => {
    const router = useRouter();

    const handlePlayNow = async () => {
        const data = await gameSessionService.initGameSession(_id);

        if (data!.sessionId) {
            const quiz = {
                _id: _id,
                title: title,
                totalQuestions: totalQuestions || 0,
                image: image
            }

            sessionStorage.setItem(`room_quiz:${data?.sessionId}`, JSON.stringify(quiz));
            router.push(`/play/${data?.sessionId}`);
        }
    }

    const handleShowQuizDetail = async (quizId: string) => {
        router.push(`profile/quiz/${quizId}`);
    }

    return (
        <div className="flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 group transition-all duration-300 hover:shadow-lg">
            <div className="relative w-full h-40 overflow-hidden flex-none">
                <img
                    src={image || "/placeholder-quiz.png"}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {isAiGenerated && (
                    <div className="absolute left-2 bottom-2 bg-[#10B981] border-2 border-black px-2 py-0.5 rounded-md text-white font-black text-[10px] md:text-xs uppercase tracking-wider z-20 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] [text-shadow:1px_1px_0_#000]">
                        AI Khởi tạo
                    </div>
                )}

                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                </div>

                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-100">
                    <button onClick={() => type === 'home' ? handlePlayNow() : handleShowQuizDetail(_id)} className="border-4 border-black rounded-full w-40 h-14 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25),inset_0px_-8px_4px_0px_rgba(0,0,0,0.25)] text-xl font-bold text-white bg-[#801FCA] hover:bg-[#A863DD] active:shadow-[none] active:bg-[#A863DD] active:translate-y-[0.5] transition-all duration-300">
                        {
                            type === 'home' ? 'Chơi ngay' : 'Chi tiết'
                        }
                    </button>
                </div>
            </div>
            <div className="flex flex-col justify-between p-3">
                <div className="flex-none">
                    <a href={`/profile/quiz/${_id}`} className="font-bold text-gray-800 line-clamp-2 leading-tight">
                        {title}
                    </a>
                </div>

                <div className="flex justify-between items-end mt-2">
                    <div className="flex items-center gap-1">
                        <p className="text-sm font-semibold text-[#f0df23] border-amber-500">{rating}</p>
                        <FontAwesomeIcon icon={faStar} className="text-[#f0df23] text-xs" />
                    </div>
                    <div className="text-sm text-gray-400 italic">
                        By <span className="font-medium">{name}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};