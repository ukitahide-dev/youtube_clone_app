import axios from "axios";
import { VIDEOS_API } from "./api";




// 全カテゴリーを取得する
export const fetchCategories = async (token) => {
    try {
        const res = await axios.get(`${VIDEOS_API}/categories/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return res.data;


    } catch (err) {
        console.error('カテゴリー取得失敗', err);
    }
}
