// ----react----
import { useContext, useState } from 'react'


// ----services----
import { toggleLikeVideo } from '../../../services/videos'


// ----context----
import { AuthContext } from '../../../context/AuthContext'


// ----components----
import PlaylistsModal from '../PlaylistsModal/PlaylistsModal'


// -----css-----
import LikeVideoModalMenuStyles from './LikeVideoModalMenu.module.css'


// ------fontAwsome-----
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons'
import { faBookmark as faBookmarkRegular } from '@fortawesome/free-regular-svg-icons'





// 親: LikeVideoPart.jsx、LikeVideosSidebar.jsx、LikeVideoList.jsx、
// 役割: いいねした動画一覧のメニュー。プレイリストに保存。いいねを解除。





function LikeVideoModalMenu({ video, setActiveModal, setLikedVideos }) {
    const { accessToken } = useContext(AuthContext);

    const [isOpen, setIsOpen] = useState(true)
    const [playlistType, setPlaylistType] = useState('');



    // いいねを解除する処理
    const handleUnlike = async () => {
        try {
            await toggleLikeVideo(accessToken, video.id);
            setLikedVideos(prev => prev.filter(v => v.id !== video.id));  // 親LikeVideoPart.jsx、LikeVideosSidebar.jsx、LikeVideosPage.jsxに変更を伝える。
        } catch (err) {
            console.error('いいね解除失敗', err)
        }
    }





    return (
        <>
            {isOpen && (
                <div className={LikeVideoModalMenuStyles.menu}>
                        <ul>
                            <li onClick={() => {
                                setIsOpen(false);
                                setPlaylistType('viewer');
                            }}>
                                <span>
                                    <FontAwesomeIcon icon={faBookmarkRegular} />
                                </span>
                                <p>視聴用プレイリストに保存</p>
                            </li>
                            <li onClick={handleUnlike}>
                                <span>
                                    <FontAwesomeIcon icon={faTrashAlt} />
                                </span>
                                <p>いいねした動画から削除</p>
                            </li>
                        </ul>
                </div>
            )}

            {playlistType === 'viewer' && (
                <PlaylistsModal
                    video={video}
                    setActiveModal={setActiveModal}
                    playlistType={playlistType}
                />
            )}

        </>
    )
}

export default LikeVideoModalMenu
