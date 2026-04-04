"use client";

import { apiFetch } from "@/lib/api"
import { useEffect, useState } from "react"
import { QuizSection } from "./quiz-section";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";

interface Props {
    _id: string;
    title: string;
    image: string;
    rating: number;
    authorId: {
        _id: string;
        profile: {
            username: string;
        }
    }
    createdAt: string;
}

export const QuizField = () => {
    const [quizzes, setQuizzes] = useState<Props[]>([]);

    const getAllQuizzes = async () => {
        try {
            const response = await apiFetch('/quiz', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json', 
                },
                skipAuth: true,
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Fetch quizzes failed:', errorData);
                return;
            }

            const data = await response.json(); 
            console.log(data);
            setQuizzes(data);
        }
        catch(e) {
            console.error('An error occurred during login:', e);
        }
    }

    useEffect(() => {
        getAllQuizzes();
    }, [])

    return (
        <div className="flex flex-row bg-[#D2DCFF] mx-50 my-5 gap-4 rounded-3xl">
            <div className="flex-none flex items-start justify-center flex-col p-20 gap-3">
                <h1 className="text-black font-bold text-3xl">Câu đối mới</h1>
                <h3 className="text-black font-bold text-xl">Khám phá ngay <span><FontAwesomeIcon icon={faChevronRight} style={{color: "rgb(0, 0, 0)",}} /></span></h3>
            </div>
            <div className="flex-1 flex flex-row gap-4">
                {
                    quizzes.slice(0, 5).map((item, index) => (
                        <QuizSection key={index} _id={item._id} title={item.title} image={item.image} rating={item.rating} name={item.authorId.profile.username} createdAt={item.createdAt}/>
                    ))
                }
            </div>
        </div>
    )
} 