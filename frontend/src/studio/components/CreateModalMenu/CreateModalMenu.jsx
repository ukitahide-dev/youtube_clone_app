
// ----componetns----
import UploaderPlaylistCreateModal from './components/UploaderPlaylistCreateModal/UploaderPlaylistCreateModal';


// ----css----
import CreateModalMenuStyles from './CreateModalMenu.module.css';


// -----fontAwsome-----
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpFromBracket } from '@fortawesome/free-solid-svg-icons';
import { faList } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';




// 親: Header.jsx
// 役割: 動画投稿、投稿用プレイリスト作成など、投稿者がコンテンツを作成する用のモーダルメニューを開く





function CreateModalMenu({ setActiveModal, }) {
    const [activeMenu, setActiveMenu] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(true);



    return (
        <>
            {showCreateModal && (
                <div className={CreateModalMenuStyles.modal}>
                    <ul className={CreateModalMenuStyles.menus}>
                        <li>
                            <span><FontAwesomeIcon icon={faArrowUpFromBracket} /></span>
                            <p>動画をアップロード</p>
                        </li>
                        <li onClick={() => {
                            setActiveMenu('uploaderPlaylist');
                            setShowCreateModal(false);
                        }}>
                            <span><FontAwesomeIcon icon={faList} /></span>
                            <p>投稿用プレイリスト</p>
                        </li>

                    </ul>

                </div>

            )}


            {activeMenu === 'uploaderPlaylist' && (
                <UploaderPlaylistCreateModal
                    setActiveModal={setActiveModal}
                    setActiveMenu={setActiveMenu}
                />
            )}

        </>
    )

}




export default CreateModalMenu;
