// ----react----
import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// ----services----
import { fetchRelatedVideos } from '../../../../services/videos';


// ----utils----
import { TimeSince } from '../../../../utils/TimeSince';


// ----context----
import { AuthContext } from '../../../../context/AuthContext';


// ----components----
import VideoModalMenu from '../../VideoModalMenu/VideoModalMenu';


// ----css----
import RelatedVideosSidebarStyles from './RelatedVideosSidebar.module.css';


// -----fontAwsome-----
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons'



import { getThum } from '../../../../utils/getThum';



// 親: VideoDetailPage.jsx
// 役割: サイドバーに再生中の動画に関連する動画を表示する。


function RelatedVideosSidebar({ video, }) {
    const { accessToken } = useContext(AuthContext);

    const [videos, setVideos] = useState([]);
    const [activeModal, setActiveModal] = useState(null);


    useEffect(() => {
        async function loadRelated() {
            try {
                const data = await fetchRelatedVideos(accessToken, video.id);
                setVideos(data);

            } catch (err) {
                console.error('関連動画取得失敗', err);
            }

        }

        loadRelated();

    }, [video, ])


    if (!video || !videos) return '読み込み中';





    return (
        <div className={RelatedVideosSidebarStyles.cardList}>
            {videos.map(v => (
                <div key={v.id} className={RelatedVideosSidebarStyles.card}>
                    {/* viewer/VideoDetailPage.jsxに飛ぶ */}
                    <Link to={`/videos/${v.id}`} className={RelatedVideosSidebarStyles.videoItem}>
                        <div className={RelatedVideosSidebarStyles.left}>
                            <img src={getThum(v)} alt={v.title} />
                        </div>

                        <div className={RelatedVideosSidebarStyles.right}>
                            <div className={RelatedVideosSidebarStyles.top}>
                                <p className={RelatedVideosSidebarStyles.videoTitle}>{v.title}</p>
                                <span>{v.views}回視聴</span>
                                <span>{TimeSince(v.uploaded_at)}</span>
                            </div>
                            <div className={RelatedVideosSidebarStyles.user}>
                                {/* <img src={video.uploader_icon} alt={video.uploader_name} /> */}
                                <span className={RelatedVideosSidebarStyles.userName}>{v.uploader_name}</span>
                            </div>
                        </div>
                    </Link>
                    <button
                        className={RelatedVideosSidebarStyles.menuButton}
                        onClick={() => setActiveModal(activeModal !== v.id ? v.id : null)}
                    >
                        <FontAwesomeIcon icon={faEllipsisV} />
                    </button>

                    {activeModal === v.id && (
                        <VideoModalMenu
                            video={v}
                            setActiveModal={setActiveModal}
                        />
                    )}

                </div>


            ))}


        </div>
    )
}

export default RelatedVideosSidebar;
