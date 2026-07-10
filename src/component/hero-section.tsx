import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface HeroSectionProps {
    image: string;
    text1: string;
    text2: string;
    text3: string;
}
 
export const HeroSection = (heroSection: HeroSectionProps) => {
    const { image, text1, text2, text3 } = heroSection;
    const router = useRouter();

    const handleRedirect = () => {
        const token = localStorage.getItem('accessToken');
        console.log(token);
        if(token) {
            if(text3 === 'Sáng tạo') {
                router.push('create-quiz');
                return;
            }

            router.push('quiz-generate');
            return;
        }

        toast.error("Bạn chưa đăng nhập để thực hiện hành động")
        router.push('login');
    }
    return (
        <div className="flex-1 bg-[#363793] m-2 grid grid-cols-1 sm:grid-cols-2 rounded-3xl overflow-hidden min-h-62.5 md:min-h-0">
            <div className="flex items-center justify-center h-48 sm:h-full w-full">
                <img src={image} alt="" className="w-full h-full object-cover"/>
            </div>
            <div className="flex flex-col items-center justify-center gap-4 md:gap-6 p-6 sm:p-4">
                <h1 className="text-xl md:text-2xl lg:text-3xl font-black text-center text-white uppercase tracking-wider">{text1}</h1>
                <h2 className="text-lg md:text-xl lg:text-2xl font-medium text-center text-slate-200">{text2}</h2>
                <button onClick={handleRedirect} className="border-4 border-black rounded-full w-48 sm:w-56 h-12 sm:h-16 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25),inset_0px_-8px_4px_0px_rgba(0,0,0,0.25)] text-lg sm:text-xl font-bold text-white bg-[#4CC327] hover:bg-[#91E477] active:shadow-[none] active:bg-[#91E477] active:translate-y-1 transition-all duration-300 cursor-pointer">
                    { text3 }
                </button>
            </div>
        </div>
    );
}