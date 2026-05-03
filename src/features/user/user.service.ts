import { apiFetch } from "@/lib/api"

export const userService = {
    getMe: async (token: string) => {
        try {
            const response = await apiFetch('user/me', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if(!response.ok){
                const errorData = await response.json();
                console.error('Failed to fetch user profile', errorData);
                return null;
            }

            const result = response.json();
            return result;
        }
        catch (e) {
            console.error('Lỗi khi gọi API:', e);
            return null;
        }
    },

    getLibrary: async (token: string, page: number, limit: number) => {
        try {
            const response = await apiFetch(`user/library?page=${page}&limit=${limit}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if(!response.ok){
                const errorData = await response.json();
                console.error('Failed to fetch user profile', errorData);
                return null;
            }

            const result = response.json();
            return result;
        }
        catch (e) {
            console.error('Lỗi khi gọi API:', e);
            return null;
        }
    }
}