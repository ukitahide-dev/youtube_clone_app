// ----react----
import { Link } from "react-router-dom";




// ----css-----
import ChannelPlaylistsStyles from './ChannelPlaylists.module.css';




// 親: ChannelDetailPage.jsx
// 役割: 今見てるチャンネルの投稿用プレイリストを表示する


function ChannelPlaylists({ playlists, uploaderId, }) {


    return (
        <div className={ChannelPlaylistsStyles.channels}>
            {playlists.map(playlist => (
                <Link
                    key={playlist.id}
                    // viewer/VideoDetailPageに飛ぶ
                    to={`/videos/${playlist.videos[0]}?playlist=${playlist.id}&type=uploader&uploader=${uploaderId}`}
                    className={ChannelPlaylistsStyles.channelCard}
                >
                    <div className={ChannelPlaylistsStyles.thum}>
                        <img src={playlist.video_details[0].thum} alt="" />
                        <p className={ChannelPlaylistsStyles.videoNums}>{playlist.videos.length}本の動画</p>
                    </div>
                    <p className={ChannelPlaylistsStyles.title}>{playlist.name}</p>

                </Link>
            ))}

        </div>

    )


}


export default ChannelPlaylists;
