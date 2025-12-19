// ----react----
import { useContext } from 'react';


// ----services----
import { toggleUploaderPlaylists, toggleViewerPlaylists } from '../../../services/playlists';


// ----context----
import { AuthContext } from '../../../context/AuthContext';


// ----css----
import TogglePlaylistsStyles from './TogglePlaylists.module.css';


// -----fontAwsome-----
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSquareCheck } from '@fortawesome/free-solid-svg-icons'
import { faSquare } from '@fortawesome/free-regular-svg-icons'








// 親: PlaylistsModal.jsx
// 役割: ユーザーのプレイリストをトグルして、プレイリストに動画を追加・削除できるようにする。



function TogglePlaylists({ playlist, setPlaylists, video, playlistType, }) {
    const { accessToken } = useContext(AuthContext);
    let a = 0;

    const isInPlaylist = playlist.videos.includes(video.id);
    console.log('---isInPlaylist----');
    console.log(`${isInPlaylist}: aの値:${a}`);




    // プレイリストに動画を追加、削除する処理。トグルで切り替えられる。
    async function handleToggleVideo(playlistId) {
        try {
            let data;
            if (playlistType === 'viewer') {
                data = await toggleViewerPlaylists(accessToken, playlistId, video.id);
            } else {
                data = await toggleUploaderPlaylists(accessToken, playlistId, video.id);
            }



            setPlaylists(prev =>
                prev.map(pl =>
                    pl.id === playlistId
                    ? {
                        ...pl,
                        videos:
                            data.status === 'added'
                            ? [...pl.videos, video.id]
                            : pl.videos.filter(v => v !== video.id)
                    }
                    : pl

                )
            )
        }  catch (err) {
            console.error(err)
        }
    }




    return (
        <li key={playlist.id} className={TogglePlaylistsStyles.playlistItem}>
            <button
                className={TogglePlaylistsStyles.checkboxBtn}
                onClick={() => handleToggleVideo(playlist.id)}
            >
                <span>
                    <FontAwesomeIcon
                        icon={isInPlaylist ? faSquareCheck : faSquare}
                        size="lg"
                    />
                </span>
                <span className={TogglePlaylistsStyles.playlistName}>
                    {playlist.name}
                </span>
            </button>
        </li>


    )



}



export default TogglePlaylists;
