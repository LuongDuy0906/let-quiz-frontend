import { apiFetch, handleApiResponse } from "@/lib/api";
import { GameSessionResponse, VerifyPinResponse } from "@/types/api";
import { toast } from "react-toastify";

export const gameSessionService = {
    initGameSession: async (quizId: string): Promise<GameSessionResponse | null> => {
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
            return data;
        } catch (error: any) {
            console.error('Init game session failed:', error.message);
            toast.error(error.message);
            return null;
        }
    },

    getGameSession: async (roomPin: string): Promise<any | null> => {
        try {
            const response = await apiFetch(`/game-session/get-game-session-and-room-pin/${roomPin}`, {
                method: 'GET',
            });

            const data = await handleApiResponse(response);
            return data;
        } catch (error: any) {
            console.error('Get room pin failed:', error.message);
            toast.error(error.message);
            return null;
        }
    },

    verifyRoomPin: async (roomPin: string): Promise<any | null> => {
        try {
            const response = await apiFetch(`/game-session/verify-pin/${roomPin}`, {
                method: 'GET'
            })

            const data = await handleApiResponse(response);

            return data;
        } catch (error: any) {
            console.error('Get room pin failed:', error.message);
            toast.error(error.message);
            return null;
        }
    }
};