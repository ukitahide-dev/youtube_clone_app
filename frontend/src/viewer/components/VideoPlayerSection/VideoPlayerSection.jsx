// ----react----
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

// ----services----
import { VIDEOS_API } from '../../../services/api'

import axios from 'axios'




// 親: VideoDetailPage.jsx
// サイドバーのプレイリストや、いいねした動画を再生する



function VideoPlayerSection({
    video,
    token,
    playlistVideos = [],
    likedVideos = [],
    playlistId,
    showLiked,
}) {
    const navigate = useNavigate()
    const [currentIndex, setCurrentIndex] = useState(0);

    const videosList = showLiked ? likedVideos : playlistVideos;

    const videoRef = useRef(null);        // useRef は 「画面を再描画せずに、値やDOMを覚えておける箱」。
    const lastPositionRef = useRef(0);   // 最後に再生した位置（秒）」を入れる箱（常に最新値を保持）最新の値を使いたい場合はstate不向き。refが適切。




    useEffect(() => {
        if (videosList.length > 0) {
            const index = videosList.findIndex((v) => v.id === video.id)   // 「今どの動画を再生中なのか？」を配列上で把握するための一行
            setCurrentIndex(index);
        }

    }, [videosList, video]);



    useEffect(() => {
        const handleTimeUpdate = () => {
            if (videoRef.current) {
                const current = Math.floor(videoRef.current.currentTime);
                lastPositionRef.current = current;  // useRefにも常に最新値を入れる
            }
        }

        if (videoRef.current) {
            videoRef.current.addEventListener('timeupdate', handleTimeUpdate);  // 動画が再生中に再生位置が変わったらhandleTimeUpdate 関数を呼べという意味。
        }

        return () => {   // コンポーネントがアンマウントされたときにイベントを解除して安全にする。
            if (videoRef.current) {
                videoRef.current.removeEventListener('timeupdate', handleTimeUpdate);
            }
        }

    }, []);




    useEffect(() => {
        const sendPendingWatches = async () => {
            const pending = JSON.parse(localStorage.getItem("pending_watches") || "[]");
            if (pending.length === 0) return;

            const sent = [];  // サーバーに送信成功したデータをsentに入れる

            for (const item of pending) {
                try {
                    await axios.post(
                        `${VIDEOS_API}/videos/${item.videoId}/increment_views/`,   // video_views.pyのincrement_viewsカスタムメソッドを実行
                        { watch_duration: item.watch_duration },
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    sent.push(item);
                } catch (err) {
                    console.error("❌ 送信失敗:", err);
                    }
            }


            // pendingの中で、sentに含まれていないデータだけ残す処理
            const remaining = pending.filter(
                (item) => !sent.some((s) => s.videoId === item.videoId)
            );

            localStorage.setItem("pending_watches", JSON.stringify(remaining));

        };

        if (token) {
            sendPendingWatches();
        }

    }, [token]);




    // 動画を最後まで視聴した際に実行される
    const sendWatchDuration = async () => {
        const duration = Math.floor(videoRef.current.currentTime);

        try {
            await axios.post(
                `${VIDEOS_API}/videos/${video.id}/increment_views/`,
                { watch_duration: duration },
                { headers: { Authorization: `Bearer ${token}` } }
            )
        } catch (err) {
            console.error('再生時間送信エラー', err)
        }
    }


    // ビデオ終了時に実行
    const handleVideoEnd = () => {
            sendWatchDuration();

            if (videosList.length === 0) return

            const nextVideo = videosList[currentIndex + 1]

            if (!nextVideo) return

            if (showLiked) {
                navigate(`/videos/${nextVideo.id}?liked=true`)
            } else {
                navigate(`/videos/${nextVideo.id}?playlist=${playlistId}`)
            }
    }



    useEffect(() => {
        return () => {
            let duration = lastPositionRef.current;   // 最新の値を取得

            if (videoRef.current) {
                duration = Math.floor(videoRef.current.currentTime);
            }

            const pendingData = {
                videoId: video.id,
                watch_duration: duration,
                timestamp: Date.now(),
            };

            // 既存データを取得
            const pending = JSON.parse(localStorage.getItem("pending_watches") || "[]");

            // 追加して保存
            pending.push(pendingData);
            localStorage.setItem("pending_watches", JSON.stringify(pending));

        }
    }, [video]);




    return (
        video.video_url ? (  // 本番用
            <iframe
                src={video.video_url}
                width="100%"
                height="480"
                // frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={video.title}
            />
        ) : (  // 開発用
            <video
                ref={videoRef}
                src={video.video}
                controls
                autoPlay
                onEnded={handleVideoEnd}
                // onTimeUpdate={handleTimeUpdate}
                style={{ width: '100%' }}
            />
        )
    );

}



export default VideoPlayerSection



