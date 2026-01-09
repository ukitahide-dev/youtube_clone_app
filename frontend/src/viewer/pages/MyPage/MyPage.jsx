// ----react----
import { useContext, useState } from 'react'
import { AuthContext } from '../../../context/AuthContext'


// ----services----
import { BASE_URL } from '../../../services/api'
import { uploadProfileIcon } from '../../../services/profile'


// ----utils----
import { getProfileIconSrc } from '../../../utils/profileIcon'


// ----config----
import { useUpload } from '../../../config'


// ----components----
import Sidebar from '../../components/Sidebar/Sidebar'
import PlaylistPart from './components/PlaylistPart/PlaylistPart'
import LikeVideoPart from './components/LikeVideoPart/LikeVideoPart'
import UploadProfileIconModal from './components/UploadProfileIconModal/UploadProfileIconModal'


// -----css-----
import MypageStyles from './MyPage.module.css'









// 親: ViwerRoutes.jsx
// 役割: マイページを表示



function MyPage() {
    const { user, accessToken, setUser } = useContext(AuthContext);

    const [activeModal, setActiveModal] = useState(null);



    if (!user) return <p>読み込み中...</p>



    const handleIconClick = () => {
        if (useUpload) {
            // 開発環境：ファイル選択
            document.getElementById('profile-upload').click();
        } else {
            // 本番環境：URL入力モーダルを開く
            setActiveModal('uploadProfileIcon');
        }
    };




    const handleProfileIconChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const data = await uploadProfileIcon(accessToken, file);
            setUser(data);

        } catch (err) {
            console.error('プロフィールアイコン更新に失敗', err);
        }
    };






    return (
        <div className={MypageStyles.container}>
            <Sidebar />
            <div className={MypageStyles.mainArea}>
                <div className={MypageStyles.profileArea}>
                    <img
                        src={getProfileIconSrc(user)}
                        alt="プロフィールアイコン"
                        onClick={handleIconClick}
                    />

                    {useUpload && (
                        <input
                            id="profile-upload"
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={handleProfileIconChange}
                        />
                    )}



                    <p className={MypageStyles.username}>{user.username}</p>
                </div>

                {/* 本番環境: url入力モーダルを開く */}
                {!useUpload && activeModal === 'uploadProfileIcon' && (
                    <UploadProfileIconModal
                        onCancel={() => setActiveModal(null)}

                    />
                )}

                <PlaylistPart />
                <LikeVideoPart />

            </div>
        </div>
    )
}

export default MyPage
