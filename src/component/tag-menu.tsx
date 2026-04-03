import { TAG_DATA } from "@/types/tag-data";
import { TagSection } from "./tag-section";

export const TagMenu = () => {
    return (
        <div className="flex gap-3 mr-50 ml-50 h-30">
            {
                TAG_DATA.map((tag, index) => (
                    <TagSection key={index} imageUrl={tag.imageUrl} title={tag.title}/>
                ))
            }
        </div>
    )
};