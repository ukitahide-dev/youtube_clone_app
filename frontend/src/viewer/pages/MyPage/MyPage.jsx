// ----react----
import { useContext } from 'react'
import { AuthContext } from '../../../context/AuthContext'

// ----services----
import { BASE_URL } from '../../../services/api'

// ----components----
import Sidebar from '../../components/Sidebar/Sidebar'
import PlaylistPart from './components/PlaylistPart/PlaylistPart'
import LikeVideoPart from './components/LikeVideoPart/LikeVideoPart'

// -----css-----
import MypageStyles from './MyPage.module.css'




// 親: ViwerRoutes.jsx
// 役割: マイページを表示



function MyPage() {
    const { user } = useContext(AuthContext)

    if (!user) return <p>読み込み中...</p>


    return (
        <div className={MypageStyles.container}>
            <Sidebar />
            <div className={MypageStyles.mainArea}>
                <div className={MypageStyles.profileArea}>
                    <img
                        src={`${BASE_URL}/${user?.profile_icon}`}
                        alt="プロフィールアイコン"
                    />
                    <p className={MypageStyles.username}>{user.username}</p>
                </div>

                <PlaylistPart />
                <LikeVideoPart />
                {/* <WatchHistoryPart /> */}
            </div>
        </div>
    )
}

export default MyPage
