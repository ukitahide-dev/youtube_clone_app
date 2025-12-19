// ----react----
import { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'


// ----services----
import { fetchViewerPlaylists } from '../../../../../services/playlists'


// ----context----
import { AuthContext } from '../../../../../context/AuthContext'


// ----components----
import ContentSection from '../ContentSection/ContentSection'
import PlaylistModalActions from '../../../../components/PlaylistModalActions/PlaylistModalActions'


// ----css----
import playlistCardStyles from '../../../../components/PlaylistCard/PlaylistCard.module.css'
import styles from '../../../../components/VideoList/VideoList.module.css'
import PlaylistPartStyles from './PlaylistPart.module.css'


//  -----fontAwsome-----
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons'





// 親: MyPage.jsx
// 役割: マイページに視聴用プレイリストを表示する






function PlaylistPart() {
    const { user, accessToken } = useContext(AuthContext)
    const [playlists, setPlaylists] = useState([])
    const [activePlaylistId, setActivePlaylistId] = useState(null)   // どのプレイリストのモーダルを開いているかを特定する状態を持つ。
    const navigate = useNavigate()



    useEffect(() => {
        async function loadPlaylists() {
            try {
                const res = await fetchViewerPlaylists(accessToken)
                setPlaylists(res.slice(0, 12))
            } catch (err) {
                console.error('プレイリスト取得失敗', err)
            }
        }

        loadPlaylists()
    }, [user, accessToken])




    return (
        <ContentSection
            title="プレイリスト"
            items={playlists}
            onViewAll={() => navigate('/playlistsPage')}
            renderItem={(pl) => (
                <>
                {/* viewer/VideoDetailPageに飛ぶ */}
                <Link
                    to={`/videos/${pl.video_details[0]?.id}?playlist=${pl.id}&type=viewer`}
                    className={playlistCardStyles.cardItem}
                >
                    <div
                        className={`${playlistCardStyles.thumArea}`}
                        key={pl.id}
                    >
                        <img
                            src={`${pl.video_details[0]?.thum}`}
                            alt={pl.video_details.title}
                        />
                        <div className={playlistCardStyles.videoNums}>
                            <span>{pl.video_details.length}本の動画</span>
                        </div>
                    </div>
                </Link>
                <div className={PlaylistPartStyles.sub}>
                    <h4 className={styles.title}>{pl.name}</h4>
                    <button
                        onClick={() =>
                            setActivePlaylistId(activePlaylistId === pl.id ? null : pl.id)
                        }
                    >
                        <FontAwesomeIcon icon={faEllipsisV} />
                    </button>
                </div>

                {activePlaylistId === pl.id && (
                    <PlaylistModalActions
                        playlist={pl}
                        onCancel={() => setActivePlaylistId(null)}
                        setPlaylists={setPlaylists}
                    />
                )}
                </>
            )}
        />
    )
}

export default PlaylistPart
