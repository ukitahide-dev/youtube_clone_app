// ----react----
import React, { useEffect, useState } from 'react';


// ----services----
import { fetchViewerPlaylists } from '../../../services/playlists';


// -----component-----
import PlaylistCard from '../../components/PlaylistCard/PlaylistCard';
import Sidebar from '../../components/Sidebar/Sidebar';


// -----css------
import UserPlaylistPageStyles from './UserPlaylistPage.module.css';






function UserPlaylistPage() {
    const [playlists, setPlaylists] = useState([]);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const token = localStorage.getItem('accessToken');



    useEffect(() => {
        const loadPlaylists = async () => {
            try {
                const data = await fetchViewerPlaylists(token);
                setPlaylists(data);

                if (data.length > 0 && data[0].video_details.length > 0) {
                    setSelectedVideo(data[0].video_details[0]);
                }
            } catch (err) {
                console.error("プレイリスト取得失敗:", err);
            }
        }

        loadPlaylists();

    }, [token]);



    const handleSelectVideo = (video) => {
        setSelectedVideo(video);
    };



    return (
        <div className={UserPlaylistPageStyles.videoContainer}>
            <Sidebar />

            <div className={UserPlaylistPageStyles.mainArea}>
                <div className={UserPlaylistPageStyles.mainTitle}>
                    <h2>プレイリスト</h2>
                </div>

                <div className={`${UserPlaylistPageStyles.videoCards}`}>
                    {playlists.map((pl) => (
                        <PlaylistCard
                            key={pl.id}
                            playlist={pl}
                            setPlaylists={setPlaylists}
                            onSelectVideo={handleSelectVideo}
                        />
                    ))}
                </div>
            </div>
        </div>
    );

}


export default UserPlaylistPage;
