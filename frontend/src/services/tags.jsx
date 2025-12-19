import axios from "axios";
import { VIDEOS_API } from "./api";




// 全タグを取得する
export const fetchTags = async (token) => {
    try {
        const res = await axios.get(`${VIDEOS_API}/tags/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return res.data;

    } catch (err) {
        console.error('タグ取得に失敗', err);
    }




}
