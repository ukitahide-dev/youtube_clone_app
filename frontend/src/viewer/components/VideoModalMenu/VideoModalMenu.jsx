// ----react----
import { useContext, useState } from 'react';


// ----context----
import { AuthContext } from '../../../context/AuthContext';


// ----components----
import PlaylistsModal from '../PlaylistsModal/PlaylistsModal';


// ----css----
import VideoModalMenuStyles from './VideoModalMenu.module.css';


// -----fontAwsome-----
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBookmark } from "@fortawesome/free-regular-svg-icons";





// 親: VideoList.jsx、SearchResultsPage.jsx、
// 役割: 動画のモーダルメニューを表示。他のモーダルと分けたのは、
// このモーダル独自の機能を追加する可能性があるため。ex)動画非表示など。



function VideoModalMenu({ video, setActiveModal, }) {
    const { user } = useContext(AuthContext);

    const [activeModalMenu, setActiveModalMenu] = useState(null);
    const [isOpen, setIsOpen] = useState(true);
    const [playlistType, setPlaylistType] = useState('');




    return (
        <>
            {isOpen && (
                <div className={VideoModalMenuStyles.modal}>
                    <ul className={VideoModalMenuStyles.menus}>
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
                        </ul>
                </div>
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


export default VideoModalMenu;
