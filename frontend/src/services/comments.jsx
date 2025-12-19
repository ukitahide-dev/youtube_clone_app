import axios from "axios";
import { VIDEOS_API } from "./api";






// 動画に紐づくコメントを取得する
export async function fetchVideoComments(token, videoId) {
    try {
        const res = await axios.get(`${VIDEOS_API}/videos/${videoId}/`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        return res.data.comments;
    } catch(err) {
        console.error('コメント取得失敗', err);
    }




}






// コメント投稿処理
export async function commentPost(token, videoId, commentText) {
    try {
        const res = await axios.post(
            `${VIDEOS_API}/comments/`,
            { video: videoId, text: commentText },
            { headers: { Authorization: `Bearer ${token}` } }
        )
        return res.data;

    } catch (err) {
        console.error(err)
    }

}




// コメント編集処理
export async function commentEdit(token, commentId, editingText) {
    try {
        const res = await axios.patch(`${VIDEOS_API}/comments/${commentId}/`,
            {text: editingText},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
        );

    } catch (err) {
        console.error('コメント編集に失敗', err);
    }
}







// コメント削除処理
export async function commentDelete(token, commentId) {
    try {
        await axios.delete(`${VIDEOS_API}/comments/${commentId}/`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
    } catch (err) {
        console.error('コメント削除に失敗', err);
    }





}
