// This file defines the types and interfaces used throughout the project to ensure type safety and avoid using 'any'.

export interface DataRecord {
    id: number;
    name: string;
    age: number;
    email: string;
    // Add other fields as necessary based on the xlsx structure
}

export interface QueryParams {
    page: number;
    limit: number;
    search?: string;
}

export interface ImportResponse {
    success: boolean;
    message: string;
    importedCount?: number;
}

export interface CacheData {
    key: string;
    value: DataRecord[];
    expiration: number; // in seconds
}