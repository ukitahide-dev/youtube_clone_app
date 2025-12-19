// ----react----
import { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';


// ----context----
import { AuthContext } from '../../../context/AuthContext';


// ----services----
import { fetchUploaderDetailPlaylist, fetchViewerDetailPlaylist } from '../../../services/playlists';


// ----utils----
import { TimeSince } from '../../../utils/TimeSince';


// ----components----
import SideBar from '../../components/SideBar/SideBar';
import PlaylistVideoModalMenu from '../../components/PlaylistVideoModalMenu/PlaylistVideoModalMenu';


// ----css----
import PlaylistDetailPageStyles from './PlaylistDetailPage.module.css';


//  -----fontAwsome-----
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';






// 親: studio/PlaylistsPage/PlaylistModalMenu.jsx
// 役割: 個別のプレイリスト内の動画をすべて表示。各動画を削除等できるようにする。







function PlaylistDetailPage() {
    const { accessToken } = useContext(AuthContext);
    const {type, playlistId} = useParams();  // urlからtypeとplaylistIdを取得。

    const [playlist, setPlaylist] = useState([]);
    const [activeModal, setActiveModal] = useState(null);




    // typeによる場合分けで、プレイリスト詳細を取得する。
    useEffect(() => {
        const fetchData = async () => {
            let data;
            try {
                if (type === 'viewer') {
                    data = await fetchViewerDetailPlaylist(accessToken, playlistId);
                } else {
                    data = await fetchUploaderDetailPlaylist(accessToken, playlistId);
                }
                setPlaylist(data);
            } catch (err) {
                console.error('プレイリスト取得失敗', err);
            }

        }

        fetchData();

    }, [type, playlistId]);




    if (!playlist) return '読み込み中';



    return (
        <div className={PlaylistDetailPageStyles.container}>
            <SideBar />
            <div className={PlaylistDetailPageStyles.main}>
                <h2 className={PlaylistDetailPageStyles.playlistTitle}>{playlist.name}</h2>
                {/* <div className={PlaylistDetailPageStyles.buttons}>
                    <button>並べ替え</button>
                </div> */}
                <div className={PlaylistDetailPageStyles.videosArea}>
                    {playlist.video_details?.map((v, index) => (
                        <div key={v.id} className={PlaylistDetailPageStyles.card}>
                            {/* viewer/VideoDetailPageに飛ぶ。type=viewerかuploaderによって、視聴用・投稿用を変えられる仕様。 */}
                            <Link
                                to={`/videos/${v.id}?playlist=${playlistId}&type=${type}`}
                                className={PlaylistDetailPageStyles.videoItem}
                            >
                                <div className={PlaylistDetailPageStyles.content}>
                                    <span className={PlaylistDetailPageStyles.nums}>{index + 1}</span>
                                    <div className={PlaylistDetailPageStyles.thumArea}>
                                        <img src={v.thum} alt={v.title} />
                                    </div>
                                    <div className={PlaylistDetailPageStyles.text}>
                                        <p>{v.title}</p>
                                        <div className={PlaylistDetailPageStyles.sub}>
                                            <span>{v.uploader_name}</span>
                                            <span>{v.views}回視聴・</span>
                                            <span>{TimeSince(v.uploaded_at)}</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                            <button
                                onClick={() => setActiveModal(v.id !== activeModal ? v.id : null)}
                            >
                                <FontAwesomeIcon icon={faEllipsisV} />
                            </button>

                            {v.id === activeModal && (
                                <PlaylistVideoModalMenu
                                    playlist={playlist}
                                    setPlaylist={setPlaylist}
                                    video={v}
                                    type={type}
                                    setActiveModal={setActiveModal}
                                />
                            )}
                        </div>
                    ))}

                </div>

            </div>

        </div>

    )
}

export default PlaylistDetailPage;
