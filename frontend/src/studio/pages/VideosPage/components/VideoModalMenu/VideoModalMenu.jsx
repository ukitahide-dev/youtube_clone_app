
import { useState, useEffect, useContext } from "react";


// ----services----
import { fetchCategories } from "../../../../../services/categories";
import { fetchTags } from "../../../../../services/tags";


// ----components----
import VideoEditModal from "../VideoEditModal/VideoEditModal";
import DeleteConfirmModal from "../../../../../components/common/DeleteConfirmModal/DeleteConfirmModal";


// ----context----
import { AuthContext } from "../../../../../context/AuthContext";


// ----css----
import VideoModalMenuStyles from './VideoModalMenu.module.css';






// 親: VideosPage.jsx
// 役割: 三点ドットメニューの内容をモーダルで表示する







function VideoModalMenu({ onDelete, setActiveMenu, onEdit, video,  }) {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [activeModal, setActiveModal] = useState(null);

    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);

    const {accessToken} = useContext(AuthContext);



    useEffect(() => {
        const loadData = async () => {
            const [catData, tagData] = await Promise.all([
                fetchCategories(accessToken),
                fetchTags(accessToken),
            ]);

            setCategories(catData);
            setTags(tagData);
        }

        loadData();

    }, []);



    return (
        <>
            {!showDeleteModal && (
                <div className={VideoModalMenuStyles.modal}>
                    <div className={VideoModalMenuStyles.buttons}>
                        <button onClick={() => setActiveModal('edit')}>編集</button>
                        <button onClick={() => setActiveModal('delete')}>削除</button>
                        <button onClick={() => setActiveModal('playlist')}>プレイリストに保存</button>
                    </div>
                </div>

            )}


            {activeModal === "delete" && (
                <DeleteConfirmModal
                    message="この動画を削除しますか?"
                    onConfirm={() => {
                        onDelete();  // 親に削除処理を依頼
                        setActiveMenu(null);
                    }}
                    onCancel={() => {
                        setActiveMenu(null);
                    }}
                />
            )}


            {activeModal === 'edit' && (
                <VideoEditModal
                    video={video}
                    onEdit={onEdit}
                    categories={categories}
                    tags={tags}
                    onCancel={() => setActiveMenu(null)}

                />
            )}
        </>
    );

}

export default VideoModalMenu;
