import { HERO_SECTION_DATA } from "@/constants/constants"
import { HeroSection } from "./hero-section"

export const HeroField = () => {
    return (
        <div className="flex flex-col lg:flex-row gap-4 px-4 md:px-10 max-w-6xl mx-auto w-full h-auto lg:h-80 my-6">
            {
                HERO_SECTION_DATA.map((heroSection, index) => (
                    <HeroSection key={index} {...heroSection}/>
                ))
            }
        </div>
    )
}