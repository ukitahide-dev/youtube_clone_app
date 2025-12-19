import axios from 'axios';
import { VIDEOS_API } from './api';




export async function fetchVideos() {
    const res = await axios.get(`${VIDEOS_API}/videos/`);
    return res.data;
}




// 動画詳細を取得する
export async function fetchVideoDetail(videoId) {
    const res = await axios.get(`${VIDEOS_API}/videos/${videoId}/`);
    return res.data;

}




// 自分が投稿した動画を取得する
export async function fetchMyVideos(accessToken) {
    const res = await axios.get(`${VIDEOS_API}/videos/my-videos`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        },
    });

    return res.data;
}




// React 側から Django API に動画を送信する関数。
export async function uploadVideo(formData, accessToken) {  // components/VideoUploadPage.jsxから呼ばれる。formData：FormData（動画ファイル・サムネ・タイトルなどのデータ）。accessToken：ログインユーザーの JWT アクセストークン（誰が投稿しているかをサーバーが判別するため）
    console.log(`accessToken: ${accessToken}`);
    return await axios.post(`${VIDEOS_API}/videos/`, formData, {  // formData：送るデータ本体
        headers: {
            "Authorization": `Bearer ${accessToken}`,  // "Authorization": "Bearer …" → 認証情報（ログインしているユーザーか確認する）
            "Content-Type": "multipart/form-data",  // "Content-Type": "multipart/form-data" → ファイルも送れる形式。
        }
    })
}




export async function fetchSubscribedVideos(accessToken) {
    try {
        const response = await axios.get(`${VIDEOS_API}/videos/subscribed_videos/`, {  // VideoViewSetのカスタムメソッドdef subscribed_videos(self, request):を実行する。
            headers: {
                "Authorization": `Bearer ${accessToken}`,
            },
        });
        return response.data;
    } catch (err) {
        console.error('登録チャンネル動画の取得に失敗', err);
    }
}






export async function toggleLikeVideo(token, videoId) {
    try {
        await axios.post(
            `${VIDEOS_API}/videos/${videoId}/like/`,
            {},
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        )
    } catch (err) {
        console.error('いいね解除失敗', err)
    }
}









// 自分が投稿した動画を削除する
export async function deleteVideo(videoId, accessToken) {
    const res = await axios.delete(`${VIDEOS_API}/videos/${videoId}/`, {  // video_views.pyのVideoViewSet。ModelViewSetを継承しているから、apiを呼ぶだけで内部で自動的にdestroyメソッドが実行され動画を削除できる。
        headers: {Authorization: `Bearer ${accessToken}`},
    });

    return res.data;
}




// 投稿した動画を編集する
export async function updateVideo(videoId, updatedData, accessToken) {
    try {
        const res = await axios.patch(
            `${VIDEOS_API}/videos/${videoId}/`,
            updatedData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${accessToken}`,
                }
            }
        )
        return res.data;

    } catch (err) {
        console.error("動画の更新に失敗しました:", err);

        if (err.response) {
            console.error("サーバーからのエラー内容:", err.response.data);
        }
        return null;
    }


}




// 検索結果の動画を取得する
export async function fetchSearchedVideos(query) {
    try {
        const res = await axios.get(`${VIDEOS_API}/videos/?search=${encodeURIComponent(query)}`);
        return res.data;
    } catch (err) {
        console.error('検索失敗', err);
    }

}




// 関連動画を取得する
export async function fetchRelatedVideos(token, videoId) {
    try {
        const res = await axios.get(`${VIDEOS_API}/videos/${videoId}/related_videos/`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
        );
        return res.data;
    } catch (err) {
        console.error('関連動画取得失敗', err);
    }

}
