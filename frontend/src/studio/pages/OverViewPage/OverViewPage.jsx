// ----react----
import { useContext, useEffect, useState } from "react";


// ----services----
import { VIDEOS_API } from "../../../services/api";


// ----context----
import { AuthContext } from "../../../context/AuthContext";


// ----recharts----
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer } from "recharts";

import axios from "axios";


// -----css-----
import OverViewPageStyles from './OverViewPage.module.css';


// 親: ChannelAnalyticsPage.jsx
// 役割: チャンネル全体の総再生数、総再生時間、チャンネル登録者数の推移を月ごとにグラフで表示



function OverViewPage() {
    const { user, accessToken } = useContext(AuthContext);

    const [data, setData] = useState([]);
    const [selectedMetric, setSelectedMetric] = useState("views");




    useEffect(() => {
        if (!user) return;

        const fetchData = async () => {
            try {
                const res = await axios.get(
                    `${VIDEOS_API}/analytics/channel/${user.id}/channel_status/`,  // analytics_views.pyのchannel_statusカスタムメソッドを実行
                    {
                        headers: {Authorization: `Bearer ${accessToken}`,}
                    }

                );

                setData(res.data);

            } catch (error) {
                console.error("データ取得エラー", error);
            }
        };

        fetchData();

    }, [user, accessToken]);


    const metricLabels = {
        views: "再生回数",
        watch_time: "視聴時間(秒)",
        subscribers: "登録者数",
    };


    return (
        <div className={OverViewPageStyles.graphArea}>
            <div className={OverViewPageStyles.tab}>
                {Object.keys(metricLabels).map((key) => (
                    <button
                        key={key}
                        className={`${selectedMetric === key ? OverViewPageStyles.active : ""}`}
                        onClick={() => setSelectedMetric(key)}
                    >
                        {metricLabels[key]}
                    </button>
                ))}
            </div>
            <div className={OverViewPageStyles.graphWrapper}>
                <ResponsiveContainer className={OverViewPageStyles.graph}>
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        {/*  選択したメトリクスだけ表示 Lineは折れ線そのもの */}
                        <Line
                            type="monotone"
                            dataKey={selectedMetric}
                            name={metricLabels[selectedMetric]}
                            stroke="#8884d8"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
  );


}


export default OverViewPage;
