import { apiFetch, handleApiResponse } from "@/lib/api";
import { UserResponse, LibraryResponse } from "@/types/api";
import { toast } from "react-toastify";

export const userService = {
    getMe: async (): Promise<UserResponse | null> => {
        try {
            const response = await apiFetch('/user/me', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await handleApiResponse<UserResponse>(response);
            return data;
        } catch (error: any) {
            console.error('Failed to fetch user profile:', error.message);
            return null;
        }
    },

    getLibrary: async (page: number = 1, limit: number = 6): Promise<LibraryResponse | null> => {
        try {
            const response = await apiFetch(
                `/user/library?page=${page}&limit=${limit}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            
            const data = await handleApiResponse<LibraryResponse>(response);
            return data;
        } catch (error: any) {
            console.error('Failed to fetch library:', error.message);
            return null;
        }
    },

    updateAvatar: async (file: File): Promise<any | null> => {
        try {
            const formData = new FormData();
            formData.append('image', file);

            const response = await apiFetch('/user/profile/avatar', {
                method: 'PATCH',
                body: formData
            });

            const data = await handleApiResponse(response);
            toast.success("Cập nhật ảnh đại diện thành công");
            
            return data;
        } catch (error: any) {
            console.error('Update avatar failed:', error.message);
            toast.error(error.message);
            return null;
        }
    },

    updateProfile: async (username: string): Promise<UserResponse | null> => {
        try {
            const response = await apiFetch('/user/profile', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username }),
            });

            const data = await handleApiResponse<UserResponse>(response);
            toast.success("Cập nhật hồ sơ thành công");
            
            return data;
        } catch (error: any) {
            console.error('Update profile failed:', error.message);
            toast.error(error.message);
            return null;
        }
    }
};