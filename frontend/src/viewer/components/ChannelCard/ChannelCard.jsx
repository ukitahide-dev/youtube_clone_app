// ----react----
import { Link } from 'react-router-dom';
import { useContext, useState } from 'react';


// ----services----
import { toggleSubscription } from '../../../services/uploaders';


// ----context----
import { AuthContext } from '../../../context/AuthContext';


// ----css----
import ChannelCardStyles from './ChannelCard.module.css';





// 親: SubscribedChannelsPage.jsx
// 役割: 各ユーザーが登録したチャンネルを表示する。




function ChannelCard({ channel, }) {
    const { accessToken } = useContext(AuthContext);

    const [isSubscribed, setIsSubscribed] = useState(channel.is_subscribed);
    const [subscriberCount, setSubscriberCount] = useState(channel.subscriber_count);



    // チャンネル登録・解除の切り替え
    async function handleToggleSubscription() {
        try {
            const data = await toggleSubscription(accessToken, channel.id);
            setIsSubscribed(data.is_subscribed);
            setSubscriberCount(data.subscriber_count);
        } catch (err) {
            console.error('登録トグル失敗', err);
        }
    }





    return (
        // viewer/ChanndlDetailPage.jsxに飛ぶ
        <div className={ChannelCardStyles.channelCard}>
            <Link to={`/channel/${channel.id}`} className={ChannelCardStyles.channelItem}>
                <div className={ChannelCardStyles.channelIntro}>
                    <div className={ChannelCardStyles.profileIcon}>
                        <img src={channel.profile_icon} alt="" />
                    </div>
                    <div className={ChannelCardStyles.text}>
                        <h3>{channel.username}</h3>
                        <p>チャンネル登録者数{channel.subscriber_count}人</p>
                        <p>チャンネル内容紹介</p>
                    </div>
                </div>
            </Link>
            <div className={ChannelCardStyles.right}>
                <button
                    className={
                        isSubscribed
                            ? ChannelCardStyles.subscribedButton
                            : ChannelCardStyles.subscButton
                    }
                    onClick={handleToggleSubscription}
                >
                    {isSubscribed ? "登録済み" : "チャンネル登録"}
                </button>
            </div>
        </div>
    )
}


export default ChannelCard;
