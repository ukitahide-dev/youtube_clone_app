// ----react----
import { useContext, useState } from 'react';


// ----services----
import { commentPost } from '../../../../../services/comments';


// ----context----
import { AuthContext } from '../../../../../context/AuthContext';


// ----css----
import CommentPostStyles from './CommentPost.module.css';





// 親: CommentSections.jsx
// 役割: コメントを投稿フォームを表示する


function CommentPost({ setComments, videoId }) {
    const { accessToken } = useContext(AuthContext);

    const [commentText, setCommentText] = useState('');



    // コメント投稿処理
    async function handleCommentSubmit(e) {
        e.preventDefault();
        try {
            const newComment = await commentPost(accessToken, videoId, commentText);
            setComments(prev => [newComment, ...prev]);  // 新しくコメントが投稿されたことを親のCommentSection.jsxに伝える。
            setCommentText('');
        } catch (err) {
            console.error('コメント投稿失敗', err);
        }

    }




    return (
        <form className={CommentPostStyles.commentUpload} onSubmit={handleCommentSubmit}>
            <textarea
                value={commentText}
                placeholder="コメントを書く..."
                onChange={(e) => {
                    setCommentText(e.target.value)
                    e.target.style.height = 'auto'
                    e.target.style.height = `${e.target.scrollHeight}px`
                }}
            />
            <button className={CommentPostStyles.commentSubmit} type="submit">
                送信
            </button>
        </form>
    )
}

export default CommentPost;
