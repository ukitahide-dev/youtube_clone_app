// ----react----
import { useState } from 'react';

// ----css----
import PlaylistEditModalStyles from './PlaylistEditModal.module.css';


//  -----fontAwsome-----
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'






// 親: viewer/PlaylistModalActions.jsx
// 役割: プレイリスト編集モーダルを表示。視聴用プレイリスト専用。




function PlaylistEditModal({ playlist, onEdit, onCancel, }) {
    const [newName, setNewName] = useState(playlist.name || "");

    const handleSave = () => {

        onEdit(playlist.id, newName);

    }



    return (
        <div className={PlaylistEditModalStyles.modalOverlay} onClick={onCancel}>
            <div
                className={PlaylistEditModalStyles.modal}
                onClick={(e) => e.stopPropagation()}
            >
                <div className={PlaylistEditModalStyles.top}>
                    <h3>プレイリストの編集</h3>
                    <button
                        onClick={() => {
                            onCancel();
                        }}
                    >
                        <FontAwesomeIcon icon={faXmark} size="lg" />
                    </button>
                </div>
                <div className={PlaylistEditModalStyles.thumArea}>
                    <img src={playlist.video_details[0].thum} alt="" />
                </div>

                <div className={PlaylistEditModalStyles.titleArea}>
                    <label className={PlaylistEditModalStyles.editTitle}>タイトル</label>
                    <input
                        type="text"
                        placeholder="タイトルを入力"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                    />
                </div>

                <button
                    className={PlaylistEditModalStyles.saveButton}
                    onClick={handleSave}
                >
                    保存
                </button>
            </div>
        </div>
    )



}



export default PlaylistEditModal;
