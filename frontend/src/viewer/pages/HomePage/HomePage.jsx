// ----react----
import { useEffect, useState, useContext } from 'react'

// ----context----
import { AuthContext } from '../../../context/AuthContext'

// ----services----
import { fetchVideos } from '../../../services/videos'

// -----component----
import VideoList from '../../components/VideoList/VideoList.jsx';
import Sidebar from '../../components/Sidebar/Sidebar.jsx';

// -----css------
import HomePageStyles from './HomePage.module.css';






function HomePage() {
    const [videos, setVideos] = useState([])
    const [loading, setLoading] = useState(true)



    useEffect(() => {
        async function loadVideos() {
            try {
                const data = await fetchVideos();   // services/videos.jsのfetchVideos関数。
                setVideos(data);

            } catch (err) {
                console.error('動画の取得に失敗', err)
            } finally {
                setLoading(false);
            }
        }

        loadVideos();
    }, [])



    if (loading) return <p>読み込み中...</p>



    return (
        <div className={HomePageStyles.videoContainer}>

            <Sidebar />
            <VideoList
                videos={videos}
            />


        </div>
    )
}


export default HomePage




