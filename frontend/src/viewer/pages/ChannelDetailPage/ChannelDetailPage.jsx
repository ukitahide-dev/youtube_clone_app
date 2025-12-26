// ----react----
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

// ----services----
import { fetchChannelDetail } from '../../../services/uploaders'


// -----component-----
import Sidebar from '../../components/Sidebar/Sidebar.jsx'
import ChannelVideos from './components/ChannelVideos/ChannelVideos.jsx'
import HomeTab from './components/HomeTab/HomeTab'


// -----css-----
import ChannelDetailPageStyles from './ChannelDetailPage.module.css'
import ChannelPlaylists from './components/ChannelPlaylists/ChannelPlaylists'






// 親: ChannelCard.jsx、App.jsx、
// 役割: 個別のチャンネル(動画投稿者)のホームページを表示する。




function ChannelDetailPage() {
    const { id } = useParams();   // このidはチャンネル主=投稿者のUserモデルのIDのこと。
    const [channel, setChannel] = useState(null);
    const [activeTab, setActiveTab] = useState('home');


    // チャンネル詳細を取得する
    useEffect(() => {
        async function loadChannelDetail() {
            try {
                const data = await fetchChannelDetail(id);   // uploaders.jsx
                setChannel(data);
            } catch (err) {
                console.error('チャンネル詳細の取得に失敗:', err)
            }
        }
        loadChannelDetail();
    }, [id])


    if (!channel) return





    return (
        <div className={ChannelDetailPageStyles.container}>
            <Sidebar />
            <div className={ChannelDetailPageStyles.main}>
                <div className={ChannelDetailPageStyles.coverImage}>
                    <img src={channel.cover_image} alt="" />
                </div>
                <div className={ChannelDetailPageStyles.profile}>
                    <div>
                        <img src={channel.profile_icon} alt="" />
                    </div>
                    <div>
                        <h3 className={ChannelDetailPageStyles.channelName}>
                            {channel.username}
                        </h3>
                        <div className={ChannelDetailPageStyles.sub}>
                            <p>チャンネル登録者数{channel.subscriber_count}人</p>
                            <p>{channel.videos.length}本の動画</p>
                        </div>
                        <button>登録トグルボタン</button>
                    </div>
                </div>
                <div className={ChannelDetailPageStyles.tagMenu}>
                    <button onClick={() => setActiveTab('home')}>ホーム</button>
                    <button onClick={() => setActiveTab('videos')}>動画</button>
                    <button onClick={() => setActiveTab('playlists')}>再生リスト</button>
                </div>

                <div className={ChannelDetailPageStyles.content}>
                    {activeTab === 'home' && (
                        <HomeTab
                            videos={channel.videos}
                        />

                    )}

                    {activeTab === 'videos' &&
                        <ChannelVideos
                            videos={channel.videos}
                        />
                    }

                    {activeTab === 'playlists' && (
                        <ChannelPlaylists
                            playlists={channel.uploader_playlists}
                            uploaderId={id}
                        />

                    )}
                </div>
            </div>
        </div>
    )
}

export default ChannelDetailPage
