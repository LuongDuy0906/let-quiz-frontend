import { faStar } from "@fortawesome/free-solid-svg-icons/faStar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface Props {
    _id: string;
    title: string;
    image: string;
    rating: number;
    name: string;
    createdAt: string;
}

export const QuizSection = ({ title, image, rating, name }: Props) => {
    return (
        <div className="flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 group transition-all duration-300 hover:shadow-lg">
            <div className="relative w-full h-40 overflow-hidden flex-none">
                <img 
                src={image || "/placeholder-quiz.png"} 
                alt={title} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                />

                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                </div>

                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-100">
                <button className="border-4 border-black rounded-full w-full h-14 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25),inset_0px_-8px_4px_0px_rgba(0,0,0,0.25)] text-xl font-bold text-white bg-[#801FCA] hover:bg-[#A863DD] active:shadow-[none] active:bg-[#A863DD] active:translate-y-[0.5]transition-all duration-300">
                    <a href="/login">Chơi ngay</a>
                </button>
                </div>
            </div>
            <div className="flex flex-col justify-between p-3">
                <div className="flex-none">
                    <p className="font-bold text-gray-800 line-clamp-2 leading-tight">
                        {title}
                    </p>
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