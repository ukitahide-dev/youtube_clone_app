// ----react----
import { useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';


// ----services----
import { fetchLikedVideos } from '../../../../services/Likes';


// ----context----
import { AuthContext } from '../../../../context/AuthContext';


// ----components----
import LikeVideoModalMenu from '../../LikeVideoModalMenu/LikeVideoModalMenu';


// ----css----
import LikeVideosSidebarStyles from './LikeVideosSidebar.module.css';


// ----fontAwsome----
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShuffle } from '@fortawesome/free-solid-svg-icons';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';




// 親: VideoDetailPage.jsx
// 役割:  いいねした動画をサイドバーに表示する。UIはPlaylistSidebar.jsxとほぼ同じ。



function LikeVideosSidebar({ onVideosFetched, currentVideoId }) {
    const { accessToken } = useContext(AuthContext);
    const [likedVideos, setLikedVideos] = useState(null);
    const [activeModal, setActiveModal] = useState(null);
    const [isOpen, setIsOpen] = useState(true);

    const navigate = useNavigate();




    useEffect(() => {
        async function loadLikedVideos() {
            try {
                const data = await fetchLikedVideos(accessToken);
                setLikedVideos(data);
            } catch (err) {
                console.error('いいねした動画取得に失敗', err);
            }
        }

        loadLikedVideos();

    }, [accessToken])



    if (!likedVideos) return '読み込み中';





    return (
        <div className={LikeVideosSidebarStyles.container}>
                <div className={LikeVideosSidebarStyles.videosList}>
                    <div className={LikeVideosSidebarStyles.top}>
                        <h3 className={LikeVideosSidebarStyles.title}>高く評価した動画</h3>
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className={LikeVideosSidebarStyles.toggleButton}
                        >
                            <FontAwesomeIcon icon={isOpen ? faChevronUp : faChevronDown} />
                        </button>
                    </div>
                    <div className={LikeVideosSidebarStyles.subTitle}>
                        <span>高く評価した動画</span>
                        <span className={LikeVideosSidebarStyles.videoNums}>{`${likedVideos.findIndex(v => v.id === currentVideoId) + 1} / ${likedVideos.length}`}</span>
                    </div>

                    {isOpen && (
                        <>
                            <button
                                // onClick={handleShuffle}
                                className={LikeVideosSidebarStyles.shuffleButton}
                                title="シャッフル再生"
                            >
                                <FontAwesomeIcon icon={faShuffle} />
                            </button>
                            <div className={LikeVideosSidebarStyles.videoList}>
                                {likedVideos.map((video, index) => (
                                <div
                                    key={video.id}
                                    className={`${LikeVideosSidebarStyles.videoItem} ${
                                        video.id === currentVideoId ? LikeVideosSidebarStyles.active : ''
                                    }`}
                                    onClick={() =>
                                        // これでVideoDetailPageのuseEffectが実行されて、動画詳細の状態が更新され、コンポの再レンダリングが起きる。
                                        navigate(`/videos/${video.id}?liked=true`)
                                    }
                                >
                                    <div className={LikeVideosSidebarStyles.left}>
                                        <span>{index + 1}</span>
                                        <img
                                            src={video.thum}
                                            alt={video.title}
                                            className={LikeVideosSidebarStyles.thumbnail}
                                        />
                                        <div>
                                            <p className={LikeVideosSidebarStyles.videoTitle}>{video.title}</p>
                                            <p className={LikeVideosSidebarStyles.uploaderName}>{video.uploader_name}</p>
                                        </div>
                                    </div>
                                    <div className={LikeVideosSidebarStyles.right}>
                                        <button
                                            className={LikeVideosSidebarStyles.menuButton}
                                            onClick={(e) => {
                                                setActiveModal(activeModal !== video.id ? video.id : null);
                                                e.stopPropagation();
                                            }}
                                        >
                                            <FontAwesomeIcon icon={faEllipsisV} />
                                        </button>
                                    </div>


                                    {activeModal === video.id && (
                                        <LikeVideoModalMenu
                                            video={video}
                                            setActiveModal={setActiveModal}
                                            setLikedVideos={setLikedVideos}
                                        />

                                    )}

                                </div>

                                ))}
                            </div>
                        </>
                    )}

                </div>
        </div>
    )
}

export default LikeVideosSidebar
