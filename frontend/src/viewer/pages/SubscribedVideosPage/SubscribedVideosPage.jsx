// ----react----
import { useEffect, useState, useContext } from 'react'


// ----services----
import { fetchSubscribedVideos } from '../../../services/videos'


// ----context----
import { AuthContext } from '../../../context/AuthContext'


// ----components----
import SideBar from '../../components/SideBar/SideBar.jsx';
import VideoList from '../../components/VideoList/VideoList.jsx';


// ----css----
import SubscribedVideosPageStyles from './SubscribedVideosPage.module.css';







// 親: App.jsx
// 役割: ユーザーごとの登録チャンネル動画を取得し表示する。






function SubscribedVideosPage () {
    const { accessToken } = useContext(AuthContext);
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);



    // 登録したチャンネルの動画を取得する
    useEffect(() => {
        async function loadVideos() {
            if (!accessToken) {
                return;
            }

            try {
                const data = await fetchSubscribedVideos(accessToken);  // services/videos.jsxのfetchSubscribedVideos関数
                setVideos(data);
            } catch (err) {
                console.error('動画取得失敗', err);
            } finally {
                setLoading(false);
            }
        }

        loadVideos();
    }, [accessToken]);



    return (
        <div className={SubscribedVideosPageStyles.videoContainer}>
            <SideBar />
            <VideoList
                videos={videos}
            />
        </div>
    )
}

export default SubscribedVideosPage;
