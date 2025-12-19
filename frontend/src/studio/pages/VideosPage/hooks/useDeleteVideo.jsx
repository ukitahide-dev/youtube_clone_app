


// ----services----
import { deleteVideo } from "../../../../services/videos.jsx";




// 役割: 動画削除処理ロジック(API呼び出し)を担当する


export function useDeleteVideo() {

    const handleDelete = async (videoId, accessToken) => {

        try {
            await deleteVideo(videoId, accessToken);
            return true;
        } catch (err) {
            console.error("削除失敗:", err);
            return false;
        }

    }


    return { handleDelete };


}
