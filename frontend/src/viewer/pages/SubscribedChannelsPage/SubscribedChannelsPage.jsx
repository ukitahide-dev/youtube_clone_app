// ----react----
import { useContext, useEffect, useState } from "react";


// ----services----
import { fetchSubscribedChannels } from "../../../services/subscriptions";


// ----context----
import { AuthContext } from "../../../context/AuthContext";


// ----components----
import ChannelCard from "../../components/ChannelCard/ChannelCard";
import SideBar from "../../components/SideBar/SideBar";


// -----css-----
import SubscribedChannelsPageStyles from './SubscribedChannelsPage.module.css';





// 親: ViewerRoutes.jsx
// 役割: 各ユーザーが登録したチャンネルを取得して一覧で表示する。






function SubscribedChannelsPage() {
    const [channels, setChannels] = useState([]);
    const { accessToken } = useContext(AuthContext);


    // 登録したチャンネルをすべて表示する
    useEffect(() => {
        async function loadSubscribedChannels() {
            try {
                const data = await fetchSubscribedChannels(accessToken);
                setChannels(data);
            } catch (err) {
                console.error("登録チャンネル一覧の取得に失敗:", err);
            }
        }

        loadSubscribedChannels();

    }, [])






    return (
        <div className={SubscribedChannelsPageStyles.container}>
            <SideBar />
            <div className={SubscribedChannelsPageStyles.main}>
                <h2 className={SubscribedChannelsPageStyles.mainTitle}>登録チャンネル</h2>
                <div className={SubscribedChannelsPageStyles.channels}>
                    {channels.map((channel) => (
                        <ChannelCard
                            // channel.idはユーザーのidのこと。
                            key={channel.id}
                            channel={channel}
                        />
                    ))}
                </div>

            </div>
        </div>
    );

}

export default SubscribedChannelsPage;
