// ----react----
import { useContext, useEffect, useState } from "react";

// ----context----
import { AuthContext } from "../../../context/AuthContext";

// ----services----
import { fetchLikedVideos } from "../../../services/Likes";

// ----components----
import SideBar from "../../components/SideBar/SideBar";
import LikeVideoList from "./components/LikeVideoList/LikeVideoList";


// ----css----
import LikeVideosPageStyles from './LikeVideosPage.module.css';



function LikeVideosPage() {
    const { accessToken } = useContext(AuthContext);
    const [likedVideos, setLikedVideos] = useState([]);

    useEffect(() => {
        async function loadLikedVideos() {
            try {
                const data = await fetchLikedVideos(accessToken);
                setLikedVideos(data);

            } catch (err) {
                console.log('いいねした動画一覧取得失敗', err);
            }

        }

        loadLikedVideos();


    }, [accessToken, ])



    return (
        <div className={LikeVideosPageStyles.videoContainer}>
            <SideBar />
            <LikeVideoList
                videos={likedVideos}
                setLikedVideos={setLikedVideos}
            />
        </div>
    )
}

export default LikeVideosPage;
