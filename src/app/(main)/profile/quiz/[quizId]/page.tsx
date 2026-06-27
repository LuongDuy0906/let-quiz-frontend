'use client'

import { QuestionSection } from "@/component/profile/question-section";
import { gameSessionService } from "@/features/game-session/game-session.service";
import { quizService } from "@/features/quiz/quiz.service";
import { useUser } from "@/providers/user.provider";
import { QuizResponse } from "@/types/api";
import { CircleUserRound, Tag } from "lucide-react";
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function ProfileQuizPage() {
    const params = useParams();
    const user = useUser();
    const router = useRouter();
    
    const quizId = params.quizId!.toString();
    const username = user.user.profile.username;
    const avatar = user.user.profile.avatarUrl;

    const [quiz, setQuiz] = useState<QuizResponse>();
    const [showQuestions, setShowQuestions] = useState(false);
    const [showOptions, setShowOptions] = useState(false);

    const getQuiz = async (quizId: string) => {
        const response = await quizService.getQuestionByQuizId(quizId);

        if(!response) {
            toast.error('Lỗi khi tải câu hỏi');
            return;
        }

        setQuiz(response);
    }

    const handlePlayNow = async () => {
        const data = await gameSessionService.initGameSession(quizId);

        if(data!.sessionId){
            const quizData = {
                _id: quizId,
                title: quiz?.title,
                totalQuestions: quiz?.totalQuestions || 0,
                image: quiz?.image
            }
    
            sessionStorage.setItem(`room_quiz:${data?.sessionId}`, JSON.stringify(quizData));
            router.push(`/play/${data?.sessionId}`);
        }
    }

    const handleEditQuiz = () => {
        const quizInfo = {
            _id: quizId,
            title: quiz?.title,
            image: quiz?.image,
            questions: quiz?.questions,
            isAiGenerated: quiz?.isAiGenerated,
            tag: quiz?.tag,
            status: quiz?.status
        }

        const jsonString = JSON.stringify(quizInfo);
        sessionStorage.setItem('generated_quiz_preview', jsonString);

        router.push('/create-quiz');
    }

    const handleDeleteQuiz = () => {
        const Msg = ({ closeToast }: { closeToast: () => void }) => (
            <div className="flex flex-col gap-5">
                <div className="text-xl font-bold text-gray-800 flex flex-col items-center gap-2">
                    Xác nhận xóa bộ đề?
                </div>
                <p className="text-sm text-gray-500">
                    Hành động này không thể hoàn tác. Bộ đề của bạn sẽ bị xóa vĩnh viễn khỏi hệ thống.
                </p>
                <div className="flex flex-row justify-center gap-4 mt-2">
                    <button 
                        onClick={closeToast}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 text-sm font-bold px-5 py-2.5 rounded-xl transition-all"
                    >
                        Hủy
                    </button>
                    <button 
                        onClick={async () => {
                            closeToast();
                            try {
                                await quizService.deleteQuiz(quizId);
                                toast.success("Xóa bộ đề thành công!");
                                window.location.href = "/profile";
                            } catch (error) {
                                console.error(error);
                                toast.error("Lỗi khi xóa bộ đề!");
                            }
                        }}
                        className="bg-red-500 hover:bg-red-600 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all shadow-sm"
                    >
                        Vẫn xóa
                    </button>
                </div>
            </div>
        );

        toast.info(<Msg closeToast={() => {}} />, {
            position: "top-center",    
            autoClose: false,          
            closeOnClick: false,       
            draggable: false,          
            closeButton: false,        
            style: {
                position: "fixed",
                zIndex: 9999,          // Đảm bảo nổi lên trên cùng mọi thành phần
                width: "450px",        
                top: "40vh",           // Đẩy xuống tầm mắt khoảng 25% chiều cao màn hình
                left: "50%",           // Căn giữa trục ngang
                transform: "translateX(-50%)", // Dịch ngược lại 50% độ rộng để chính giữa tuyệt đối
                borderRadius: "16px",  
                
                boxShadow: "0 0 0 200vw rgba(0, 0, 0, 0.5), 0 20px 25px -5px rgb(0 0 0 / 0.1)",
                
                background: "#FFFFFF"
            }
        });
    };

    useEffect(() => {
        getQuiz(quizId);
    }, []);

    return (
        <div className="flex flex-col h-full p-10 mx-40 gap-10">
            <div className="flex flex-row bg-[#DFDDDD] rounded-xl w-full h-80 p-5 gap-10">
                <div className="h-full w-sm">
                    <img src={quiz?.image} alt="" className="rounded-xl h-full"/>
                </div>
                <div className="flex flex-col gap-3">
                    <div className="flex flex-row gap-3">
                        {
                            avatar ? 
                            <img src={avatar} alt="" className="w-8 h-8 rounded-full"/> 
                            :
                            <CircleUserRound  className="w-8 h-8"/>
                        }
                        <p className="text-xl">{username}</p>
                    </div>
                    <div className="flex flex-col gap-3">
                        <p className="text-2xl font-bold">{quiz?.title}</p>
                        <div className="flex flex-row gap-4 text-lg font-semibold">
                            <p>{quiz?.totalQuestions} câu hỏi</p>
                            <p>{quiz?.status}</p>
                        </div>
                    </div>
                    <div className="flex flex-row mt-7 gap-5">
                        <button onClick={handlePlayNow} className="bg-[#f3ff44] font-bold text-2xl flex items-center justify-center w-sm h-14 rounded-full shadow-[inset_0px_-5px_4px_0px_rgba(0,0,0,0.5)] hover:bg-[#edf767] active:shadow-[none] active:bg-[#f4ff53] active:translate-y-[0.5] transition-all duration-300">
                            Chơi ngay
                        </button>
                        <button onClick={handleEditQuiz} className="bg-[#C0C0C0] font-bold text-2xl flex items-center justify-center w-40 h-14 rounded-full hover:bg-[#cfcdcd] active:shadow-[none] active:bg-[#b4b4b4] active:translate-y-[0.5] transition-all duration-300">
                            Chỉnh sửa
                        </button>
                        <button onClick={handleDeleteQuiz} className="bg-[#f13e3e] font-bold text-2xl flex items-center justify-center w-40 h-14 rounded-full hover:bg-[#f05454] active:shadow-[none] active:bg-[#db3f3f] active:translate-y-[0.5] transition-all duration-300">
                            Xoá
                        </button>
                    </div>
                </div>
            </div>
            <div className="flex flex-col">
                <div className="flex flex-row gap-4">
                    <div className="flex flex-row gap-2 justify-items-center">
                        <input type="checkbox" className="w-5" onChange={() => setShowQuestions(!showQuestions)}/>
                        <label htmlFor="" className="text-lg">Hiện thị câu hỏi</label>
                    </div>
                    {
                        showQuestions ?
                        <div className="flex flex-row gap-2 justify-items-center">
                            <input type="checkbox" className="w-5" onChange={() => setShowOptions(!showOptions)}/>
                            <label htmlFor="" className="text-lg">Hiện thị đáp án</label>
                        </div>
                        :
                        <div>
                        </div>
                    }
                </div>
                <div className="grid grid-cols-5 gap-4 mt-6 w-full">
                    {quiz?.questions?.map((item) => (
                        <div key={item._id} className="w-full"> 
                            <QuestionSection 
                                _id={item._id} 
                                content={item.content} 
                                image={item.image} 
                                questionType={item.questionType} 
                                options={item.options} 
                                timeLimit={item.timeLimit} 
                                information={item.information} 
                                showQuestions={showQuestions}
                                showOptions={showOptions}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}