// ----react----
import { useContext, useState } from 'react';


// ----services----
import { createViewerPlaylist, makeUploaderPlaylist } from '../../../services/playlists';


// ----context----
import { AuthContext } from '../../../context/AuthContext';


//  ----css----
import CreatePlaylistModalStyles from './CreatePlaylistModal.module.css';






// 親: PlaylistsModal.jsx
// 役割: 新しくプレイリストを作る。(動画も一緒に保存される。)


function CreatePlaylistModal({ video, playlistType, setActiveModal, }) {
    const { accessToken } = useContext(AuthContext);
    const [newPlaylistName, setNewPlaylistName] = useState('');



    // 新しくプレイリストを作る(選択中の動画もその中に保存される)
    async function handleCreatePlaylist() {
        try {
            if (playlistType === 'viewer') {
                await createViewerPlaylist(accessToken, video.id, newPlaylistName);
            } else {
                await makeUploaderPlaylist(accessToken, video.id, newPlaylistName);
            }
            setNewPlaylistName('');
            setActiveModal(null);

        } catch (err) {
            console.error('プレイリスト作成に失敗', err);
        }
    }




    return (
        <div className={CreatePlaylistModalStyles.modalOverlay}>
            <div className={CreatePlaylistModalStyles.modal}>
                <h3>新しいプレイリスト</h3>
                <input
                    placeholder="タイトルを入力してください"
                    value={newPlaylistName}
                    onChange={(e) => setNewPlaylistName(e.target.value)}
                />

                <div className={CreatePlaylistModalStyles.buttons}>
                    <button
                        className={CreatePlaylistModalStyles.cancel}
                        onClick={() => setActiveModal(null)}  // 根本の親PlaylistSidebar.jsxに伝える。これで全部リセットできる。
                    >
                        キャンセル
                    </button>
                    <button
                        className={CreatePlaylistModalStyles.save}
                        onClick={handleCreatePlaylist}
                    >
                        保存
                    </button>
                </div>
            </div>
        </div>
    )
}


export default CreatePlaylistModal;
