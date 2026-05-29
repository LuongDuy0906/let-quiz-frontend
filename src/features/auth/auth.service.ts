import { apiFetch } from "@/lib/api";
import { skip } from "node:test";
import { toast } from "react-toastify";

export const authService = {
    login: async (email: string, password: string) => {
        try {
            const response = await apiFetch('/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', 
                },
                body: JSON.stringify({ email, password }),
                skipAuth: true,
            });
            const data = await response.json();
            if (!response.ok) {
                console.error('Login failed:', data.message);
                return;
            }
            try {
                localStorage.setItem('accessToken', data.access_token);
                localStorage.setItem('refreshToken', data.refresh_token);
            } catch (error) {
                console.error('Failed to save access token:', error);
            }
            toast.success("Đăng nhập thành công");
            return 'Đăng nhập thành công'
        } catch (error) {
            console.error('An error occurred during login:', error);
        }
    },

    register: async (email: string, username: string, password: string) => {
        try {
            const response = await apiFetch('/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, username, password }),
                skipAuth: true,
            });
            const data = await response.json();
            console.log('Registration response:', data);
            if (!response.ok) {
                console.error('Registration failed:', data.message);
                return;
            }
            try {
                localStorage.setItem('accessToken', data.access_token);
                localStorage.setItem('refreshToken', data.refresh_token);
            } catch (error) {
                console.error('Failed to save access token:', error);
            }
        } catch (error) {
            console.error('An error occurred during registration:', error);
        }
    },

    refreshToken: async (refreshToken: string) => {
        try {
            const response = await apiFetch('/auth/refresh-token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${refreshToken}`,
                },
                skipAuth: true,
            });
            const data = await response.json();
            if (!response.ok) {
                console.error('Token refresh failed:', data.message);
                return;
            }
            try {
                localStorage.setItem('accessToken', data.new_access_token);
                localStorage.setItem('refreshToken', data.new_refresh_token);

                return data.new_access_token;
            } catch (error) {
                console.error('Failed to save access token:', error);
            }
        } catch (error) {
            console.error('An error occurred during token refresh:', error);
        }
    },

    logout: async (accessToken: string) => {
        try {
            const response = await apiFetch('auth/logout', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                skipAuth: true,
            })

            if (!response.ok) {
                console.error('Server logout failed, continuing with client cleanup...');
            }
        } catch (e) {
            console.error('Network error during logout:', e);
        } finally {
            try {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                
                window.location.href = '/'; 
            } catch (e) {
                console.error('Failed to remove token from storage:', e);
            }
        }
    },

    forgotPassword: async (email: string) => {
        const token = localStorage.getItem('accessToken');

        try{
            const response = await apiFetch('auth/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                skipAuth: true,
                body: JSON.stringify({email}),
            });

            if(!response.ok){
                const errorData = await response.json(); 
                console.log("Lỗi khi gửi email:", errorData);
                return { success: false, message: errorData.message };
            }

            return { success: true };

        } catch (e) {
            console.log("Something went wrong", e);
            return { success: false, message: "Lỗi kết nối" };
        }
    },

    changePassword: async (email: string, token: string, newPassword: string) => {
        const accessToken = localStorage.getItem('accessToken');

        try {
            const response = await apiFetch('auth/change-password', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                skipAuth: true,
                body: JSON.stringify({email, token, newPassword}),
            });

            const data = await response.json();

            if (!response.ok) {
                console.error("Lỗi đổi mật khẩu:", data);
                return { success: false, message: data.message || "Không thể đổi mật khẩu" };
            }

            return { success: true, data };
        } catch (e) {
            console.log("Something went wrong", e);
            return { success: false, message: "Lỗi kết nối" };
        }
    },

    sendDeleteAccount: async (email: string) => {
        const accessToken = localStorage.getItem('accessToken');

        try{
            const response = await apiFetch('auth/delete-account', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                skipAuth: true,
                body: JSON.stringify({email}),
            });

            if(!response.ok){
                const errorData = await response.json(); 
                console.log("Lỗi khi gửi email:", errorData);
                return { success: false, message: errorData.message };
            }

            return { success: true };

        } catch (e) {
            console.log("Something went wrong", e);
            return { success: false, message: "Lỗi kết nối" };
        }
    },

    deleteAccount: async (email: string, token: string) => {
        const accessToken = localStorage.getItem('accessToken');

        try {
            const response = await apiFetch('auth/delete-account/confirm', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                skipAuth: true,
                body: JSON.stringify({email, token}),
            });

            const data = await response.json();

            if (!response.ok) {
                console.error("Lỗi xóa tài khoản:", data);
                return { success: false, message: data.message || "Không thể xóa tài khoản" };
            }

            return { success: true, data };
        } catch (e) {
            console.log("Something went wrong", e);
            return { success: false, message: "Lỗi kết nối" };
        }
    },
}