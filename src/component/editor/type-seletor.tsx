import { QuizSelector } from "./quiz-selector"

interface Props{
    onSelect: (type: 'single-choice' | 'multiple-choice') => void;
}

export const TypeSelector = ({onSelect}: Props) => {
    return (
        <div className="flex flex-col flex-1 items-center justify-start gap-10 pt-10">
            <div className="text-4xl font-bold text-white">
                <h1>Loại đề</h1>
            </div>
            <div className="flex flex-row items-center justify-center gap-5">
                <div className="">
                    <QuizSelector text="Nút" type="Đơn đáp án" logo="single-choice" onClick={() => onSelect('single-choice')}/>
                </div>
                <div className="">
                    <QuizSelector text="Ô chọn" type="Đa đáp án" logo="multiple-choice" onClick={() => onSelect('multiple-choice')}/>
                </div>
            </div>
        </div>
    )
}