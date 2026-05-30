import { apiFetch, handleApiResponse } from "@/lib/api";
import { GameSessionResponse, VerifyPinResponse } from "@/types/api";
import { toast } from "react-toastify";

export const gameSessionService = {
    initGameSession: async (quizId: string): Promise<string | null> => {
        try {
            const response = await apiFetch('/game-session/init', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ quizId })
            });

            const data = await handleApiResponse<GameSessionResponse>(response);
            
            if (data && data.sessionId && data.pin) {
                sessionStorage.setItem(`room_pin:${data.sessionId}`, data.pin);
            }

            toast.success("Phòng học được tạo thành công");
            return data.sessionId;
        } catch (error: any) {
            console.error('Init game session failed:', error.message);
            toast.error(error.message);
            return null;
        }
    },

    getSessionId: async (roomPin: string): Promise<VerifyPinResponse | null> => {
        try {
            const response = await apiFetch('/game-session/verify-pin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ roomPin })
            });

            const data = await handleApiResponse<VerifyPinResponse>(response);
            return data;
        } catch (error: any) {
            console.error('Verify pin failed:', error.message);
            toast.error(error.message);
            return null;
        }
    },

    getRoomPin: async (sessionId: string): Promise<any | null> => {
        try {
            const response = await apiFetch(`/game-session/get-room-pin/${sessionId}`, {
                method: 'GET',
            });

            const data = await handleApiResponse(response);
            return data;
        } catch (error: any) {
            console.error('Get room pin failed:', error.message);
            toast.error(error.message);
            return null;
        }
    }
};