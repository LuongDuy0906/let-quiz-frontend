import { Check } from "lucide-react";
import { useEffect } from "react"

export const QuestionSection = ({
    _id, 
    content, 
    image, 
    questionType, 
    options, 
    timeLimit, 
    information,
    showQuestions,
    showOptions
}: QuestionProps) => {

    useEffect(() => {
        console.log(showQuestions);
    }, [showQuestions]);

    return (
        <div className={`bg-[#DFDDDD] dark:bg-[#1E1E1E] flex flex-col w-full h-full rounded-2xl p-5 shadow-md border border-gray-200 gap-4 ${showQuestions ? 'blur-none' : 'blur-xs'}`}>
            
            {image && (
                <div className="w-full h-48 overflow-hidden rounded-xl bg-gray-100 flex justify-center items-center">
                    <img src={image} alt="Question Cover" className="w-full h-full object-cover" />
                </div>
            )}

            <div className="border-b pb-2">
                <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded-md uppercase">
                    {questionType === 'multiple' ? 'Đa đáp án' : 'Đơn đáp án'}
                </span>
                <p className="text-lg font-semibold text-gray-800 dark:text-white mt-2">
                    {content || "Chưa có nội dung câu hỏi..."}
                </p>
            </div>

            {/* 3. Phần hiển thị danh sách các ô đáp án */}
            <div className={`flex flex-col ${showOptions ? '' : 'blur-xs'}`}>
                {options && options.map((item, idx) => {
                    return (
                        <div 
                            // Phòng vệ key: Nếu không có item._id thì dùng vị trí index để không bị báo lỗi React
                            key={item._id || `opt-${idx}`} 
                            className='flex items-center p-3'
                        >
                            <p className={`flex-1 text-sm wrap-break-word ${item.isCorrect ? 'text-green-600' : 'text-red-600'}`}>{item.content}</p>
                            
                            {item.isCorrect && (
                                <Check color="#04c807" />
                            )}
                        </div>
                    );
                })}
            </div>

            {/* 4. Phần thông tin giải thích bổ sung (nếu có) */}
            {information && (
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-xl border border-dashed text-xs text-gray-500">
                    <span className="font-bold block mb-0.5 text-gray-700 dark:text-gray-300">Giải thích:</span>
                    <p>{information}</p>
                </div>
            )}
        </div>
    );
};