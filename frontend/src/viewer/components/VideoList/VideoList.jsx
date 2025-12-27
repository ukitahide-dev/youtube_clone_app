// ----react----
import { Link } from 'react-router-dom'
import { useContext, useState } from 'react'


// ----components----
import VideoModalMenu from '../VideoModalMenu/VideoModalMenu'

// ----config----
import { useUpload } from '../../../config'


// -----css-----
import VideoListStyles from './VideoList.module.css'


// -----fontAwsome-----
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons'
import { TimeSince } from '../../../utils/TimeSince'




// 親: HomePage.jsx、SubscribedVideosPage.jsx
// 役割: 動画をカード型で一覧表示する





function VideoList({ videos }) {
    const [activeModal, setActiveModal] = useState(null);



    return (
        <div className={VideoListStyles.mainArea}>
            <div className={VideoListStyles.tags}>
                出来たら上にタグボタンみたいなやつ
            </div>

            <div className={VideoListStyles.videoCards}>
                {videos.map((video) => (
                    <div key={video.id} className={VideoListStyles.videoCard}>
                        {/* viewer/VideoDetailPage.jsxに飛ぶ */}
                        <Link to={`/videos/${video.id}`} className={VideoListStyles.videoItem}>
                            <div className={VideoListStyles.thumArea}>
                                <img
                                    className={VideoListStyles.thum}
                                    src={useUpload ? video.thum : video.thumbnail_url}
                                    alt={video.title}
                                />
                            </div>
                            <div className={VideoListStyles.sub}>
                                <div className={VideoListStyles.left}>
                                    <div className={VideoListStyles.profile}>
                                        <img
                                            className={VideoListStyles.profileIcon}
                                            src={video.uploader_icon}
                                        />
                                    </div>
                                </div>
                                <div className={VideoListStyles.right}>
                                    <h4 className={VideoListStyles.title}>{video.title}</h4>
                                    <p>{video.uploader_name}</p>
                                    <p>
                                        <span>{video.views}回視聴・</span>
                                        <span>{TimeSince(video.uploaded_at)}</span>
                                    </p>
                                </div>
                            </div>
                        </Link>
                        <button
                            className={VideoListStyles.menuButton}
                            onClick={() => setActiveModal(activeModal !== video.id ? video.id : null)}
                        >
                            <FontAwesomeIcon icon={faEllipsisV} />
                        </button>

                        {activeModal === video.id && (
                            <VideoModalMenu
                                video={video}
                                setActiveModal={setActiveModal}

                            />
                        )}

                    </div>
                ))}
            </div>
        </div>
    )
}

export default VideoList



