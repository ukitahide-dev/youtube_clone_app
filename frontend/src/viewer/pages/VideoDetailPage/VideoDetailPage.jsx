// ----react----
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useContext, useEffect, useState } from 'react'


// ----services----
import { fetchVideoDetail } from '../../../services/videos'


// ----context----
import { AuthContext } from '../../../context/AuthContext'


// -----components-----
import VideoActions from '../../components/VideoActions/VideoActions';
import CommentSection from '../../components/CommentSection/CommentSection';
import PlaylistSidebar from '../../components/RightSidebar/PlaylistSidebar/PlaylistSidebar';
import LikeVideosSidebar from '../../components/RightSidebar/LikeVideosSidebar/LikeVideosSidebar.jsx';
import VideoPlayerSection from '../../components/VideoPlayerSection/VideoPlayerSection'
import RelatedVideosSidebar from '../../components/RightSidebar/RelatedVideosSidebar/RelatedVideosSidebar'


// ----css----
import VideoDetailPageStyles from './VideoDetailPage.module.css';





// 親: ViewerRoutes.jsx、PlaylistCard.jsx、PlaylistPart.jsx、LikeVideosSidebar.jsx
// 役割: 動画詳細ページ全体を管理する親。





function VideoDetailPage() {

    const { id } = useParams();    // URLから id を取得。ここではvideo.idを取得してる。
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const playlistId = searchParams.get('playlist');

    const showLiked = searchParams.get('liked') === 'true';
    const type = searchParams.get('type');   // クエリパラメータから取得する。ex) type=viewer
    const uploaderId = searchParams.get('uploader');


    const { accessToken } = useContext(AuthContext);

    const [video, setVideo] = useState(null);
    const [playlistVideos, setPlaylistVideos] = useState([]);
    const [likedVideos, setLikedVideos] = useState([]);




    // --- 動画詳細の取得 ---
    useEffect(() => {
        async function loadVideo() {
            try {
                const data = await fetchVideoDetail(id);
                setVideo(data);
            } catch (err) {
                console.error('動画取得失敗', err)
            }
        }

        loadVideo();

    }, [id, accessToken, type]);



    if (!video) return <p>このプレイリストには動画が存在しません</p>





    return (
            <div className={VideoDetailPageStyles.container}>
                <div className={VideoDetailPageStyles.mainArea}>
                    <VideoPlayerSection
                        video={video}
                        token={accessToken}
                        playlistVideos={playlistVideos}
                        playlistId={playlistId}
                        likedVideos={likedVideos}
                        showLiked={showLiked}
                    />

                    <h2 className={VideoDetailPageStyles.videoTitle}>{video.title}</h2>

                    <VideoActions
                        video={video}
                        setVideo={setVideo}
                    />

                    <CommentSection videoId={id} />
                </div>

                <div className={VideoDetailPageStyles.sideArea}>
                    {playlistId ? (
                        <PlaylistSidebar
                            playlistId={playlistId}
                            type={type}
                            currentVideoId={video.id}
                            onVideosFetched={(videos) => setPlaylistVideos(videos)}
                            uploaderId={uploaderId}
                        />
                    ) : showLiked ? (
                        <LikeVideosSidebar
                            currentVideoId={video.id}
                            onVideosFetched={(videos) => setLikedVideos(videos)}
                        />
                    ) : (
                        <RelatedVideosSidebar
                            video={video}
                        />
                    )}
                </div>
            </div>
    )

}

export default VideoDetailPage




