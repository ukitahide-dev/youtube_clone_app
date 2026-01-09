
import { BASE_URL } from "../services/api";




export function getProfileIconSrc(user) {
    if (!user) {
        return '/images/default-profile-icon.jpg';
    }

    // 本番用(外部画像url)
    if (user.profile_icon_url) {
        return user.profile_icon_url;
    }

    // 開発用(サーバー内ファイル)
    if (user.profile_icon) {
        return `${BASE_URL}/${user.profile_icon}`;
    }

    return '/images/default-profile-icon.jpg';
}

