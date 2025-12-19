// ----react----
import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'


// ----services----
import { deletePlaylist, deleteUploaderPlaylist } from '../../../../../services/playlists'


// ----context----
import { AuthContext } from '../../../../../context/AuthContext'


// ----components/common
import DeleteConfirmModal from '../../../../../components/common/DeleteConfirmModal/DeleteConfirmModal'

// import { toast } from 'react-toastify';

// ----css----
import PlaylistModalMenuStyles from './PlaylistModalMenu.module.css';


//  -----fontAwsome-----
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons'
import { faEdit } from '@fortawesome/free-regular-svg-icons'







// 親: studio/PlaylistsPage.jsx
// 役割: 投稿用プレイリスト削除・編集モーダル表示。activeTabがviewerかuploaderで場合分け。



function PlaylistModalMenu({ playlist, activeTab, onCancel, setViewerPlaylists, setUploaderPlaylists}) {
    const { accessToken } = useContext(AuthContext);
    const navigate = useNavigate();

    const [activeModal, setActiveModal] = useState(null);




    async function handleDeletePlaylist(accessToken, playlistId) {
        try {
            if (activeTab === 'viewer') {
                await deletePlaylist(accessToken, playlistId);
                setViewerPlaylists(prev => prev.filter(p => p.id !== playlistId)); // 親のPlaylistsPage.jsxにプレイリスト削除を伝える
            } else {
                await deleteUploaderPlaylist(accessToken, playlistId);
                setUploaderPlaylists(prev => prev.filter(p => p.id !== playlistId));  // 親のPlaylistsPage.jsxにプレイリスト削除を伝える
            }
            alert('プレイリストを削除しました');
            // toast.success('プレイリストを削除しました');

        } catch (err) {
            console.error('プレイリスト削除に失敗しました');
        }
    }



    return (
        <>
            {!activeModal && (
                <div
                    className={PlaylistModalMenuStyles.modal}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className={PlaylistModalMenuStyles.buttons}>
                        <button
                            className={PlaylistModalMenuStyles.editPlaylist}
                            // viewer/PlaylistDetailPageに飛ぶ
                            onClick={() => navigate(`/playlists/${activeTab}/${playlist.id}`)}
                        >
                            <FontAwesomeIcon icon={faEdit} size="lg" />
                            編集
                        </button>
                        <button
                            className={PlaylistModalMenuStyles.deletePlaylist}
                            onClick={() => setActiveModal('delete')}
                        >
                            <FontAwesomeIcon icon={faTrashAlt} size="lg" />
                            削除
                        </button>
                    </div>
                </div>
            )}

            {/* 削除モーダル */}
            {activeModal === 'delete' && (
                <DeleteConfirmModal
                    message="プレイリストを削除しますか？"
                    onCancel={onCancel}
                    onConfirm={() => handleDeletePlaylist(accessToken, playlist.id)}
                />

            )}

        </>

    )

}


export default PlaylistModalMenu;
