import { QuizSection } from "./quiz-section"

export const UserQuizSection = ({ quiz }: { quiz: any[] }) => {
    if (!quiz || quiz.length === 0) {
        return (
            <div className="flex-1 p-10 border-2 border-dashed border-gray-300 rounded-lg text-center text-gray-500">
                Bạn chưa tạo bộ đề thi nào.
            </div>
        );
    }

    return (
        <div className="flex-1 border rounded-lg p-6 bg-[#D2DCFF] shadow-sm w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {
                    quiz.map((element: any) => (
                        <div key={element._id} className="flex justify-center"> 
                            <QuizSection 
                                _id={element._id}           
                                title={element.title} 
                                image={element.image || element.question?.[0]?.image || ""} 
                                rating={element.rating || 0} 
                                name={element.authorId?.profile?.username || "Tác giả"} 
                                createdAt={element.createdAt}
                            />
                        </div>
                    ))
                }
            </div>    
        </div>
    )
}