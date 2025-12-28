import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";


// ----context----
import { AuthContext } from "../../../context/AuthContext";


// ----services----
import { fetchMyVideos, updateVideo, } from "../../../services/videos";


// ----components----
import VideoModalMenu from "./components/VideoModalMenu/VideoModalMenu.jsx";


// -----hooks----
import { useDeleteVideo } from "./hooks/useDeleteVideo";


//------utils-----
import { formatDate } from "../../../utils/FormatDate";
import { getThum } from "../../../utils/getThum.js";


// -----css-----
import VideosPageStyles from './VideosPage.module.css';


// -----fontAwsome-----
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartColumn } from '@fortawesome/free-solid-svg-icons';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';






// 親: ContentsPage.jsx
// 役割: 自分が投稿した動画を表示する。




function VideosPage() {
    const { accessToken } = useContext(AuthContext);
    const [videos, setVideos] = useState([]);
    const [activeMenu, setActiveMenu] = useState(null);

    const { handleDelete } = useDeleteVideo();  // 削除用hook



    useEffect(() => {
        if (!accessToken) return;

        // 自分が投稿した動画を取得する
        const fetchVideos = async () => {
            try {
                const data = await fetchMyVideos(accessToken);
                setVideos(data);
            } catch (err) {
                console.error("動画の取得に失敗しました:", err);
            }
        }

        fetchVideos();

    }, [accessToken]);




    const onDelete = async (videoId) => {
        const isDeleted = await handleDelete(videoId, accessToken);

        // 削除処理が完了したら動画一覧表示を更新する
        if (isDeleted) {
            setVideos(prev => prev.filter(video => video.id !== videoId));
        }
    }


    const onEdit = async (videoId, updatedData) => {
        try {
            const updated = await updateVideo(videoId, updatedData, accessToken);

            if (updated) {
                setVideos((prevVideos) => prevVideos.map(v => v.id === videoId ? updated : v));
            }
        } catch (err) {
            console.error("動画の更新に失敗:", err);
        }
    }



    return (

        <>
            <div className={`${VideosPageStyles.head} ${VideosPageStyles.col}`}>
                <p>動画</p>
                <p>日付</p>
                <p>視聴回数</p>
                <p>いいね数</p>
            </div>

            {videos.map(video => (
                <div key={video.id} className={`${VideosPageStyles.videoArea} ${VideosPageStyles.col}`}>
                    <div className={VideosPageStyles.left}>
                        <img src={getThum(video)} alt={video.title} />
                        <div>
                            <p className={VideosPageStyles.videoTitle}>
                                {video.title.length > 10 ? video.title.slice(0, 10) + '...' : video.title}
                            </p>
                            <p className={VideosPageStyles.videoDescription}>動画の説明</p>
                            <div className={VideosPageStyles.menus}>
                                <Link to={`/studio/analytics/${video.id}`}>
                                    <FontAwesomeIcon icon={faChartColumn} />
                                </Link>
                                <button
                                    onClick={() => setActiveMenu(activeMenu === video.id ? null : video.id)}>
                                    <FontAwesomeIcon icon={faEllipsisV} />
                                </button>
                            </div>
                        </div>
                    </div>
                    <p>{formatDate(video.uploaded_at)}</p>
                    <p>{video.views}</p>
                    <p>{video.like}</p>

                    {activeMenu === video.id && (
                        <VideoModalMenu
                            onEdit={onEdit}
                            video={video}  // 編集対象の動画を渡す
                            onDelete={() => onDelete(video.id)}
                            setActiveMenu={setActiveMenu}
                        />
                    )}
                </div>
            ))}
        </>
    )

}

export default VideosPage;
