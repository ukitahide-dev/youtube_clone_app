// ----react----
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";


// ----services----
import { VIDEOS_API } from "../../../../services/api";


// ----context----
import { AuthContext } from "../../../../context/AuthContext";


// ----components----
import TagSelect from "../../../components/TagSelect/TagSelect";
import CategorySelect from "../../../components/CategorySelect/CategorySelect";
import FileInput from "../../../components/FileInput/FileInput";


// ----css----
import UploadVideoFormStyles from './UploadVideoForm.module.css';







// 親: UploadVideoPage.jsx
// 役割: 動画投稿フォーム表示。




function UploadVideoForm({ categories, tags, }) {
    const { accessToken } = useContext(AuthContext);
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [videoFile, setVideoFile] = useState(null);
    const [thumbnail, setThumbnail] = useState(null);

    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedTags, setSelectedTags] = useState([]);




    // タグの追加・削除切り替え
    const toggleTag = (tagId) => {
        if (selectedTags.includes(tagId)) {
            setSelectedTags(selectedTags.filter(id => id !== tagId));
        } else {
            setSelectedTags([...selectedTags, tagId]);
        }

    }


    // 動画投稿処理
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!videoFile || !thumbnail) {
            alert("動画ファイルとサムネイルは必須です");
            return;
        }

        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", desc);
        formData.append("video", videoFile);
        formData.append("thum", thumbnail);
        formData.append("category", selectedCategory);

        selectedTags.forEach(tagId => {
            formData.append("tags", tagId);
        });


        try {
            const res = await axios.post(`${VIDEOS_API}/videos/`, formData, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            // 投稿完了 → 動画詳細ページに飛ぶ。viewer/VideoDetailPage.jsx
            navigate(`/videos/${res.data.id}`);

        } catch (err) {
            console.error("投稿失敗", err);
            alert("投稿に失敗しました");
        }

    }





    return (
        <form onSubmit={handleSubmit} className={UploadVideoFormStyles.form}>
            <label>タイトル</label>
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
            />

            <label>説明</label>
            <textarea
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
            />

            <CategorySelect
                categories={categories}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
            />

            <TagSelect
                tags={tags}
                selectedTags={selectedTags}
                toggleTag={toggleTag}
            />

            <FileInput
                label="動画ファイル"
                accept="video/*"
                onChange={setVideoFile}
                file={videoFile}
                variant="video"
            />

            <FileInput
                label="サムネイル"
                accept="image/*"
                onChange={setThumbnail}
                file={thumbnail}
                variant="thumbnail"
            />

            <button type="submit" className={UploadVideoFormStyles.submitBtn}>
                投稿する
            </button>
        </form>
    );
}

export default UploadVideoForm;
