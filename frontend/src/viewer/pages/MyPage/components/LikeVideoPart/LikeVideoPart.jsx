// ----react----
import { useContext, useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'


// ----services----
import { fetchLikedVideos } from '../../../../../services/Likes'


// ----context----
import { AuthContext } from '../../../../../context/AuthContext'


// ----components----
import ContentSection from '../ContentSection/ContentSection'
import LikeVideoModalMenu from '../../../../components/LikeVideoModalMenu/LikeVideoModalMenu'


// ----css----
import LikeVideoPartStyles from './LikeVideoPart.module.css'


//  -----fontAwsome-----
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons'




// 親: MyPage.jsx




function LikeVideoPart() {
    const { user, accessToken } = useContext(AuthContext)
    const [likedVideos, setLikedVideos] = useState([])
    const navigate = useNavigate()

    const [activeModal, setActiveModal] = useState(null)
    const menuRef = useRef(null)



    // いいねした動画一覧を取得
    useEffect(() => {
        async function loadLikedVideos() {
            try {
                const data = await fetchLikedVideos(accessToken)
                setLikedVideos(data.slice(0, 12))
            } catch (err) {
                console.error('いいねした動画取得失敗', err)
            }
        }

        loadLikedVideos()
    }, [user, accessToken])



    //  モーダル外クリックで閉じる処理
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setActiveModal(null)
            }
        }

        // メニューが開いている時だけイベント登録
        if (activeModal) {
            document.addEventListener('mousedown', handleClickOutside)
        }


        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [activeModal])




    return (
        <ContentSection
            title="高く評価した動画"
            items={likedVideos}
            onViewAll={() => navigate('/LikeVideosPage')}
            renderItem={(video) => (
                <>
                {/* viewer/VideoDetailPage.jsxに飛ぶ。 */}
                <Link to={`/videos/${video.id}?liked=true`}>
                    <div
                        className={`${LikeVideoPartStyles.thumArea}`}
                        key={video.id}
                    >
                        <img src={`${video.thum}`} alt={video.title} />
                    </div>
                </Link>
                <div className={LikeVideoPartStyles.sub}>
                    <h4 className={LikeVideoPartStyles.title}>{video.title}</h4>
                    <button
                        onClick={() =>
                            setActiveModal(activeModal === video.id ? null : video.id)
                        }
                    >
                        <FontAwesomeIcon icon={faEllipsisV} />
                    </button>
                </div>

                {activeModal === video.id && (
                    <div ref={menuRef}>
                        <LikeVideoModalMenu
                            video={video}
                            setActiveModal={setActiveModal}
                            setLikedVideos={setLikedVideos}
                        />
                    </div>
                )}
                </>
            )}
        />
    )
}

export default LikeVideoPart
