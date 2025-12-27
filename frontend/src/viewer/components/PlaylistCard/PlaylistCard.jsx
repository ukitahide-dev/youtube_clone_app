// ----react----
import { Link } from 'react-router-dom';
import { useState } from 'react';

// ----utils----
import { getThum } from '../../../utils/getThum.js';


// ----components----
import PlaylistModalActions from '../PlaylistModalActions/PlaylistModalActions.jsx';


// ----css----
import playlistCardStyles from './PlaylistCard.module.css';


// ----- fontAwsome -----
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';





// 親: UserPlaylistPage.jsx
// 役割: ユーザーごとのプレイリストをカード型で表示する



function PlaylistCard({ playlist, onSelectVideo, setPlaylists }) {
    const [activeMenu, setActiveMenu] = useState(null);


    // 最新の動画（最後に追加された動画）を取得
    const latestVideo =
        playlist.video_details && playlist.video_details.length > 0
            ? playlist.video_details[0]
            : null;



    return (
        <div className={playlistCardStyles.videoCard}>
            {latestVideo ? (
                <>
                    {/* VideoDetailPageに飛ぶ */}
                    <Link to={`/videos/${latestVideo.id}?playlist=${playlist.id}&type=viewer`}>
                        <div className={playlistCardStyles.thumArea}>
                            <img
                                className={playlistCardStyles.thum}
                                src={getThum(latestVideo)}
                                alt={latestVideo.title}
                                onClick={() => onSelectVideo(latestVideo)}
                            />
                            <div className={playlistCardStyles.videoNums}>
                                <span>{playlist.videos.length}本の動画</span>
                            </div>
                        </div>
                    </Link>
                    <div className={playlistCardStyles.sub}>
                        <h4 className={playlistCardStyles.title}>{playlist.name}</h4>
                        <button onClick={() => setActiveMenu(activeMenu !== playlist.id ? playlist.id : null)}>
                            <FontAwesomeIcon icon={faEllipsisV} />
                        </button>
                    </div>
                </>
            ) : (
                <div className={playlistCardStyles.noVideo}>動画なし</div>
            )}


            {activeMenu === playlist.id && (
                <PlaylistModalActions
                    playlist={playlist}
                    onCancel={() => setActiveMenu(null)}
                    setPlaylists={setPlaylists}
                />
            )}
        </div>
    );
}

export default PlaylistCard;
