// 日付を整形する関数  ex) 2022/09/08
export function formatDate(isoString) {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDay()).padStart(2, '0');
    return `${year}/${month}/${day}`;
}
