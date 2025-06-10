export type Page<T> = {
    content: T[]
    page: {
        size: number
        number: number
        totalPages: number
        totalElements: number
    }
}