import { useContext, useEffect, useState } from 'react';


// ----services----
import { fetchMyVideos } from '../../../../../services/videos';


// ----context----
import { AuthContext } from '../../../../../context/AuthContext';


// ----utils----
import { formatDate } from '../../../../../utils/FormatDate';


// ----css----
import SelectVideosModalStyles from './SelectVideosModal.module.css';




// 親: UploaderPlaylistCreateModal.jsx
// 役割: 新規作成する投稿用プレイリストに入れる動画を選ぶ。




function SelectVideosModal({ selectedVideos, setSelectedVideos, closeModal}) {

    const { accessToken } = useContext(AuthContext);
    const [videos, setVideos] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');



    useEffect(() => {
        async function fetchVideos() {
            const videosData = await fetchMyVideos(accessToken);
            setVideos(videosData);

        }

        fetchVideos();

    }, [accessToken])



    //  動画の選択状態を切り替える関数
    const toggleSelect = (video) => {
        const already = selectedVideos.some(v => v.id === video.id);

        if (already) {
            setSelectedVideos(selectedVideos.filter(v => v.id !== video.id));
        } else {
            setSelectedVideos([...selectedVideos, video]);
        }
    }


    const filteredVideos = videos.filter(v =>
        v.title.toLowerCase().includes(searchTerm.toLocaleLowerCase())
    );



    return (
        <div className={SelectVideosModalStyles.modalOverlay}>
            <div className={SelectVideosModalStyles.modal}>
                <div className={SelectVideosModalStyles.top}>
                    <h3>動画の追加</h3>
                </div>
                <div className={SelectVideosModalStyles.main}>
                    <div className={SelectVideosModalStyles.left}>
                        <div className={SelectVideosModalStyles.top}>
                            <input
                                type="text"
                                placeholder='動画タイトルを検索'
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className={SelectVideosModalStyles.content}>
                            {filteredVideos.map(video => (
                                <div
                                    key={video.id}
                                    className={`${SelectVideosModalStyles.videoItem} ${
                                        selectedVideos.some(v => v.id === video.id)
                                        ? SelectVideosModalStyles.selected
                                        : ''
                                    }`}
                                    onClick={() => toggleSelect(video)}
                                >
                                    <img src={video.thum} alt={video.title} />
                                    <div className={SelectVideosModalStyles.bottom}>
                                        <p className={SelectVideosModalStyles.title}>{video.title}</p>
                                        {/* <span>チェックアイコン</span> */}
                                    </div>

                                </div>
                            ))}
                        </div>
                    </div>
                    <div className={SelectVideosModalStyles.right}>
                        <div className={SelectVideosModalStyles.top}>
                            <p>追加する動画</p>
                        </div>
                        <div className={SelectVideosModalStyles.content}>
                            {selectedVideos.map(v => (
                                <div key={v.id} className={SelectVideosModalStyles.videoItem}>
                                    <div className={SelectVideosModalStyles.left}>
                                        <img src={v.thum} alt={v.title} />
                                    </div>
                                    <div className={SelectVideosModalStyles.right}>
                                        <p className={SelectVideosModalStyles.title}>{v.title}</p>
                                        <p className={SelectVideosModalStyles.upload}>投稿日: <span>{formatDate(v.uploaded_at)}</span></p>
                                    </div>

                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className={SelectVideosModalStyles.buttons}>
                    <button className={SelectVideosModalStyles.cancel} onClick={closeModal}>キャンセル</button>
                    <button className={SelectVideosModalStyles.save} onClick={closeModal}>完了</button>
                </div>

            </div>

        </div>

    )
}

export default SelectVideosModal;
