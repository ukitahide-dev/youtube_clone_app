// ----react----
import { useState, useRef, useEffect } from 'react'
import { useContext } from 'react'


// ----services----
import { fetchVideoComments } from '../../../services/comments'


// ----context----
import { AuthContext } from '../../../context/AuthContext'


// ----components----
import CommentPost from './components/CommentPost/CommentPost'
import CommentModalMenu from './components/CommentModalMenu/CommentModalMenu'
import CommentEdit from './components/CommentEdit/CommentEdit'
import CommentReaction from './components/CommentReaction/CommentReaction'


// -----css-----
import CommentSectionStyles from './CommentSection.module.css'


// -----fontAwsome-----
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons'







// 親: VideoDetail.page.jsx
// 役割: コメント関係全体を管理する親


function CommentSection({ videoId, })  {
    const { user, accessToken } = useContext(AuthContext);

    const [comments, setComments] = useState([]);
    const [openModalId, setOpenModalId] = useState(null);



    // コメント編集関連
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editingText, setEditingText] = useState('');



    // 動画に紐づくコメントを取得する
    useEffect(() => {
        async function loadComments() {
            try {
                const res = await fetchVideoComments(accessToken, videoId);
                setComments(res);
            } catch (err) {
                console.error('コメント取得に失敗しました', err);
            }

        }

        loadComments();

    }, [accessToken, videoId])







    return (
        <div className={CommentSectionStyles.commentArea}>
            <h3>{comments.length}件のコメント</h3>

            {/* コメント投稿 */}
            <CommentPost
                setComments={setComments}
                videoId={videoId}
            />


            <div className={CommentSectionStyles.commentList}>
                {comments.map((c) => (
                    <div key={c.id} className={CommentSectionStyles.comment}>

                        {/* コメント編集 */}
                        {editingCommentId === c.id && (
                            <CommentEdit
                                comment={c}
                                setComments={setComments}
                                editingText={editingText}
                                setEditingText={setEditingText}
                                setEditingCommentId={setEditingCommentId}

                            />
                        )}

                        {/* コメントリアクション */}
                        <div className={CommentSectionStyles.left}>
                            {editingCommentId !== c.id && (
                                <CommentReaction
                                    comment={c}
                                    videoId={videoId}
                                    setComments={setComments}
                                />
                            )}
                        </div>

                        {/* コメントモーダル */}
                        {c.user === user?.id && (

                            <div className={CommentSectionStyles.right}>
                            {editingCommentId !== c.id && (
                                <button
                                    className={CommentSectionStyles.toggleModal}
                                    onClick={() => setOpenModalId(id => id !== c.id ? c.id : null)}
                                >
                                    <FontAwesomeIcon icon={faEllipsisV} size="lg" />
                                </button>
                            )}

                            {openModalId === c.id && (
                                <CommentModalMenu
                                    comment={c}
                                    setComments={setComments}
                                    setEditingCommentId={setEditingCommentId}
                                    setEditingText={setEditingText}
                                    setOpenModalId={setOpenModalId}
                                />
                            )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default CommentSection;
