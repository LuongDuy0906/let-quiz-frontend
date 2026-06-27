import { QuizTag } from "@/constants/constants";

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
    questions: any[];
    image?: string;
    tag: QuizTag[];
    status: string;
    isAiGenerated: boolean;
    totalQuestions: number;
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