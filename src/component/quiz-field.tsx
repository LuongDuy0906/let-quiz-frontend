"use client";

import { QuizSection } from "./quiz-section";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";

interface QuizFieldProps {
  sections: HomeSections;
}

export const QuizField = ({sections}: QuizFieldProps) => {

    const renderRow = (title: string, data: any[], total: number) => {
        if (!data || data.length === 0) return null;

        return (
        <div key={title} className="flex flex-row bg-[#D2DCFF] mx-12.5 my-10 gap-4 rounded-3xl shadow-sm overflow-hidden">
            
            <div className="flex-none flex items-start justify-center flex-col p-12 lg:p-20 gap-3 min-w-75">
            <h1 className="text-black font-bold text-3xl">{title}</h1>
            <h3 className="text-black font-bold text-xl cursor-pointer hover:underline">
                Khám phá ngay ({total}) 
                <span className="inline-block ml-2">
                <FontAwesomeIcon icon={faChevronRight} className="text-black" />
                </span>
            </h3>
            </div>

            <div className="flex-1 flex flex-row gap-6 p-8 overflow-x-auto no-scrollbar items-center">
            {data.map((item) => (
                <QuizSection 
                key={item._id}           
                _id={item._id}             
                title={item.title} 
                image={item.image} 
                rating={item.rating} 
                name={item.authorId?.profile?.username || "LetQuiz User"} 
                createdAt={item.createdAt}
                />
            ))}
            </div>
        </div>
        );
    };

    return (
        <div className="flex flex-row bg-[#D2DCFF] mx-50 my-5 gap-4 rounded-3xl">
            {renderRow(sections.newest.title, sections.newest.data, sections.newest.total)}
            
            {renderRow(sections.topRated.title, sections.topRated.data, sections.topRated.total)}

            {sections.tagSections.map((s, i) => renderRow(s.tag, s.data, s.total))}
        </div>
    )
} 