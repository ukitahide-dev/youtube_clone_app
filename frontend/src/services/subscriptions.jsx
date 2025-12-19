import axios from "axios";
import { VIDEOS_API } from "./api";



// ログインユーザーが登録しているチャンネルを取得する
export async function fetchSubscriptions(token) {
    try {
        const res = await axios.get(`${VIDEOS_API}/subscriptions/`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
        )

        return res.data;

    } catch (err) {
        console.error('登録チャンネル取得失敗', err);
    }
}




export async function fetchSubscribedChannels(token) {
    try {
        const res = await axios.get(`${VIDEOS_API}/subscriptions/subscribed-channels`, {   // views.py/SubscriptionViewSetのカスタムメソッドsubscribed-channelsを呼ぶ
            headers: {Authorization: `Bearer ${token}`},
        });
    } catch (err) {
        console.error("登録チャンネル一覧の取得に失敗:", err);
    }
}


