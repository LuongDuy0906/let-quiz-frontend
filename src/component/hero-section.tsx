interface HeroSectionProps {
    image: string;
    text1: string;
    text2: string;
    text3: string;
}

export const HeroSection = (heroSection: HeroSectionProps) => {
    const { image, text1, text2, text3 } = heroSection;
    return (
        <div className="flex-1 bg-[#363793] m-2 grid grid-cols-2 rounded-3xl">
            <div className="rounded-l-3xl flex items-center justify-center">
                <img src={image} alt="" className="w-full h-full object-cover"/>
            </div>
            <div className="rounded-r-3xl flex flex-col items-center justify-center gap-6">
                <h1 className="text-4xl font-bold text-center text-white">{text1}</h1>
                <h2 className="text-2xl font-medium text-center text-white">{text2}</h2>
                <button className="border-4 border-black rounded-full w-56 h-16 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25),inset_0px_-8px_4px_0px_rgba(0,0,0,0.25)] text-xl font-bold text-white bg-[#4CC327] hover:bg-[#91E477] active:shadow-[none] active:bg-[#91E477] active:translate-y-[0.5]transition-all duration-300">
                    <a href="create-quiz" className="font-medium text-3xl text-center">{text3}</a>
                </button>
            </div>
        </div>
    );
}