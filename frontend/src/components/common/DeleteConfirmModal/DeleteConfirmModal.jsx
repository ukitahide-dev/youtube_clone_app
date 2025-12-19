


// -----css-----
import DeleteConfirmModalStyles from './DeleteConfirmModal.module.css';


//  -----fontAwsome-----
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons'
import { faXmark } from '@fortawesome/free-solid-svg-icons'



// 親: studio/VideoModalMenu.jsx、studio/PlaylistModalMenu.jsx、viewer/PlaylistVideoModalMenu.jsx、
// 役割: 動画・プレイリスト削除時に出す確認モーダル。






function DeleteConfirmModal({ message, onCancel, onConfirm}) {
    return (
        <div className={DeleteConfirmModalStyles.modalOverlay} onClick={onCancel}>
            <div className={DeleteConfirmModalStyles.modal} onClick={(e) => e.stopPropagation()}>
                <p>{message}</p>
                <div className={DeleteConfirmModalStyles.buttons}>
                    <button
                        onClick={onConfirm}>
                        <FontAwesomeIcon icon={faTrashAlt} size="lg" />削除
                    </button>
                    <button
                        onClick={onCancel}>
                        <FontAwesomeIcon icon={faXmark} size="lg" />キャンセル
                    </button>
                </div>
            </div>
        </div>
    );


}


export default DeleteConfirmModal;
