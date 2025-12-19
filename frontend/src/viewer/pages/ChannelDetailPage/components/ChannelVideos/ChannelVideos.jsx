// ----react----
import { useState } from 'react'
import { Link } from 'react-router-dom'


// -----utils 汎用関数-----
import { TimeSince } from '../../../../../utils/TimeSince'
import { formatViews } from '../../../../../utils/FormatViews'


// ----components----
import VideoModalMenu from '../../../../components/VideoModalMenu/VideoModalMenu'


// ----css----
import ChannelVideosStyles from './ChannelVideos.module.css'


//  -----fontAwsome-----
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons'





// 親: ChannelDetailPage.jsx
// 役割: 各チャンネルが過去に投稿した動画をカード型ですべて表示する





function ChannelVideos({ videos }) {
    const [sortedVideos, setSortedVideos] = useState(videos)
    const [activeSort, setActiveSort] = useState('newest')
    const [activeModal, setActiveModal] = useState(null);

    if (!videos || videos.length === 0) {
        return <p className={ChannelVideosStyles.empty}>動画がありません。</p>
    }

    const handleSort = (sortType) => {
        let sorted = [...videos]

        if (sortType === 'newest') {
            sorted.sort((a, b) => new Date(b.uploaded_at) - new Date(a.uploaded_at))
        } else if (sortType === 'oldest') {
            sorted.sort((a, b) => new Date(a.uploaded_at) - new Date(b.uploaded_at))
        } else if (sortType === 'popular') {
            sorted.sort((a, b) => b.views - a.views)
        }

        setSortedVideos(sorted)
        setActiveSort(sortType)
    }



    return (
        <>
            <div className={ChannelVideosStyles.tabMenu}>
                <button
                    onClick={() => handleSort('newest')}
                    className={activeSort === 'newest' ? ChannelVideosStyles.active : ''}
                >
                    新しい順
                </button>
                <button
                    onClick={() => handleSort('popular')}
                    className={activeSort === 'popular' ? ChannelVideosStyles.active : ''}
                >
                    人気の動画
                </button>
                <button
                    onClick={() => handleSort('oldest')}
                    className={activeSort === 'oldest' ? ChannelVideosStyles.active : ''}
                >
                    古い順
                </button>
            </div>

            <div className={ChannelVideosStyles.videoCards}>
                {sortedVideos.map((video) => (
                    <div className={ChannelVideosStyles.videoCard}>
                        <Link to={`/videos/${video.id}`} key={video.id} className={ChannelVideosStyles.videoItem}>
                            <div className={ChannelVideosStyles.thum}>
                                <img src={video.thum} alt={video.title} />
                            </div>
                            <div className={ChannelVideosStyles.bottom}>
                                <p className={ChannelVideosStyles.videoTitle}>
                                    {video.title}
                                </p>
                                <div className={ChannelVideosStyles.sub}>
                                    <p>{formatViews(video.views)}</p>
                                    <p>{TimeSince(video.uploaded_at)}</p>
                                </div>
                            </div>

                        </Link>
                        <button
                            className={ChannelVideosStyles.menuButton}
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
        </>
    )
}


export default ChannelVideos
