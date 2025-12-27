// ----react----
import { useContext, useState } from 'react'


// ----context----
import { AuthContext } from '../../../context/AuthContext'


// ----components/common----
import PlaylistEditModal from '../../../components/common/PlaylistEditModal/PlaylistEditModal'
import DeleteConfirmModal from '../../../components/common/DeleteConfirmModal/DeleteConfirmModal'


// ----services----
import { deletePlaylist, updatePlaylist } from '../../../services/playlists'


// ----css----
import PlaylistModalActionsStyles from './PlaylistModalActions.module.css'


//  -----fontAwsome-----
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons'
import { faEdit } from '@fortawesome/free-regular-svg-icons'






// 親: PlaylistCard.jsx、PlaylistPart.jsx
// 役割: 視聴用プレイリスト自体の編集・削除メニューの表示。





function PlaylistModalActions({ playlist, onCancel, setPlaylists }) {
    const { accessToken } = useContext(AuthContext)
    const [activeModal, setActiveModal] = useState(null);
    const [newName, setNewName] = useState(playlist.name)



    async function handleDeletePlaylist(accessToken, playlistId) {
        try {
            await deletePlaylist(accessToken, playlistId);

            alert('プレイリストを削除しました');
            setPlaylists((prev) => prev.filter((pl) => pl.id !== playlistId));
        } catch (err) {
            console.error('プレイリスト削除に失敗しました');
        }
    }



    async function handleEditPlaylist(playlistId, newName) {
        try {
            const updated = await updatePlaylist(playlistId, newName, accessToken);

            if (updated) {
                setPlaylists((prev) => prev.map(pl => pl.id === playlistId ? {...pl, name: newName} : pl));
            }

            onCancel();

        } catch (err) {
            console.error('プレイリスト編集に失敗しました', err)
        }
    }




    return (
        <>
            {!activeModal && (
                <div
                    className={PlaylistModalActionsStyles.modal}
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        className={PlaylistModalActionsStyles.editPlaylist}
                        onClick={() => setActiveModal('edit')}
                    >
                        <FontAwesomeIcon icon={faEdit} size="lg" />
                        編集
                    </button>
                    <button
                        className={PlaylistModalActionsStyles.deletePlaylist}
                        onClick={() => setActiveModal('delete')}
                    >
                        <FontAwesomeIcon icon={faTrashAlt} size="lg" />
                        削除
                    </button>
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


            {/* 編集モーダル */}
            {activeModal === 'edit' && (
                <PlaylistEditModal
                    playlist={playlist}
                    onCancel={onCancel}
                    onEdit={handleEditPlaylist}
                />
            )}

        </>

    )
}

export default PlaylistModalActions
