// ----react----
import { useEffect, useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";


// ----services----
import { fetchSearchedVideos } from "../../../services/videos";

// ----utils----
import { getThum } from "../../../utils/getThum";


// ----components----
import Sidebar from "../../components/Sidebar/Sidebar";
import VideoModalMenu from "../../components/VideoModalMenu/VideoModalMenu";


// ----css----
import SearchResultsPageStyles from './SearchResultsPage.module.css';


// -----fontAwsome-----
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons'





// 遷移元: viewer/Header.jsx
// 役割:


function useQuery() {
    return new URLSearchParams(useLocation().search);  // URL の ?search_query=... 部分だけ取り出す。
}




function SearchResultsPage() {
    const [videos, setVideos] = useState([]);
    const query = useQuery().get('search_query');

    const [activeModal, setActiveModal] = useState(null);


    useEffect(() => {
        const loadVideos = async () => {
            try {
                const data = await fetchSearchedVideos(query);
                setVideos(data);
            } catch (err) {
                console.error('検索結果に不備あり', err);
            }
        }

        loadVideos();

    }, [query]);



    if (!videos) return '読み込み中';






    return (
        <div className={SearchResultsPageStyles.container}>
            <Sidebar />
            <div className={SearchResultsPageStyles.cardList}>
                {videos.map(video => (
                    <div className={SearchResultsPageStyles.card}>
                        <Link key={video.id} to={`/videos/${video.id}`} className={SearchResultsPageStyles.videoItem}>
                            <div className={SearchResultsPageStyles.left}>
                                <img src={getThum(video)} alt={video.title} />
                            </div>

                            <div className={SearchResultsPageStyles.right}>
                                <div className={SearchResultsPageStyles.top}>
                                    <p className={SearchResultsPageStyles.videoTitle}>{video.title}</p>
                                    <span>{video.views}回視聴</span>
                                    <span>何年前</span>
                                </div>
                                <div className={SearchResultsPageStyles.user}>
                                    <img src={video.uploader_icon} alt={video.uploader_name} />
                                    <span className={SearchResultsPageStyles.userName}>{video.uploader_name}</span>
                                </div>
                                <p className={SearchResultsPageStyles.desc}>{video.description}</p>
                            </div>
                        </Link>
                        <button
                            className={SearchResultsPageStyles.menuButton}
                            onClick={() => setActiveModal(activeModal !== video.id ? video.id : null)}
                        >
                            <FontAwesomeIcon icon={faEllipsisV} />
                        </button>

                        {activeModal === video.id && (
                            <VideoModalMenu
                                video={video}
                                setActiveModal={setActiveModal}
                            />
                        )}
                    </div>
                ))}
            </div>

        </div>

    )
}

export default SearchResultsPage;
