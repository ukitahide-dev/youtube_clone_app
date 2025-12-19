// utilsというフォルダに置いて、どのファイルからも使えるようにする。
// 役割: 動画投稿日から「何時間前 / 何日前 / 何年前」を返す関数



export function TimeSince(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    const intervals = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60,
    };

    if (seconds >= intervals.year) {
        const years = Math.floor(seconds / intervals.year);
        return `${years}年前`;
    } else if (seconds >= intervals.month) {
        const months = Math.floor(seconds / intervals.month);
        return `${months}か月前`;
    } else if (seconds >= intervals.week) {
        const weeks = Math.floor(seconds / intervals.week);
        return `${weeks}週間前`;
    } else if (seconds >= intervals.day) {
        const days = Math.floor(seconds / intervals.day);
        return `${days}日前`;
    } else if (seconds >= intervals.hour) {
        const hours = Math.floor(seconds / intervals.hour);
        return `${hours}時間前`;
    } else if (seconds >= intervals.minute) {
        const minutes = Math.floor(seconds / intervals.minute);
        return `${minutes}分前`;
    } else {
        return "たった今";
    }
}
