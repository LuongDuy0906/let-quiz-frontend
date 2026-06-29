import { QuizTag } from "@/constants/constants";
import { apiFetch, handleApiResponse } from "@/lib/api";
import { QuizzesResponse, ImageUploadResponse, QuizResponse } from "@/types/api";
import { toast } from "react-toastify";

export const quizService = {
    getQuizzes: async (params: any = {}): Promise<QuizzesResponse | null> => {
        try {
            const queryString = new URLSearchParams(params).toString();
            const response = await apiFetch(
                `/quiz${queryString ? `?${queryString}` : ''}`,
                {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                }
            );
        
            const data = await handleApiResponse<QuizzesResponse>(response);
            return data;
        } catch (error: any) {
            console.error('Failed to fetch quizzes:', error.message);
            return null;
        }
    },

    uploadQuizImage: async (file: File): Promise<string | null> => {
        try {
            const formData = new FormData();
            formData.append('image', file);

            const response = await apiFetch('/quiz/upload', {
                method: 'POST',
                body: formData
            });

            const imageUrl = await handleApiResponse<ImageUploadResponse>(response);
            toast.success("Upload ảnh thành công");
            
            return imageUrl.image;
        } catch (error: any) {
            console.error('Upload failed:', error.message);
            toast.error(error.message);
            return null;
        }
    },

    saveQuiz: async (quizData: any): Promise<any | null> => {
        try {
            const response = await apiFetch('/quiz', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(quizData)
            });

            const data = await handleApiResponse(response);
            toast.success("Thêm bộ đề thành công");
            
            return data;
        } catch (error: any) {
            console.error('Save quiz failed:', error.message);
            toast.error(error.message);
            return null;
        }
    },

    updateQuiz: async (quizId: string, quizData: any) => {
        try {
            const response = await apiFetch(`/quiz/${quizId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(quizData)
            });

            const data = await handleApiResponse(response);
            toast.success("Cập nhật bộ đề thành công");
            
            return data;
        } catch (error: any) {
            console.error('Save quiz failed:', error.message);
            toast.error(error.message);
            return null;
        }
    },

    getQuestionByQuizId: async (id: string) => {
        try {
            const response = await apiFetch(`quiz/${id}`, {
                method: 'GET'
            });

            const data = await handleApiResponse(response);

            return data;
        } catch (error: any) {
            console.error('Save quiz failed:', error.message);
            toast.error(error.message);
            return null;
        }
    },

    quizGenerate: async (prompt: string, questionCount: number, timeLimit: number, tags: QuizTag[]) => {
        try {
            const response = await apiFetch('quiz/generate-preview', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({prompt, questionCount, timeLimit, tags})
            });

            const data = await handleApiResponse(response);

            return data;
        } catch (e: any) {
            console.error('Save quiz failed:', e.message);
            toast.error(e.message);
            return null;
        }
    },

    deleteQuiz: async (quizId: string) => {
        try {
            await apiFetch(`quiz/${quizId}`, {
                method: 'DELETE',
            });

            toast.success("Xoá bộ đề thành công");
        } catch (e: any) {
            console.error('Save quiz failed:', e.message);
            toast.error(e.message);
            return null;
        }
    } 
};