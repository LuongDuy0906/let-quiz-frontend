// Responses
export interface AuthResponse {
    access_token: string;
    refresh_token: string;
}

export interface RefreshTokenResponse {
    new_access_token: string;
    new_refresh_token: string;
}

export interface UserResponse {
    id: string;
    email: string;
    username: string;
    avatar?: string;
}

export interface PaginationResponse {
    currentPage: number,
    limit: number,
    totalPages: number,
    totalItems: number
}

export interface LibraryResponse {
    data: any[];
    pagination: PaginationResponse;
}

export interface QuizResponse {
    id: string;
    title: string;
    description?: string;
    image?: string;
}

export interface QuizzesResponse {
    data: QuizResponse[];
    total: number;
    title: string;
}

export interface ImageUploadResponse {
    image: string;
}

export interface GameSessionResponse {
    sessionId: string;
    pin: string;
}

export interface VerifyPinResponse {
    sessionId: string;
    [key: string]: any;
}

export interface ApiError {
    status: number;
    message: string;
    data?: any;
}

export interface PasswordResetResponse {
    success: boolean;
    message?: string;
}

export interface ChangePasswordResponse {
    success: boolean;
    message?: string;
    data?: any;
}

export interface DeleteAccountResponse {
    success: boolean;
    message?: string;
    data?: any;
}