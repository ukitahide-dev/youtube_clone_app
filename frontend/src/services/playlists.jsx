
import axios from "axios";
import { VIDEOS_API } from "./api";




// ----視聴用プレイリスト----


// プレイリストを全て取得する
export async function fetchViewerPlaylists(token) {
    try {
        const res = await axios.get(`${VIDEOS_API}/playlists`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return res.data;
    } catch (error) {
        console.error("プレイリスト取得失敗:", error);
        throw error;
    }
}




// プレイリスト単体を取得する
export async function fetchViewerDetailPlaylist(token, playlistId) {
    try {
        const res = await axios.get(`${VIDEOS_API}/playlists/${playlistId}/`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
        );
        return res.data;
    } catch (err) {
        console.error('視聴用プレイリスト取得失敗', err);
    }

}




// プレイリストの名前を変更する
export async function updatePlaylist(playlistId, newName, token) {
    try {
        const res = await axios.patch(`${VIDEOS_API}/playlists/${playlistId}/`,
            { name: newName },
            { headers: { Authorization: `Bearer ${token}`} }
        );

        return res.data;



    } catch (err) {
        console.error("プレイリスト変更に失敗:", err);
        return null;
    }

}



// 新しくプレイリストを作る
export async function createViewerPlaylist(token, videoId, newPlaylistName) {
    try {
        const res = await axios.post(
            `${VIDEOS_API}/playlists/`,
            {
                name: newPlaylistName,
                videos: [videoId],   // Playlist の videos フィールドはManyToMany（複数の動画を持てる）なので、配列で送る必要がある。
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
    } catch (err) {
        console.error(err)
        console.error('エラー詳細:', err.res?.data || err)
    }
}




// プレイリスト自体を削除する
export async function deletePlaylist(token, playlistId) {
    try {
        await axios.delete(`${VIDEOS_API}/playlists/${playlistId}/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    } catch (err) {
        console.error("❌ プレイリスト削除失敗:", err);
        throw err;
    }
}




// プレイリスト内の動画を削除する。フロントからは削除対象以外の動画IDを配列に抽出しサーバーに送る。
export async function deleteViewerPlaylistDetail(token, playlistId, data) {
    try {
        const res = await axios.patch(`${VIDEOS_API}/playlists/${playlistId}/`,
            data,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
        );
        return res.data;
    } catch (err) {
        console.error('プレイリスト内の動画削除に失敗しました', err);
    }


}




// プレイリストをトグルして動画を追加・削除する処理
export async function toggleViewerPlaylists(token, playlistId, videoId,) {
    try {
        const res = await axios.post(
            `${VIDEOS_API}/playlists/${playlistId}/toggle-video/`,  // PlaylistViewSetに定義したカスタムメソッドdef toggle_video(self, request, pk=None):を実行する。
            { video_id: videoId },
            { headers: { Authorization: `Bearer ${token}` } }
        )
        return res.data;

    } catch (err) {
        console.error('プレイリストのトグルに失敗しました', err);
    }


}









// -----投稿用プレイリスト-----


// プレイリストを全て取得する
export async function fetchUploaderPlaylists(token) {
    try {
        const res = await axios.get(`${VIDEOS_API}/uploader-playlists/`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
        );
        return res.data;
    } catch (err) {
        console.error('投稿用プレイリスト取得失敗', err);
    }

}




// プレイリスト単体を取得する
export async function fetchUploaderDetailPlaylist(token, playlistId) {
    try {
        const res = await axios.get(`${VIDEOS_API}/uploader-playlists/${playlistId}/`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
        );
        return res.data;
    } catch (err) {
        console.error('投稿用プレイリスト取得失敗', err);
    }

}






// プレイリストを作成する
export async function createUploaderPlaylist(token, playlistData) {
    try {
        const res = await axios.post(
            `${VIDEOS_API}/uploader-playlists/`,
            playlistData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            },
        );
        return res.data;
    } catch (err) {
        console.error("❌ 投稿用プレイリスト作成失敗:", err.response?.data || err);
        throw err;
    }
}




// 新しくプレイリストを作る。動画付きで。動画詳細ページから作るときの処理。
export async function makeUploaderPlaylist(token, videoId, newPlaylistName) {
    try {
        const res = await axios.post(
            `${VIDEOS_API}/uploader-playlists/`,
            {
                name: newPlaylistName,
                videos: [videoId],   // Playlist の videos フィールドはManyToMany（複数の動画を持てる）なので、配列で送る必要がある。
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
    } catch (err) {
        console.error(err)
        console.error('エラー詳細:', err.res?.data || err)
    }
}




// プレイリストを削除する
export async function deleteUploaderPlaylist(token, playlistId) {
    try {
        await axios.delete(`${VIDEOS_API}/uploader-playlists/${playlistId}/`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
        )
    } catch (err) {
        console.error("❌ プレイリスト削除失敗:", err);
        throw err;
    }


}





// プレイリスト内の動画を削除する
export async function deleteUploaderPlaylistDetail(token, playlistId, data) {
    try {
        const res = await axios.patch(`${VIDEOS_API}/uploader-playlists/${playlistId}/`,
            data,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
        );
        return res.data;
    } catch (err) {
        console.error('プレイリスト内の動画削除に失敗しました。', err);
    }




}





// プレイリストをトグルして動画を追加・削除する処理
export async function toggleUploaderPlaylists(token, playlistId, videoId,) {
    try {
        const res = await axios.post(
            `${VIDEOS_API}/uploader-playlists/${playlistId}/toggle-video/`,  // UploaderPlaylistViewSetに定義したカスタムメソッドdef toggle_video(self, request, pk=None):を実行する。
            { video_id: videoId },
            { headers: { Authorization: `Bearer ${token}` } }
        )
        return res.data;

    } catch (err) {
        console.error('プレイリストのトグルに失敗しました', err);
    }


}
