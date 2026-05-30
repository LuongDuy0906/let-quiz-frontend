import { API_BASE_URL } from "@/constants/constants";
import { authService } from "@/features/auth/auth.service";

let refreshingPromise: Promise<string | null> | null = null;

export async function apiFetch(path: string, options: any = {}): Promise<Response> {
    const { skipAuth, _retry, ...rest } = options;
    
    const token = localStorage.getItem('accessToken');
    const headers = new Headers(rest.headers);
    
    if (token && !skipAuth) {
        headers.set('Authorization', `Bearer ${token}`);
    }

    let response = await fetch(
        `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`, 
        { ...rest, headers }
    );

    if (response.status === 401 && !skipAuth && !_retry) {
        const rt = localStorage.getItem('refreshToken');
        if (!rt) return response;

        if (!refreshingPromise) {
            refreshingPromise = authService.refreshToken(rt);
        }

        const newToken = await refreshingPromise;
        refreshingPromise = null;

        if (newToken) {
            return apiFetch(path, { ...options, _retry: true });
        } else {
            localStorage.clear();
            window.location.href = '/login';
        }
    }

    return response;
}

export async function handleApiResponse<T = any>(response: Response): Promise<T> {
    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw {
            status: response.status,
            message: Array.isArray(error.message)
                ? error.message.join(", ")
                : error.message || "Đã xảy ra lỗi không xác định",
            data: error
        };
    }
    return response.json() as Promise<T>;
}