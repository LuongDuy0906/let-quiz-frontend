import { QuizSection } from "./quiz-section"

export const UserQuizSection = ({ 
  quiz, 
  currentPage, 
  totalPages, 
  onPageChange, 
  isFetching 
}: UserQuizSectionProps) => {

    return (
        <div className="flex-1 border-4 border-black rounded-2xl p-6 bg-[#D2DCFF] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] w-full flex flex-col gap-5 lg:h-[680px]">
            <style dangerouslySetInnerHTML={{ 
                __html: `
                    .custom-card-wrapper img {
                        height: 140px !important;
                        width: 100% !important;
                        object-fit: cover !important;
                        background-color: #f3f4f6;
                    }
                    .custom-card-wrapper > div {
                        height: 100% !important;
                        display: flex !important;
                        flex-direction: column !important;
                    }
                ` 
            }} />

            <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-start flex-1 ${isFetching ? 'opacity-50' : ''}`}>
                {quiz.map((element: any) => (
                    <div 
                        key={element._id} 
                        className="custom-card-wrapper w-full max-w-xs sm:max-w-70 h-60 mx-auto overflow-hidden bg-white rounded-xl border-2 border-black/10 shadow-sm"
                    > 
                        <QuizSection 
                            _id={element._id}           
                            title={element.title} 
                            image={element.image || element.question?.[0]?.image || ""} 
                            rating={element.rating || 0} 
                            name={element.authorId?.profile?.username || "Tác giả"} 
                            createdAt={element.createdAt}
                            type={'profile'}
                            isAiGenerated={element.isAiGenerated}
                        />
                    </div>
                ))}
            </div>

            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-8 pt-6 border-t border-blue-300">
                    <button 
                        disabled={currentPage <= 1 || isFetching}
                        onClick={() => onPageChange(currentPage - 1)}
                        className="px-4 py-2 bg-white border rounded shadow-sm disabled:opacity-40 hover:bg-gray-50 text-sm font-bold text-blue-800"
                    >
                        Trang trước
                    </button>
                    
                    <span className="text-sm font-bold text-blue-900 bg-white/60 px-4 py-1.5 rounded-full shadow-inner">
                         {currentPage} / {totalPages}
                    </span>

                    <button 
                        disabled={currentPage >= totalPages || isFetching}
                        onClick={() => onPageChange(currentPage + 1)}
                        className="px-4 py-2 bg-white border rounded shadow-sm disabled:opacity-40 hover:bg-gray-50 text-sm font-bold text-blue-800"
                    >
                        Trang sau
                    </button>
                </div>
            )}
        </div>
    )
}