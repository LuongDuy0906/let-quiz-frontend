import { apiFetch } from "@/lib/api"
import { skip } from "node:test"
import { toast } from "react-toastify";

export const gameSessionService = {
    initGameSession: async (quizId: string) => {
        try {
            const response = await apiFetch('/game-session/init', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({quizId})
            });

            if(!response.ok){
                const error = await response.json();
                const errorMessage = Array.isArray(error.message)
                ? error.message.join(", ")
                : error.message || "Đã xảy ra lỗi không xác định";
                toast.error(errorMessage);
                return;
            }

            const data = await response.json();
            if(data && data.sessionId && data.pin){
                sessionStorage.setItem(`room_pin:${data.sessionId}`, data.pin);
            }

            return data.sessionId;
        } catch (error) {
            console.log(error);
            toast.error("Không thể kết nối đến hệ thống");
            return;
        }
    }
}