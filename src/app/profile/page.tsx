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

    const fetchQuiz = async (page: number) => {
        setIsFetching(true);
        try {
            const token = localStorage.getItem('accessToken');
            const response = await userService.getLibrary(token!, page, 6);
            
            if (response && response.data) {
                setQuiz(response.data);
                setTotalPages(response.pagination.totalPages);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsFetching(false);
        }
    };

    useEffect(() => {
        fetchQuiz(currentPage);
    }, [currentPage]);

    return (
        <div className="flex flex-row mr-50 ml-50 mt-14 gap-4">
            <ProfileDetail user={user} />
            
            <div className="flex-1 flex flex-col gap-6">
                <UserQuizSection quiz={quiz} />

                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-4 mt-4">
                        <button 
                            disabled={currentPage <= 1 || isFetching}
                            onClick={() => {
                                setCurrentPage(prev => prev - 1);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="px-4 py-2 bg-white border rounded shadow-sm disabled:opacity-30 hover:bg-gray-50"
                        >
                            Trang trước
                        </button>
                        
                        <span className="text-sm font-medium">
                            Trang {currentPage} / {totalPages}
                        </span>

                        <button 
                            disabled={currentPage >= totalPages || isFetching}
                            onClick={() => {
                                setCurrentPage(prev => prev + 1);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="px-4 py-2 bg-white border rounded shadow-sm disabled:opacity-30 hover:bg-gray-50"
                        >
                            Trang sau
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}