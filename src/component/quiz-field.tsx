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
        <div key={title} className="flex flex-col lg:flex-row bg-[#D2DCFF] gap-2 lg:gap-4 rounded-3xl overflow-hidden border-2 border-black/10">
            
            <div className="flex-none flex items-center lg:items-start justify-center flex-col p-6 lg:p-10 gap-2 w-full lg:w-72 bg-black/5 lg:bg-transparent">
                <h1 className="text-black font-black text-xl lg:text-3xl text-center lg:text-left">{title}</h1>
                <h3 className="text-slate-800 font-bold text-sm lg:text-base cursor-pointer hover:underline flex items-center gap-1.5">
                    <span>Khám phá ngay</span>
                    <span className="text-blue-600">({total})</span>
                    <FontAwesomeIcon icon={faChevronRight} className="text-black text-xs ml-1" />
                </h3>
            </div>

            <div className="flex-1 flex flex-row gap-4 p-4 lg:p-6 overflow-x-auto no-scrollbar items-stretch w-full"> 
                {data.map((item) => (
                    <div key={item._id} className="w-60 md:w-70 flex-none"> 
                        <QuizSection 
                            _id={item._id}           
                            title={item.title} 
                            image={item.image} 
                            rating={item.rating} 
                            name={item.authorId?.profile?.username || "LetQuiz User"} 
                            createdAt={item.createdAt}
                            totalQuestions={item.totalQuestions}
                            type={'home'}
                            isAiGenerated={item.isAiGenerated}
                        />
                    </div>
                ))}
            </div>
        </div>
        );
    };

    const TAG_MAP: Record<string, string> = {
        "Entertainment": "Giải trí",
        "Sport": "Thể thao",
        "Art & Literature": "Hội họa và Văn học",
        "Geography": "Địa lý",
        "History": "Lịch sử",
        "Science & Nature": "Khoa học tự nhiên",
        "Trivia": "Đa dạng"
    };

    return (
        <div className="flex flex-col px-4 md:px-10 max-w-6xl mx-auto w-full my-5 gap-6 select-none">
            {renderRow(sections.newest.title, sections.newest.data, sections.newest.total)}
            
            {renderRow(sections.topRated.title, sections.topRated.data, sections.topRated.total)}

            {sections.tagSections.map((s, i) => {
                const mappedTitle = TAG_MAP[s.tag] || s.tag;
                return renderRow(mappedTitle, s.data, s.total);
            })}
        </div>
    )
} 