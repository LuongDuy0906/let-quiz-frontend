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
      
            {/* 1. VÙNG CHỨA HÌNH ẢNH & HIỆU ỨNG (Added relative, group, w-full, h-32) */}
            <div className="relative w-full h-40 overflow-hidden flex-none">
                
                {/* Hình ảnh Quiz (object-cover is key) */}
                <img 
                src={image || "/placeholder-quiz.png"} 
                alt={title} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                />

                {/* 2. LỚP OVERLAY TỐI NỀN (Initially opacity-0, shows on group-hover) */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                </div>

                {/* 3. NÚT BẤM (Initially opacity-0 & translated down, shows & moves on group-hover) */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-100">
                <button className="bg-[#801FCA] text-white text-xs font-bold px-4 py-2 rounded-full shadow-md hover:bg-[#6D1AAB] active:scale-95 transition-all">
                    Chơi Ngay
                </button>
                </div>
            </div>

            {/* Cột phải: Nội dung */}
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