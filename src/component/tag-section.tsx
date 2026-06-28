interface TagSectionProps {
    imageUrl: string;
    title: string;
}

export const TagSection = (tagSectionProps: TagSectionProps) => {
    const { imageUrl, title } = tagSectionProps;
    return (
        <div className="flex-none flex flex-col items-center justify-center h-auto gap-1.5 px-3">
            <img src={imageUrl} alt="" className="h-10 md:h-12 object-contain"/>
            <a href="" className="text-sm md:text-base font-bold text-slate-800 hover:text-blue-600 whitespace-nowrap">{title}</a>
        </div>
    );
}