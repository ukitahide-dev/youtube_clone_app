import axios from "axios";
import { VIDEOS_API } from "./api";





export async function toggleCommentReaction(token, commentId, isLiked) {
    try {
         await axios.post(
            `${VIDEOS_API}/comment-reactions/toggle/`,
            { comment_id: commentId, is_liked: isLiked },
            { headers: { Authorization: `Bearer ${token}` } }
        )
    } catch (err) {
        console.err('コメントリアクション失敗', err);
    }




}
