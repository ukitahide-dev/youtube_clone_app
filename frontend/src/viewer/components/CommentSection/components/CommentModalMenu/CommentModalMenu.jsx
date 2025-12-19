// ----react----
import { useContext } from 'react';


// ----services----
import { commentDelete } from '../../../../../services/comments';


// ----context----
import { AuthContext } from '../../../../../context/AuthContext';


// ----css----
import CommentModalMenuStyles from './CommentModalMenu.module.css';


// -----fontAwsome-----
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons'
import { faEdit } from '@fortawesome/free-regular-svg-icons'








// 親: CommentSection.jsx
// 役割: コメント編集・削除モーダルメニューを開く。削除処理はここで行う。


function CommentModalMenu({ comment, setComments, setEditingCommentId, setEditingText, setOpenModalId, }) {
    const { accessToken } = useContext(AuthContext);



    // コメント削除
    const handleDelete = async (commentId) => {
        try {
            await commentDelete(accessToken, commentId);
            setComments(prev => prev.filter(c => c.id !== commentId));   //親のCommentSection.jsxに、コメント削除したことを伝える。
        } catch (err) {
            console.error('コメント削除に失敗', err)
        }
    }



    //コメント編集
    function handleEditClick(comment) {
        setEditingCommentId(comment.id);
        setEditingText(comment.text);
        setOpenModalId(prev => prev === comment.id ? null : comment.id);
    }


    return (
        <div className={CommentModalMenuStyles.commentModal}>
            <button onClick={() => handleEditClick(comment)}>
                <FontAwesomeIcon icon={faEdit} size="lg" />
                    編集
            </button>
            <button
                onClick={() => {
                    handleDelete(comment.id);
                }}
            >
                <FontAwesomeIcon icon={faTrashAlt} size="lg" />
                    削除
            </button>
        </div>
    )
}

export default CommentModalMenu;
