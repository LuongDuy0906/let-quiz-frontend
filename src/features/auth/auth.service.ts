import { apiFetch } from "@/lib/api";

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
                body: JSON.stringify({ refresh_token: refreshToken }),
            });
            const data = await response.json();
            if (!response.ok) {
                console.error('Token refresh failed:', data.message);
                return;
            }
            try {
                localStorage.setItem('accessToken', data.access_token);
                localStorage.setItem('refreshToken', data.refresh_token);

                return data.access_token;
            } catch (error) {
                console.error('Failed to save access token:', error);
            }
        } catch (error) {
            console.error('An error occurred during token refresh:', error);
        }
    }
}