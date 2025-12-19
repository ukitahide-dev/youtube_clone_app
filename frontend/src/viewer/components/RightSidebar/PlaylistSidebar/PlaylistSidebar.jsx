// ----react----
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';


// ----services----
import { fetchUploaderDetailPlaylist, fetchViewerDetailPlaylist } from '../../../../services/playlists';


// ----context----
import { AuthContext } from '../../../../context/AuthContext';


// ----components----
import PlaylistVideoModalMenu from '../../PlaylistVideoModalMenu/PlaylistVideoModalMenu';


// ----css----
import PlaylistSidebarStyles from './PlaylistSidebar.module.css';


// ----fontAwsome----
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShuffle } from '@fortawesome/free-solid-svg-icons';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';




// 親: VideoDetailPage.jsx
// 役割: サイドバーにプレイリスト詳細内の動画をすべて表示。





function PlaylistSidebar({
    playlistId,
    type,
    currentVideoId,
    uploaderId,
    // onVideosFetched,
}) {
    const { accessToken } = useContext(AuthContext);

    const [playlist, setPlaylist] = useState(null);
    const [activeModal, setActiveModal] = useState(null);
    const [isOpen, setIsOpen] = useState(true);

    const navigate = useNavigate();



    // typeにより場合分け。プレイリスト詳細とその動画たちを取得する。
    useEffect(() => {
        async function loadPlaylistDetail() {
            let data;
            try {
                if (type === 'viewer') {
                    data = await fetchViewerDetailPlaylist(accessToken, playlistId);
                } else {
                    data = await fetchUploaderDetailPlaylist(accessToken, playlistId);
                }
                setPlaylist(data);
            } catch (err) {
                console.error('プレイリスト詳細取得に失敗', err);
            }

        }

        loadPlaylistDetail();

    }, [accessToken, playlistId, uploaderId]);




    if (!playlist) {
        return "読み込み中"
    }



    return (
        <div className={PlaylistSidebarStyles.container}>
            {playlist && (
                <div className={PlaylistSidebarStyles.videosList}>
                    <div className={PlaylistSidebarStyles.top}>
                        <h3 className={PlaylistSidebarStyles.title}>{playlist.name}</h3>
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className={PlaylistSidebarStyles.toggleButton}
                        >
                            <FontAwesomeIcon icon={isOpen ? faChevronUp : faChevronDown} />
                        </button>
                    </div>
                    <div className={PlaylistSidebarStyles.subTitle}>
                        <span>{playlist.name}</span>
                        <span className={PlaylistSidebarStyles.videoNums}>{`${playlist.video_details.findIndex(v => v.id === currentVideoId) + 1} / ${playlist.video_details.length}`}</span>
                    </div>

                    {isOpen && (
                        <>
                            <button
                                // onClick={handleShuffle}
                                className={PlaylistSidebarStyles.shuffleButton}
                                title="シャッフル再生"
                            >
                                <FontAwesomeIcon icon={faShuffle} />
                            </button>
                            <div className={PlaylistSidebarStyles.videoList}>
                                {playlist.video_details?.map((video, index) => (
                                <div
                                    key={video.id}
                                    className={`${PlaylistSidebarStyles.videoItem} ${
                                        video.id === currentVideoId ? PlaylistSidebarStyles.active : ''
                                    }`}
                                    onClick={() =>
                                        navigate(`/videos/${video.id}?playlist=${playlistId}&type=${type}`)
                                    }
                                >
                                    <div className={PlaylistSidebarStyles.left}>
                                        <span>{index + 1}</span>
                                        <img
                                            src={video.thum}
                                            alt={video.title}
                                            className={PlaylistSidebarStyles.thumbnail}
                                        />
                                        <div>
                                            <p className={PlaylistSidebarStyles.videoTitle}>{video.title}</p>
                                            <p className={PlaylistSidebarStyles.uploaderName}>{video.uploader_name}</p>
                                        </div>
                                    </div>
                                    <div className={PlaylistSidebarStyles.right}>
                                        <button
                                            className={PlaylistSidebarStyles.menuButton}
                                            onClick={(e) => {
                                                setActiveModal(activeModal !== video.id ? video.id : null);
                                                e.stopPropagation();
                                            }}
                                        >
                                            <FontAwesomeIcon icon={faEllipsisV} size="lg" />
                                        </button>
                                    </div>

                                    {activeModal === video.id && (
                                        <PlaylistVideoModalMenu
                                            playlist={playlist}
                                            setPlaylist={setPlaylist}
                                            video={video}
                                            type={type}
                                            setActiveModal={setActiveModal}
                                        />
                                    )}

                                </div>

                                ))}
                            </div>
                        </>


                    )}


                </div>

            )}

        </div>
    )
}

export default PlaylistSidebar
