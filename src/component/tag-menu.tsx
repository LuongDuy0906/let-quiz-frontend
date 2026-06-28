import { TAG_DATA } from "@/constants/constants";
import { TagSection } from "./tag-section";

export const TagMenu = () => {
    return (
        <div className="flex justify-between px-4 md:px-10 max-w-6xl mx-auto w-full h-24 overflow-x-auto no-scrollbar py-2">
            {
                TAG_DATA.map((tag, index) => (
                    <TagSection key={index} imageUrl={tag.imageUrl} title={tag.title}/>
                ))
            }
        </div>
    )
};