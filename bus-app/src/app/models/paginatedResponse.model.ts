export interface PaginatedResponse<T> {
    docs: T[];
    meta: {
        totalDocs: number;
        totalPages: number;
        currentPage: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    }
}