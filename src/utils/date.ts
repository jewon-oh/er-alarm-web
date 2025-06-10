// utils/date.ts

export function formatDate(d: Date) {
    return d.toISOString().split("T")[0];
}
export function formatKoreanDate(isoString: string) {
    return new Date(isoString).toLocaleString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export function isDateStringAfterToday  (dateString: string) {
    const today = new Date()
    const date = new Date(dateString)
    return date > today
}