import { useState, useEffect, useContext } from 'react'
import axios from 'axios'


// ----services----
import { VIDEOS_API } from '../../../services/api'
import { fetchSubscriptions } from '../../../services/subscriptions'
import { toggleSubscription } from '../../../services/uploaders'


// ----context----
import { AuthContext } from '../../../context/AuthContext'


// ----components----
import SubModal from './components/SubModal/SubModal'


// ----css----
import VideoActionsStyles from './VideoActions.module.css'


// -----fontAwsome-----
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-regular-svg-icons'
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';







// 親: VideoDetailPage.jsx
// 役割: 動画の登録。いいね・わるいねを切り替える。プレイリストに保存。




function VideoActions({ video, setVideo, }) {
    const { user, accessToken } = useContext(AuthContext);

    const [isSubscribed, setIsSubscribed] = useState(false);
    const [subscriberCount, setSubscriberCount] = useState(
        video.subscriber_count || 0
    );

    const [activeModal, setActiveModal] = useState(null);


    useEffect(() => {
        async function loadSubscriptions() {
            if (!video || !user) return;
            try {
                const subscriptions = await fetchSubscriptions(accessToken);
                const subscribed = subscriptions.some(sub => sub.subscribed_to === video.uploader);  // この動画投稿者をすでに登録しているかをチェックする
                setIsSubscribed(subscribed);
            } catch (err) {
                console.error(err)
            }
        }
        loadSubscriptions();

    }, [video, user, accessToken])



    // チャンネル登録・解除の切り替え
    async function handleToggleSubscription() {
        try {
            const data = await toggleSubscription(accessToken, video.uploader);
            setIsSubscribed((prev) => !prev)
            setSubscriberCount(data.subscriber_count)
        } catch (err) {
            console.error(err)
        }
    }



    async function handleLikeDislike(action) {
        try {
            const res = await axios.post(
                `${VIDEOS_API}/videos/${video.id}/${action}/`,
                {},
                { headers: { Authorization: `Bearer ${accessToken}` } }
            )
            setVideo((prev) => ({
                ...prev,
                like: res.data.like_count,
                dislike: res.data.dislike_count,
            }))
        } catch (err) {
            console.error(err);
        }
    }




    return (
        <div className={VideoActionsStyles.bottom}>
            <div className={VideoActionsStyles.left}>
                <p>投稿者: {video.uploader_name}</p>
                <span>{video.views}回視聴</span>
                <span>チャンネル登録者数{subscriberCount}人</span>
            </div>
            <div className={VideoActionsStyles.right}>
                {user && video.uploader !== user?.id && (  // 自分の動画の場合は登録ボタンを表示させない
                    <button onClick={handleToggleSubscription}>
                        {isSubscribed ? '登録解除' : 'チャンネル登録'}
                    </button>
                )}
                <button
                    className={VideoActionsStyles.likeButton}
                    onClick={() => handleLikeDislike('like')}
                >
                    <FontAwesomeIcon icon={faThumbsUp} /> {video.like}
                </button>
                <button
                    className={VideoActionsStyles.dislikeButton}
                    onClick={() => handleLikeDislike('dislike')}
                >
                    <FontAwesomeIcon icon={faThumbsDown} /> {video.dislike}
                </button>
                <button onClick={() => setActiveModal(activeModal === null ? 'subModal' : null)}>
                    <FontAwesomeIcon icon={faEllipsisV} />
                </button>
            </div>


            {activeModal === 'subModal' && (
                <SubModal
                    video={video}
                    setActiveModal={setActiveModal}
                />
            )}
        </div>
    )
}



export default VideoActions;
