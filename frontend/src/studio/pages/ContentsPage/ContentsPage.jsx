
// ----react----
import { Link, Outlet, useLocation } from 'react-router-dom';


// -----css-----
import ContentsPageStyles from './ContentsPage.module.css';




// 親: StudioRoutes.jsx
// 役割:



function ContentsPage() {
    const location = useLocation();

    const links = [
        { path: "/studio/contents/videos", label: "動画"},
        { path: "/studio/contents/playlists", label: "プレイリスト"}
    ];


    return (
        <>
            <h1 className={ContentsPageStyles.mainTitle}>チャンネルのコンテンツ</h1>
            <div className={ContentsPageStyles.tabMenu}>
                <nav className={ContentsPageStyles.menus}>
                    {links.map(link => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={link.path === location.pathname ? ContentsPageStyles.active : ""}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

            </div>

            <Outlet />
        </>

    )

}

export default ContentsPage;
