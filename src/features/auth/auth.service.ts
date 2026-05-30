import { apiFetch, handleApiResponse } from "@/lib/api";
import { 
    AuthResponse, 
    RefreshTokenResponse,
    PasswordResetResponse,
    ChangePasswordResponse,
    DeleteAccountResponse
} from "@/types/api";
import { toast } from "react-toastify";

export const authService = {
    login: async (email: string, password: string): Promise<AuthResponse | null> => {
        try {
            const response = await apiFetch('/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
                skipAuth: true,
            });
            
            const data = await handleApiResponse<AuthResponse>(response);
            
            localStorage.setItem('accessToken', data.access_token);
            localStorage.setItem('refreshToken', data.refresh_token);
            toast.success("Đăng nhập thành công");
            
            return data;
        } catch (error: any) {
            console.error('Login failed:', error.message);
            toast.error(error.message);
            return null;
        }
    },

    register: async (email: string, username: string, password: string): Promise<AuthResponse | null> => {
        try {
            const response = await apiFetch('/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, username, password }),
                skipAuth: true,
            });
            
            const data = await handleApiResponse<AuthResponse>(response);
            
            localStorage.setItem('accessToken', data.access_token);
            localStorage.setItem('refreshToken', data.refresh_token);
            toast.success("Đăng ký thành công");
            
            return data;
        } catch (error: any) {
            console.error('Registration failed:', error.message);
            toast.error(error.message);
            return null;
        }
    },

    refreshToken: async (refreshToken: string): Promise<string | null> => {
        try {
            const response = await apiFetch('/auth/refresh-token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${refreshToken}`,
                },
                skipAuth: true,
            });
            
            const data = await handleApiResponse<RefreshTokenResponse>(response);
            
            localStorage.setItem('accessToken', data.new_access_token);
            localStorage.setItem('refreshToken', data.new_refresh_token);

            return data.new_access_token;
        } catch (error: any) {
            console.error('Token refresh failed:', error.message);
            return null;
        }
    },

    logout: async (): Promise<boolean> => {
        try {
            const response = await apiFetch('/auth/logout', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            
            await handleApiResponse(response);
            localStorage.clear();
            window.location.href = '/login';
            
            return true;
        } catch (error: any) {
            console.error('Logout failed:', error.message);
            localStorage.clear();
            return false;
        }
    },
    
    forgotPassword: async (email: string): Promise<PasswordResetResponse> => {
        try {
            const response = await apiFetch('/auth/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
                skipAuth: true,
            });

            await handleApiResponse(response);
            toast.success("Email xác nhận đã được gửi");
            
            return { success: true };
        } catch (error: any) {
            console.error('Forgot password failed:', error.message);
            toast.error(error.message);
            return { success: false, message: error.message };
        }
    },
    
    changePassword: async (email: string, token: string, newPassword: string): Promise<ChangePasswordResponse> => {
        try {
            const response = await apiFetch('/auth/change-password', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, token, newPassword }),
                skipAuth: true,
            });

            const data = await handleApiResponse(response);
            toast.success("Đổi mật khẩu thành công");
            
            return { success: true, data };
        } catch (error: any) {
            console.error('Change password failed:', error.message);
            toast.error(error.message);
            return { success: false, message: error.message };
        }
    },

    sendDeleteAccount: async (email: string): Promise<PasswordResetResponse> => {
        try {
            const response = await apiFetch('/auth/delete-account', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
                skipAuth: true,
            });

            await handleApiResponse(response);
            toast.success("Email xác nhận xóa tài khoản đã được gửi");
            
            return { success: true };
        } catch (error: any) {
            console.error('Send delete account email failed:', error.message);
            toast.error(error.message);
            return { success: false, message: error.message };
        }
    },

    deleteAccount: async (email: string, token: string): Promise<DeleteAccountResponse> => {
        try {
            const response = await apiFetch('/auth/delete-account/confirm', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, token }),
                skipAuth: true,
            });

            const data = await handleApiResponse(response);
            localStorage.clear();
            toast.success("Tài khoản đã được xóa thành công");
            window.location.href = '/login';
            
            return { success: true, data };
        } catch (error: any) {
            console.error('Delete account failed:', error.message);
            toast.error(error.message);
            return { success: false, message: error.message };
        }
    },
};