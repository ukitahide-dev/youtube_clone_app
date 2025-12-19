// ----react----
import { useContext, useEffect, useState } from 'react';


// ----services----
import { fetchCategories } from '../../../services/categories';
import { fetchTags } from '../../../services/tags';


// ----context----
import { AuthContext } from '../../../context/AuthContext';


// ----components----
import UploadVideoForm from './components/UploadVideoForm';


// ----css----
import UploadVideoPageStyles from './UploadVideoPage.module.css';






// 役割: 動画投稿関係の根本の親。すべてのカテゴリーとタグを取得する。






function UploadVideoPage() {
    const { accessToken } = useContext(AuthContext);

    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);


    // カテゴリーとタグを取得する。
    useEffect(() => {
        async function loadCategoriesAndTags() {
            try {
                const catRefs = await fetchCategories(accessToken);
                const tagRefs = await fetchTags(accessToken);
                setCategories(catRefs);
                setTags(tagRefs);
            } catch (err) {
                console.error('カテゴリー、タグ取得に失敗', err);
            }
        }
        loadCategoriesAndTags();
    }, [])



    return (
        <div className={UploadVideoPageStyles.container}>
            <h1>動画を投稿</h1>

            <UploadVideoForm
                categories={categories}
                tags={tags}
            />
        </div>

    );


}


export default UploadVideoPage;
