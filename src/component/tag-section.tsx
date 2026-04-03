interface TagSectionProps {
    imageUrl: string;
    title: string;
}

export const TagSection = (tagSectionProps: TagSectionProps) => {
    const { imageUrl, title } = tagSectionProps;
    return (
        <div className="flex-1 flex-col flex items-center justify-center h-full gap-2">
            <img src={imageUrl} alt="" className="h-14"/>
            <a href="" className="text-lg font-bold">{title}</a>
        </div>
    );
}