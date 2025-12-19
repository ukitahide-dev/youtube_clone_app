import axios from "axios";
import { VIDEOS_API } from "./api";




export async function fetchLikedVideos(token) {
    try {
        const res = await axios.get(`${VIDEOS_API}/liked-videos`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
        );
        return res.data;
    } catch (err) {
        console.error('いいねした動画取得に失敗', err);
    }




}
