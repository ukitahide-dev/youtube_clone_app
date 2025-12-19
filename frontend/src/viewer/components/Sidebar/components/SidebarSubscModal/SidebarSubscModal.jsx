import { Link } from "react-router-dom";


// ----css----
import SidebarSubscModalStyles from './SidebarSubscModal.module.css';


// ----fontAwsome----
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClapperboard } from '@fortawesome/free-solid-svg-icons'
import { faUsersRectangle } from '@fortawesome/free-solid-svg-icons'



// 親: SideBar.jsx
// 役割: サイドバー登録チャンネルのモーダルメニュー表示



function SidebarSubscModal({ setActiveModal, }) {


    return (
        <div className={SidebarSubscModalStyles.modal}>
            <ul className={SidebarSubscModalStyles.menus}>
                <li>
                    <Link to="/subscribed-videos" onClick={() => setActiveModal(null)}>
                        <span><FontAwesomeIcon icon={faClapperboard} /></span>
                        <span>動画</span>
                    </Link>
                </li>
                <li>
                    <Link to="/subscribed-channels" onClick={() => setActiveModal(null)}>
                        <span><FontAwesomeIcon icon={faUsersRectangle} /></span>
                        <span>チャンネル</span>
                    </Link>
                </li>

            </ul>

        </div>
    )

}

export default SidebarSubscModal;
