// ----react----
import { useContext } from 'react';


// ----services----
import { commentEdit } from '../../../../../services/comments';


// ----context----
import { AuthContext } from '../../../../../context/AuthContext';


// ----css----
import CommentEditStyles from './CommentEdit.module.css';





// 親: CommentSection.jsx
// 役割: コメント編集



function CommentEdit({ comment, setComments, editingText, setEditingText, setEditingCommentId}) {
    const { accessToken } = useContext(AuthContext);


    // コメント編集
    async function handleSaveEdit(commentId) {
        try {

            await commentEdit(accessToken, commentId, editingText);
            setComments(prev =>
                prev.map(c => c.id === commentId ? {...c, text: editingText} : c)
            );
            setEditingCommentId(null);
            setEditingText('');
        } catch (err) {
            console.error('コメント編集に失敗', err);
        }
    }





    return (
        <div className={CommentEditStyles.editCommentArea}>
            <textarea
                // ref={(el) => (commentRefs.current[comment.id] = el)}
                value={editingText}
                onChange={(e) => {
                    setEditingText(e.target.value)
                    e.target.style.height = 'auto'  //  一旦リセット
                    e.target.style.height = `${e.target.scrollHeight}px`  // 入力内容に合わせて高さを調整
                }}
            />
            <div className={CommentEditStyles.editButtons}>
                <button
                    className={CommentEditStyles.save}
                    onClick={() => handleSaveEdit(comment.id)}
                >
                    保存
                </button>
                <button
                    className={CommentEditStyles.cancel}
                    onClick={() => {
                        setEditingCommentId(null);
                        setEditingText('');
                    }}
                >
                    キャンセル
                </button>
            </div>
        </div>
    )
}



export default CommentEdit;
