export interface PagedResult<T> {
    data: T[],
    metadata: PaginationMetadata
}

export interface PaginationMetadata {
    currentPage: number,
    pageSize: number,
    totalCount: number,
    totalPages: number,
    hasNext: boolean,
    hasPrevious: boolean
}

export interface PaginationParameters {
    pageNumber: number,
    pageSize: number,
    filterQuery: string | null
}
