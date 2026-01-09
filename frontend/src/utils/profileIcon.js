
import { BASE_URL } from "../services/api";




export function getProfileIconSrc(iconOwner) {
    if (!iconOwner) {
        return '/images/default-profile-icon.jpg';
    }

    // 本番用(外部画像url)
    if (iconOwner.profile_icon_url) {
        return iconOwner.profile_icon_url;
    }

    // 開発用(サーバー内ファイル)
    if (iconOwner.profile_icon) {
        return `${BASE_URL}/${iconOwner.profile_icon}`;
    }

    return '/images/default-profile-icon.jpg';
}

