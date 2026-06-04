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

    findOne: async (id: string) => {
        try {
            const response = await apiFetch(`quiz/${id}`, {
                method: 'GET'
            });

            const data = await handleApiResponse<QuizResponse>(response);

            return data;
        } catch (error: any) {
            console.error('Save quiz failed:', error.message);
            toast.error(error.message);
            return null;
        }
    }
};