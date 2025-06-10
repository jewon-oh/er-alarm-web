export function LoadingOverlay({isFetching, isLoading}:{isFetching: boolean, isLoading: boolean}) {
    return(
        // absolute  먹여서 overlay 처럼
        <div
            className={
                `absolute inset-0 flex items-center justify-center bg-white bg-opacity-60 pointer-events-none transition-opacity duration-300 ` +
                `${isLoading || isFetching ? "opacity-100" : "opacity-0"}`
            }
        >
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-600"></div>
        </div>
    )
}