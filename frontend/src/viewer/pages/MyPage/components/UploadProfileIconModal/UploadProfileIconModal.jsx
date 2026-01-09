// ----react----
import { useContext, useState } from 'react';


// ----context----
import { AuthContext } from '../../../../../context/AuthContext';


// ----services----
import { uploadProfileIconByUrl } from '../../../../../services/profile';


// ----css----
import UploadProfileIconModalStyles from './UploadProfileIconModal.module.css'






// 親:MyPage.jsx
// 役割: プロフィールアイコンを変更する(本番用)




function UploadProfileIconModal({ onCancel, }) {
    const { user, accessToken, setUser} = useContext(AuthContext);

    const [url, setUrl] = useState(user?.profile_icon_url || '');



    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const data = await uploadProfileIconByUrl(accessToken, url);
            setUser(data);
        } catch (err) {
            console.error('プロフィールアイコン変更に失敗', err);
        }

        onCancel();
    }




    return (
        <div>
            <div className={UploadProfileIconModalStyles.overlay} onClick={onCancel}>
                <div
                    className={UploadProfileIconModalStyles.modal}
                    onClick={(e) => e.stopPropagation()}  // 背景クリックだけ閉じる
                >
                    <h2>プロフィールアイコンを変更</h2>

                    <form onSubmit={handleSubmit}>
                        <input
                            type="url"
                            placeholder="画像URLを入力"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            required
                        />

                        <div className={UploadProfileIconModalStyles.actions}>
                            <button type="button" onClick={onCancel}>
                                キャンセル
                            </button>
                            <button type="submit">
                                保存
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

    )

}



export default UploadProfileIconModal;
