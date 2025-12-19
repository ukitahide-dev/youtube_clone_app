// ----react----
import { Link } from 'react-router-dom';
import { useState } from 'react';


// ----components----
import SidebarSubscModal from './components/SidebarSubscModal/SidebarSubscModal.jsx';


// -----css-----
import SidebarStyles from './Sidebar.module.css';


// ---fontawsome---
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { faFolderOpen } from '@fortawesome/free-regular-svg-icons';
import { faCircleUser } from '@fortawesome/free-regular-svg-icons';
import { faSquareCaretRight } from "@fortawesome/free-regular-svg-icons";





function Sidebar() {
    const [activeModal, setActiveModal] = useState(null);





    return (
        <div className={SidebarStyles.sidebarArea}>
            <ul className={SidebarStyles.menus}>
                <li>
                    <Link to="/">
                        <span><FontAwesomeIcon icon={faHouse} /></span>
                        <span>ホーム</span>
                    </Link>
                </li>
                <li className={SidebarStyles.subsc}>
                    <button onClick={() => setActiveModal(activeModal === null ? 'subsc' : null)}>
                        <span><FontAwesomeIcon icon={faFolderOpen} /></span>
                        <span>登録チャンネル</span>
                    </button>

                    {activeModal === 'subsc' && (
                        <SidebarSubscModal
                            setActiveModal={setActiveModal}
                        />
                    )}
                </li>
                <li>
                    <Link to="/playlistsPage">
                        <span><FontAwesomeIcon icon={faSquareCaretRight} /></span>
                        <span>プレイリスト</span>
                    </Link>
                </li>
                <li>
                    <Link to="/mypage">
                        <span><FontAwesomeIcon icon={faCircleUser} /></span>
                        <span>マイページ</span>
                    </Link>
                </li>
            </ul>
        </div>
    )
}


export default Sidebar;
