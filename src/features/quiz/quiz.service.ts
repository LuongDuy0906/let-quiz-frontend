import { apiFetch } from "@/lib/api";
import { toast } from "react-toastify";

export const quizService = {
    getQuizzes: async (params: {}) => {
        try {
            const queryString = new URLSearchParams(params).toString();
                    
            const response = await apiFetch(`/quiz?${queryString}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                skipAuth: true,
            });
        
            if (!response.ok) {
                const errorData = await response.json();
                console.error(`Fetch failed for ${queryString}:`, errorData);
                return null;
            }
        
            const result = await response.json();
            return result;
        }
        catch(e) {
            console.error('Lỗi khi gọi API:', e);
            return null;
        }
    },

    uploadQuizImage: async (file: File) => {
        const formData = new FormData();
        formData.append('image', file);

        try {
            const res = await apiFetch('/quiz/upload', {
                method: 'POST',
                body: formData
            });       

            if(!res.ok){
                const error = res.json();
                console.log('Lỗi khi lưu bộ đề', error);
                toast.error(error);
            }

            const imageUrl = await res.json();

            return imageUrl.image;
        } catch (e) {
            console.log('Lỗi khi lưu bộ đề', e);
            return;
        }
    },

    saveQuiz: async (quizData: any) => {
        try {
            const res = await apiFetch('/quiz', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify(quizData)
            });

            if(!res.ok){
                const error = await res.json();
                console.log('Lỗi khi lưu bộ đề: ', error);
                const errorMessage = Array.isArray(error.message)
                ? error.message.join(", ") // Nối các lỗi mảng thành chuỗi
                : error.message || "Đã xảy ra lỗi không xác định";
                toast.error(errorMessage);
                return;
            }

            toast.success("Thêm bộ đề thành công");
            return 'Lưu bộ đề thành công'
        } catch (e) {
            console.log('Lỗi khi lưu bộ đề: ', e);
            toast.error(e);
        }
    }
}