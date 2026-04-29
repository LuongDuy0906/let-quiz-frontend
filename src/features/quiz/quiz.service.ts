import { apiFetch } from "@/lib/api";

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
    }
}