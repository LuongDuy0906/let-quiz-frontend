const ACCESS_TOKEN_KEY = 'accessToken';

export function getAccessToken(): string | null {
    if (typeof window === 'undefined') {
        return null;
    }
    return localStorage.getItem(ACCESS_TOKEN_KEY);
}