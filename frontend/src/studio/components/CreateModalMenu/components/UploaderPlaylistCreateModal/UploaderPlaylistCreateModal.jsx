// ----react----
import { useContext, useState } from 'react';


// ----services----
import { createUploaderPlaylist } from '../../../../../services/playlists';


// ----context----
import { AuthContext } from '../../../../../context/AuthContext';


// ----components----
import SelectVideosModal from '../SelectVideosModal/SelectVideosModal';


// ----css----
import UploaderPlaylistCreateModalStyles from './UploaderPlaylistCreateModal.module.css';


// ----fontAwsome----
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'








// 親: CreateModalMenu.jsx
// 役割: 投稿用プレイリスト新規作成モーダル表示




function UploaderPlaylistCreateModal({ setActiveModal, setActiveMenu, }) {
    const { accessToken } = useContext(AuthContext);

    const [showSelectModal, setShowSelectModal] = useState(null);
    const [selectedVideos, setSelectedVideos] = useState([]);

    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');


    // 投稿用プレイリストを作成する関数。api呼び出し
    const handleCreate = async () => {
        const videoIds = selectedVideos.map(v => v.id);   // serializerでprimaryKeyRelatedFieldにしたからvideosのidを送信する。
        const data = {
            name: title,
            description: desc,
            videos: videoIds,
        }

        try {
            const result = await createUploaderPlaylist(accessToken, data);  // services/playlists.jsxの関数
            alert('プレイリストを作成しました!');
            setActiveModal(null);  // 親のCreateModalMenu.jsxコンポ自体を破棄する。

        } catch (err) {
            console.error("作成失敗:", err);
            alert("作成に失敗しました");
            setActiveModal(null);
        }


    }




    return (
        <>
            <div className={UploaderPlaylistCreateModalStyles.modalOverlay}>
                <div className={UploaderPlaylistCreateModalStyles.modal}>
                    <div className={UploaderPlaylistCreateModalStyles.top}>
                        <p>新しい投稿用プレイリストの作成</p>
                        <button onClick={() => setActiveModal(null)}><FontAwesomeIcon icon={faXmark} size="lg" /></button>
                    </div>
                    <div className={UploaderPlaylistCreateModalStyles.content}>
                        <div className={UploaderPlaylistCreateModalStyles.titleArea}>
                            <label htmlFor="title">タイトル</label>
                            <textarea
                                className={UploaderPlaylistCreateModalStyles.title}
                                id="title"
                                value={title}
                                placeholder='必須'
                                maxLength={100}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                            <div className={UploaderPlaylistCreateModalStyles.counter}>
                                <p>{title.length} / 100</p>
                            </div>
                        </div>
                        <div className={UploaderPlaylistCreateModalStyles.descArea}>
                            <label htmlFor="desc">説明</label>
                            <textarea
                                className={UploaderPlaylistCreateModalStyles.desc}
                                id="desc"
                                value={desc}
                                maxLength={500}
                                onChange={(e) => setDesc(e.target.value)}
                            />
                            <div className={UploaderPlaylistCreateModalStyles.counter}>
                                <p>{desc.length} / 500</p>
                            </div>
                        </div>

                        <div className={UploaderPlaylistCreateModalStyles.addVideoArea}>
                            <button
                                onClick={() => setShowSelectModal('addVideo')}
                                className={UploaderPlaylistCreateModalStyles.addVideo}>
                                    動画を追加
                            </button>
                        </div>


                    </div>

                    <div className={UploaderPlaylistCreateModalStyles.bottom}>
                        <button
                            className={UploaderPlaylistCreateModalStyles.create}
                            onClick={handleCreate}
                            disabled={!title}
                        >
                            作成
                        </button>
                    </div>

                </div>

            </div>

            {showSelectModal === 'addVideo' && (
                <SelectVideosModal
                    selectedVideos={selectedVideos}
                    setSelectedVideos={setSelectedVideos}
                    closeModal={() => setShowSelectModal(null)}

                />


            )}

        </>

    )

}

export default UploaderPlaylistCreateModal;
