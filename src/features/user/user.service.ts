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
    },

    updateAvatar: async (file: File) => {
        const token = localStorage.getItem('accessToken');
        const formData = new FormData();

        formData.append('image', file);

        const response = await apiFetch('user/profile/avatar', {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: formData
        })

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Cập nhật ảnh thất bại');
        }

        return response.json();
    },

    updateProfile: async (username: string) => {
        const token = localStorage.getItem('accessToken');

        try {
            const response = await apiFetch('user/profile', {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                    
                },
                body: JSON.stringify({username: username}),
                skipAuth: true
            })

            if(!response.ok){
                const error = await response.json();
                console.log('Lỗi khi cập nhật hồ sơ', error);
                return null;
            }

            const result = response.json();
            return result;
        } catch (e) {
            console.log("Lỗi khi cập nhật hồ sơ", e);
        }
    }
}