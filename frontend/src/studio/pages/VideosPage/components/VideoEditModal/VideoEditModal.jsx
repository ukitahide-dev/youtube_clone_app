
import { useEffect, useState } from 'react';
import { useRef } from 'react';


// ----css----
import VideoEditModalStyles from './VideoEditModal.module.css';


//  -----fontAwsome-----
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'



// 親: VideoModalMenu.jsx
// 役割:



function VideoEditModal({ video, onEdit, categories, tags, onCancel}) {
    const [title, setTitle] = useState(video.title);
    const [thumbnail, setThumbnail] = useState(video.thum);

    const [category, setCategory] = useState(String(video.category || ""));
    const [selectedTags, setSelectedTags] = useState(
        (video.tags || [])
        .map(tag => Number(tag))
        .filter(id => !isNaN(id))
    );

    const fileInputRef = useRef(null);



    // 画像をクリック → ファイル選択を開く
    const handleThumbnailClick = () => {
        fileInputRef.current.click();
    };


    // ファイルが選ばれたときにプレビューを更新
    const handleThumbnailChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageURL = URL.createObjectURL(file);
            setThumbnail(imageURL);
        }
    };



    const handleSave = () => {
        const formData = new FormData();
        formData.append('title', title);

        if (category) {
            formData.append("category", category);
        }

        selectedTags
        .filter(id => !isNaN(id))
        .forEach(tagId => formData.append('tags', tagId));


        console.log("---- FormDataの中身 ----");
        for (let [key, value] of formData.entries()) {
            console.log(`${key}:`, value);
        }

        // サムネイル変更済みなら追加
        if (fileInputRef.current.files[0]) {
            formData.append("thum", fileInputRef.current.files[0]);
        }

        onEdit(video.id, formData);


    }




    return (
        <div className={VideoEditModalStyles.modalOverlay} onClick={onCancel}>
            <div className={VideoEditModalStyles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={VideoEditModalStyles.top}>
                    <h3>動画を編集</h3>
                    <button onClick={onCancel}>
                        <FontAwesomeIcon icon={faXmark} size="lg" />
                    </button>
                </div>
                <div className={VideoEditModalStyles.thumArea}>
                    <p>サムネイル</p>
                    <img
                        src={thumbnail}
                        alt="サムネイル"
                        onClick={handleThumbnailClick}
                        className={VideoEditModalStyles.thumbnail}
                    />
                    {/* 非表示のファイル入力 */}
                    <input
                        type="file"
                        accept="image/*"   // ファイル選択ダイアログで選べるファイルの種類を画像だけに制限する
                        ref={fileInputRef}
                        style={{ display: "none" }}
                        onChange={handleThumbnailChange}
                    />
                </div>
                <div className={VideoEditModalStyles.titleArea}>
                    <label htmlFor="title">タイトル</label>
                    <input
                        id="title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>

                <div className={VideoEditModalStyles.categoryArea}>
                    <label htmlFor="category">カテゴリー</label>
                    <select
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <option value="">選択してください</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={String(cat.id)}>{cat.name}</option>
                        ))}
                    </select>

                </div>

                <div className={VideoEditModalStyles.tagArea}>
                    <p>タグ</p>
                    <div className={VideoEditModalStyles.tagList}>
                        {tags.map((tag) => (
                            <label key={tag.id}>
                            <input
                                type="checkbox"
                                    value={tag.id}
                                    checked={selectedTags.includes(Number(tag.id))}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setSelectedTags([...selectedTags, tag.id]);
                                        } else {
                                            setSelectedTags(selectedTags.filter((id) => id !== tag.id));
                                        }
                                    }}
                            />
                                {tag.name}
                            </label>
                        ))}
                    </div>
                </div>


                <div className={VideoEditModalStyles.saveArea}>
                    <button onClick={handleSave}>保存</button>
                </div>
            </div>

        </div>
    )
}

export default VideoEditModal;
