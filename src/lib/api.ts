import { API_BASE_URL } from "@/constants/constants";
import { getAccessToken } from "./auth";

type RequestInitAuth = RequestInit & { skipAuth?: boolean };

export async function apiFetch(path: string, options: RequestInitAuth = {}): Promise<Response> {
    const {skipAuth, ...rest} = options;
    const url = path.startsWith('http') ? path : `${API_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
    const token = skipAuth ? null : getAccessToken();
    const headers = new Headers(rest.headers as HeadersInit);
    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }
    const fetchOptions: RequestInit = {
        ...rest,
        headers
    };
    return fetch(url, fetchOptions);
}

export {API_BASE_URL};