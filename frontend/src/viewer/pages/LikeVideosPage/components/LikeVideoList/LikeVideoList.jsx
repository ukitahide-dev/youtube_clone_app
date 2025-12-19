// ----react----
import { Link } from 'react-router-dom';
import { useState } from 'react';


// ----utils----
import { TimeSince } from '../../../../../utils/TimeSince'


// ----components----
import LikeVideoModalMenu from '../../../../components/LikeVideoModalMenu/LikeVideoModalMenu';


// ----css----
import VideoListStyles from '../../../../components/VideoList/VideoList.module.css';  // 見た目が全く同じだからVideoListのレイアウトをそのまま使う。でも多分このやり方いまいち。



// -----fontAwsome-----
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons'





// 親: LikeVideosPage.jsx
// 役割: いいねした動画一覧を表示する





function LikeVideoList({ videos, setLikedVideos, }) {
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
                        <Link to={`/videos/${video.id}?liked=true`} className={VideoListStyles.videoItem}>
                            <div className={VideoListStyles.thumArea}>
                                <img
                                    className={VideoListStyles.thum}
                                    src={video.thum}
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
                            <LikeVideoModalMenu
                                video={video}
                                setActiveModal={setActiveModal}
                                setLikedVideos={setLikedVideos}

                            />
                        )}

                    </div>
                ))}
            </div>
        </div>
    )






}


export default LikeVideoList;
