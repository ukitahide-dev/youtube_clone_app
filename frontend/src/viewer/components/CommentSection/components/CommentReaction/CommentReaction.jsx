// ----react----
import { useContext } from 'react';


// ----services----
import { toggleCommentReaction } from '../../../../../services/commentReactions';
import { fetchVideoComments } from '../../../../../services/comments';


// ----context----
import { AuthContext } from '../../../../../context/AuthContext';


// ----css----
import CommentReactionStyles from './CommentReaction.module.css';


// -----fontAwsome-----
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-regular-svg-icons'







// 親: CommentSection.jsx
// 役割: コメントにいいね・わるいねを付ける。


function CommentReaction({ comment, videoId, setComments, }) {
    const { accessToken } = useContext(AuthContext);


    async function handleReaction(commentId, isLiked) {
        try {
            await toggleCommentReaction(accessToken, commentId, isLiked);

            // コメント一覧を再取得
            const comments = await fetchVideoComments(accessToken, videoId);
            setComments(comments || []);
        } catch (err) {
            console.error('コメントリアクション失敗', err);
        }
    }





    return (
        <div>
            <p>
                <strong>{comment.user_name}</strong>
            </p>
            <p>{comment.text}</p>
            <div className={CommentReactionStyles.buttons}>
                <button
                    className={CommentReactionStyles.commentLike}
                    onClick={() => handleReaction(comment.id, true)}
                >
                    <FontAwesomeIcon icon={faThumbsUp} />
                    {comment.like_count}
                </button>
                <button
                    className={CommentReactionStyles.commentDislike}
                    onClick={() => handleReaction(comment.id, false)}
                >
                    <FontAwesomeIcon icon={faThumbsDown} />
                    {comment.dislike_count}
                </button>
            </div>
        </div>
    )
}

export default CommentReaction;
