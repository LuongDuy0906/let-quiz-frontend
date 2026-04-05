import { HERO_SECTION_DATA } from "@/constants/constants"
import { HeroSection } from "./hero-section"

export const HeroField = () => {
    return (
        <div className="mx-48 h-96 flex">
            {
                HERO_SECTION_DATA.map((heroSection, index) => (
                    <HeroSection key={index} {...heroSection}/>
                ))
            }
        </div>
    )
}