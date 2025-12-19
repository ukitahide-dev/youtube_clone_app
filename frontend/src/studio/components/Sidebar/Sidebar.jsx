import { Link } from 'react-router-dom';
import { useContext } from 'react';


// ----services-----
import { BASE_URL } from '../../../services/api';

// ----context----
import { AuthContext } from '../../../context/AuthContext';



// -----css-----
import SidebarStyles from './Sidebar.module.css';


// -----fontAwsome-----
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileLines } from '@fortawesome/free-regular-svg-icons';
import { faChartColumn } from '@fortawesome/free-solid-svg-icons';
import { faTachometerAlt } from '@fortawesome/free-solid-svg-icons';



// 親: StudioRoutes.jsx
// 役割: studioのサイドバーメニュー



function Sidebar() {
    const { user } = useContext(AuthContext);

    if (!user) return <p>読み込み中...</p>;


    return (
        <div className={SidebarStyles.sideArea}>
            <div className={SidebarStyles.profile}>
                <div>
                    <img src={`${BASE_URL}/${user?.profile_icon}`} alt="プロフィールアイコン" />
                </div>
                <div className={SidebarStyles.text}>
                    <p>チャンネル</p>
                    <p className={SidebarStyles.userName}>たか</p>
                </div>
            </div>

            <ul className={SidebarStyles.menus}>
                <li>
                    <Link to="/studio/upload-videos">
                        <span><FontAwesomeIcon icon={faTachometerAlt} size="lg" /></span>
                        <span>動画投稿</span>
                    </Link>
                </li>
                <li>
                    <Link to="/studio/dashboard">
                        <span><FontAwesomeIcon icon={faTachometerAlt} size="lg" /></span>
                        <span>ダッシュボード</span>
                    </Link>
                </li>
                <li>
                    <Link to="/studio/contents/videos">
                        <span><FontAwesomeIcon icon={faFileLines} /></span>
                        <span>コンテンツ</span>
                    </Link>
                </li>
                <li>
                    <Link to="/studio/analytics/channel/overview">
                        <span><FontAwesomeIcon icon={faChartColumn} size="lg" /></span>
                        <span>アナリティクス</span>
                    </Link>
                </li>

            </ul>


        </div>
    )

}


export default Sidebar;
