// ----react----
import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';


// ----context----
import { AuthContext } from '../../../context/AuthContext';


// ----utils----
import { formatDate } from '../../../utils/FormatDate';


// ----services----
import { fetchUploaderPlaylists, fetchViewerPlaylists } from '../../../services/playlists';


// ----components----
import PlaylistModalMenu from './components/PlaylistModalMenu/PlaylistModalMenu';


// ----css----
import PlaylistsPageStyles from './PlaylistsPage.module.css';


// -----fontAwsome-----
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartColumn } from '@fortawesome/free-solid-svg-icons';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';





// 役割: プレイリスト関係の根本の親





function PlaylistsPage() {
    const { accessToken } = useContext(AuthContext);


    const [viewerPlaylists, setViewerPlaylists] = useState([]);
    const [uploaderPlaylists, setUploaderPlaylists] = useState([]);
    const [activeTab, setActiveTab] = useState('viewer');
    const [activeMenu, setActiveMenu] = useState(null);



    useEffect(() => {
        const fetchPlaylists = async () => {
            try {
                const viewerData = await fetchViewerPlaylists(accessToken);
                const uploaderData = await fetchUploaderPlaylists(accessToken);
                setViewerPlaylists(viewerData);
                setUploaderPlaylists(uploaderData);
            } catch (err) {
                console.error('プレイリスト取得失敗', err);
            }
        }

        fetchPlaylists();

    }, [accessToken])


    const playlists = activeTab === 'viewer' ? viewerPlaylists : uploaderPlaylists;





    return (
        <>
            <div className={PlaylistsPageStyles.playlistMenu}>
                <button
                    className={activeTab === 'viewer' ? PlaylistsPageStyles.active : ''}
                    onClick={() => setActiveTab('viewer')}
                >
                    視聴用
                </button>
                <button
                    className={activeTab === 'uploader' ? PlaylistsPageStyles.active : ''}
                    onClick={() => setActiveTab('uploader')}
                >
                    投稿用
                </button>
            </div>

            <div className={`${PlaylistsPageStyles.head} ${PlaylistsPageStyles.col}`}>
                <p>プレイリスト</p>
                <p>日付</p>
                <p>動画数</p>
                <p>視聴回数</p>
            </div>

            {playlists.map(pl => (
                <div key={pl.id} className={`${PlaylistsPageStyles.plArea} ${PlaylistsPageStyles.col}`}>
                    <div className={PlaylistsPageStyles.left}>
                        <img src={pl.video_details[0]?.thum}  />
                        <div>
                            <p className={PlaylistsPageStyles.plTitle}>
                                {pl.name.length > 10 ? pl.name.slice(0, 10) + '...' : pl.name}
                            </p>
                            <p className={PlaylistsPageStyles.plDesc}>{pl.description}</p>
                            <div className={PlaylistsPageStyles.menus}>
                                <Link to={`/studio/analytics/${pl.id}`}>
                                    <FontAwesomeIcon icon={faChartColumn} />
                                </Link>
                                <button
                                    onClick={() => setActiveMenu(activeMenu === pl.id ? null : pl.id)}>
                                    <FontAwesomeIcon icon={faEllipsisV} />
                                </button>
                            </div>
                        </div>
                    </div>
                    <p>{formatDate(pl.created_at)}</p>
                    <p>{pl.video_details.length}</p>
                    <p>{pl.views}aaa</p>

                    {activeMenu === pl.id && (
                        <PlaylistModalMenu
                            playlist={pl}
                            activeTab={activeTab}
                            onCancel={() => setActiveMenu(null)}
                            setViewerPlaylists={setViewerPlaylists}
                            setUploaderPlaylists={setUploaderPlaylists}
                        />


                    )}
                </div>
            ))}


        </>
    )
}

export default PlaylistsPage;
