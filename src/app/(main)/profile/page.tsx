// src/app/profile/page.tsx
"use client";

import { ProfileDetail } from "@/component/profile-detail";
import { UserQuizSection } from "@/component/user-quiz-section";
import { userService } from "@/features/user/user.service";
import { useUser } from "@/providers/user.provider";
import { useEffect, useState } from "react";

export default function ProfilePage() {
    const { user, loading } = useUser();
    const [quiz, setQuiz] = useState<any[]>([]);
    
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isFetching, setIsFetching] = useState(false);
    const [totalQuiz, setTotalQuiz] = useState(0);

    const fetchQuiz = async (page: number) => {
        setIsFetching(true);
        try {
            const response = await userService.getLibrary(page, 6);
            
            if (response && response.data) {
                setQuiz(response.data);
                setTotalQuiz(response.pagination.totalItems);
                setTotalPages(response.pagination.totalPages);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsFetching(false);
        }
    };

    const onPageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    useEffect(() => {
        fetchQuiz(currentPage);
    }, [currentPage]);

    return (
        <div className="flex flex-col lg:flex-row max-w-6xl mx-auto px-4 mt-7 gap-6 items-start w-full">
            <ProfileDetail user={user} totalQuiz={totalQuiz} />
            
            <UserQuizSection 
                quiz={quiz}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
                isFetching={isFetching}
            />
        </div>
    );
}