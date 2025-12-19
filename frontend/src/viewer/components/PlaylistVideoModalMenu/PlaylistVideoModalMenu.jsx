// ----react----
import { useContext, useState } from 'react';


// ----services----
import { deleteUploaderPlaylistDetail, deleteViewerPlaylistDetail } from '../../../services/playlists';


// ----context----
import { AuthContext } from '../../../context/AuthContext';


// ----components----
import PlaylistsModal from '../PlaylistsModal/PlaylistsModal';
import DeleteConfirmModal from '../../../components/common/DeleteConfirmModal/DeleteConfirmModal';


// ----css----
import PlaylistVideoModalMenuStyles from './PlaylistVideoModalMenu.module.css';


// -----fontAwsome-----
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons'
import { faBookmark } from "@fortawesome/free-regular-svg-icons";





// 親: viewer/PlaylistSidebar.jsx、viewer/PlaylistDetailPage.jsx
// 役割: プレイリスト内の各動画のモーダルメニューを開く



function PlaylistVideoModalMenu({ playlist, setPlaylist, video, type, setActiveModal, }) {
    const { user, accessToken } = useContext(AuthContext);

    const [activeModalMenu, setActiveModalMenu] = useState(null);
    const [isOpen, setIsOpen] = useState(true);
    const [playlistType, setPlaylistType] = useState('');



    // プレイリスト内の動画を削除する処理
    const handleDeleteVideo = async (videoId) => {
        try {
            // 削除対象以外の動画を抽出し、その動画IDを配列として保持する。
            const newVideos = playlist.video_details
                .filter(v => v.id !== videoId)
                .map(v => v.id);

            let updated;
            if (type === 'viewer') {
                updated = await deleteViewerPlaylistDetail(accessToken, playlist.id, {videos: newVideos});
            } else {
                updated = await deleteUploaderPlaylistDetail(accessToken, playlist.id, {videos: newVideos});
            }

            console.log("updated playlist:", updated);
            setPlaylist(updated);

        } catch (err) {
            console.error('プレイリスト内の動画削除に失敗しました。', err);
        }


    }



    return (

        <>
            {isOpen && (
            <div className={PlaylistVideoModalMenuStyles.modal}>
                <ul className={PlaylistVideoModalMenuStyles.menus}>
                    <li onClick={() => {
                        setActiveModalMenu('playlists');
                        setPlaylistType('viewer');
                        setIsOpen(false);
                    }}>
                        <span><FontAwesomeIcon icon={faBookmark} /></span>
                        <span>視聴用プレイリストに保存</span>
                    </li>
                    {user.id === video.uploader && (
                        <li onClick={() => {
                            setActiveModalMenu('playlists');
                            setPlaylistType('uploader');
                            setIsOpen(false);
                        }}>
                            <span><FontAwesomeIcon icon={faBookmark} /></span>
                            <span>投稿用プレイリストに保存</span>
                        </li>
                    )}

                    {type === "viewer" && (
                        <li onClick={(e) => {
                            setActiveModalMenu('delete');
                            setIsOpen(false);
                            e.stopPropagation();
                        }}>
                            <span><FontAwesomeIcon icon={faTrashAlt} /></span>
                            <span>{playlist.name}から削除</span>
                        </li>
                    )}


                </ul>

            </div>
            )}


            {activeModalMenu === 'delete' && (
                <DeleteConfirmModal
                    message="この動画を削除しますか?"
                    onCancel={() => setActiveModal(null)}   // 親PlaylistSidebarに伝える。これで、このコンポ自体が実行されなくなる。キャンセルだからいったん全部閉じさせる。最初からリセットさせる。
                    onConfirm={() => handleDeleteVideo(video.id)}

                />

            )}

            {activeModalMenu === 'playlists' && (
                <PlaylistsModal
                    video={video}
                    setActiveModal={setActiveModal}
                    playlistType={playlistType}
                />
            )}

        </>

    )
}

export default PlaylistVideoModalMenu;
