import axios from "axios";
import { VIDEOS_API } from "./api";




// チャンネル詳細を取得する
export async function fetchChannelDetail(uploaderId) {
    try {
        const res = await axios.get(`${VIDEOS_API}/uploaders/${uploaderId}/`);   
        return res.data;
    } catch (err) {
        console.error('チャンネル詳細の取得に失敗:', err)
    }
}






// チャンネル登録・解除の切り替え
export async function toggleSubscription(token, uploaderId) {
    try {
        const res = await axios.post(
            `${VIDEOS_API}/uploaders/${uploaderId}/toggle-subscription/`,  // UploaderViewSetのtoggle_subscriptionカスタム関数を実行
            {},
            {
                headers:
                    { Authorization: `Bearer ${token}` }
            }
        )
        return res.data;
    } catch (err) {
        console.error(err)
    }
}
