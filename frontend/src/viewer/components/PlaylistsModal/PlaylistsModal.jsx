// ----react----
import { useContext, useEffect, useState } from 'react';


// ----services----
import { fetchUploaderPlaylists, fetchViewerPlaylists } from '../../../services/playlists';


// ----context----
import { AuthContext } from '../../../context/AuthContext';


// ----component----
import TogglePlaylists from '../TogglePlaylists/TogglePlaylists';
import CreatePlaylistModal from '../CreatePlaylistModal/CreatePlaylistModal';


// ----css----
import PlaylistsModalStyles from './PlaylistsModal.module.css';


// -----fontAwsome-----
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'









// 親: PlaylistVideoModalMenu.jsx、SubModal.jsx、LikeVideoModalMenu.jsx、VideoModalMenu.jsx
// 役割: ユーザーが作成したプレイリストを、モーダルで全て表示する。このモーダルは色んなファイルから使いまわす。






function PlaylistsModal({ video, setActiveModal, playlistType}) {
    const { accessToken } = useContext(AuthContext);
    const [playlists, setPlaylists] = useState([]);
    const [isOpen, setIsOpen] = useState(true);
    const [createPlaylistModal, setCreatePlaylistModal] = useState(null);




    // ユーザーが作成済みのプレイリストを全て取得する。playlistTypeにより場合分け。
    useEffect(() => {
        async function loadPlaylists() {
            try {
                let data;
                if (playlistType === 'viewer') {
                    data = await fetchViewerPlaylists(accessToken);
                } else {
                    data = await fetchUploaderPlaylists(accessToken);
                }

                setPlaylists(data);
                console.log('----loadPlaylistsのdata----');
                console.log(data);
            } catch (err) {
                console.error(err)
            }
        }
        loadPlaylists();

    }, [accessToken, playlistType])



    return (
        <>
            {isOpen && (
                <>
                    <div
                        className={PlaylistsModalStyles.modal}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className={PlaylistsModalStyles.top}>
                            <h3>保存先...</h3>
                            <button
                                className={PlaylistsModalStyles.xbutton}
                                onClick={() => setActiveModal(null)}   // 根本の親PlaylistSidebar.jsx、VideoActions.jsx、LikeVideoPart.jsx、VideoModalMenu.jsxに伝える。これで全部リセットできる。
                            >
                                <FontAwesomeIcon icon={faXmark} />
                            </button>
                        </div>

                        {/* 既に作成済みのプレイリスト名を全て表示。スクロールできるようにする。 */}
                        <ul className={PlaylistsModalStyles.playlistList}>
                            {playlists.map(pl => (
                                <TogglePlaylists
                                    key={pl.id}
                                    playlist={pl}
                                    setPlaylists={setPlaylists}
                                    video={video}
                                    playlistType={playlistType}
                                />
                            ))}
                        </ul>

                        <div className={PlaylistsModalStyles.createPlaylistArea}>
                            <button onClick={() => {
                                setCreatePlaylistModal('createPlaylist')
                                setIsOpen(false);
                            }}>
                                新しいプレイリストを作成
                            </button>
                        </div>
                    </div>
                </>
            )}

            {createPlaylistModal === 'createPlaylist' && (
                <CreatePlaylistModal
                    video={video}
                    playlistType={playlistType}
                    setActiveModal={setActiveModal}
                />
            )}

        </>
    )
}

export default PlaylistsModal;
