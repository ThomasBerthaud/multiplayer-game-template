import { isRouteErrorResponse } from '@remix-run/react';

export class ApiError extends Error {
    status: number;
    constructor(message: string, status: number = 500) {
        super(message);
        this.status = status;
    }
}

export function isApiError(error: unknown): error is ApiError {
    return error instanceof ApiError;
}

export function getApiErrorMessage(error: unknown): string {
    if (isApiError(error)) {
        return error.message;
    }
    return 'An unknown error occurred';
}

export function parseErrorStatus(error: unknown): number {
    if (isRouteErrorResponse(error)) {
        return error.status;
    }
    return 500;
}

export function parseErrorStatusText(error: unknown): string {
    if (isRouteErrorResponse(error)) {
        return error.statusText;
    }
    return 'Internal Server Error';
}

export function parseErrorMessage(error: unknown): string {
    if (isRouteErrorResponse(error)) {
        return error.data;
    }
    return 'An unknown error occurred';
}
