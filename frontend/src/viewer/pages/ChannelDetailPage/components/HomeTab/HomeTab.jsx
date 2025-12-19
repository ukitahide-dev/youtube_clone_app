// ----react----
import { useState } from 'react';
import { Link } from 'react-router-dom';

// ----utils----
import { TimeSince } from '../../../../../utils/TimeSince';


// ----components----
import VideoModalMenu from '../../../../components/VideoModalMenu/VideoModalMenu';
// import ChannelVideosSlider from '../ChannelVideosSlider';


// ----css----
import HomeTabStyles from './HomeTab.module.css';



// -----fontAwsome-----
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons'





// 親: ChannelDetailPage.jsx、
// 役割: チャンネル詳細ページのホームを表示。



function HomeTab({ videos, }) {
    const [activeModal, setActiveModal] = useState(null);


    return (
        <>
            <div className={HomeTabStyles.introVideoArea}>
                {/* VideoDetailPage.jsxに飛ぶ */}
                <Link to={`/videos/${videos[0].id}`} className={HomeTabStyles.videoItem}>
                    <div className={HomeTabStyles.left}>
                        <div className={HomeTabStyles.thum}>
                            <img src={videos[0].thum} />
                        </div>
                    </div>
                    <div className={HomeTabStyles.right}>
                        <h4>{videos[0].title}</h4>
                        <span>{videos[0].views}回視聴・</span>
                        <span>{TimeSince(videos[0].uploaded_at)}</span>
                    </div>
                </Link>
                <button
                    className={HomeTabStyles.menuButton}
                    onClick={() => setActiveModal(activeModal !== videos[0].id ? videos[0].id : null)}
                >
                    <FontAwesomeIcon icon={faEllipsisV} />
                </button>

                {activeModal === videos[0].id && (
                    <VideoModalMenu
                        video={videos[0]}
                        setActiveModal={setActiveModal}
                    />
                )}

            </div>

            <div className={HomeTabStyles.videosArea}>
                {/* <ChannelVideosSlider videos={videos} /> */}
            </div>


        </>
    )





}


export default HomeTab;
