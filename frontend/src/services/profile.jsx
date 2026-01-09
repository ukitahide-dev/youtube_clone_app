import axios from 'axios';


// ----services----
import { USERS_API } from './api';





// プロフィールアイコンを変更する(開発用)
export async function uploadProfileIcon(token, file) {
    const formData = new FormData();
    formData.append('profile_icon', file);

    const res = await axios.post(`${USERS_API}/profile-icon/`,
        formData,
        {
            headers: {
                "Authorization": `Bearer ${token}`,
            }
        }
    )

    return res.data;

}



// プロフィールアイコンを変更する(本番用)
export async function uploadProfileIconByUrl(token, url) {
    const res = await axios.post(
        `${USERS_API}/profile-icon-url/`,
        {
            profile_icon_url: url
        },
        {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            }
        }
    )
    return res.data;
}
