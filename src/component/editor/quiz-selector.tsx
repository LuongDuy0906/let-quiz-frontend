import { faSquare, faSquareCheck } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Check, Square } from "lucide-react"

export const QuizSelector = ({text, type, logo, onClick}: QuizSelectorProps) => {
    return (
        <button onClick={onClick} className="bg-[#4E62A8]/80 flex flex-row gap-5 w-96 h-30 justify-center items-center p-5 rounded-xl cursor-pointer">
            <div className="w-30 h-30 flex justify-center items-center">
                <div className="w-20 h-20 rounded-full bg-[#6C7EBA]/80 flex justify-center items-center">
                    {
                        logo == 'single-choice' ? 
                        <div className="h-12 w-12 bg-green-500 rounded-md border-black border-4 shadow-[inset_0px_-5px_4px_0px_rgba(0,0,0,0.5)]"></div> 
                        : 
                        <div className="h-12 w-12 bg-white flex justify-center items-center rounded-md border-black border-4 shadow-[inset_0px_-5px_4px_0px_rgba(0,0,0,0.5)]">
                            <Check/>
                        </div>
                    }
                </div>
            </div>
            <div className="w-full h-30 flex flex-col gap-2 justify-center items-start">
                <div className="text-xl text-white">{text}</div>
                <div className="text-md text-[#ffff]/70">{type}</div>
            </div>
        </button>
    )
}