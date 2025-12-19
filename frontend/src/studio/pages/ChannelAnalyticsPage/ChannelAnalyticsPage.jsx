// ----react----
import { Link, Outlet, useLocation } from 'react-router-dom';


// ----css----
import ChannelAnalyticsPageStyles from './ChannelAnalyticsPage.module.css';




function ChannelAnalyticsPage() {
    const location = useLocation();

    const links = [
        { path: "/studio/analytics/channel/overview", label: "概要"},
        { path: "/studio/analytics/other", label: "その他" },
    ]

    return (
        <>
            <h1 className={ChannelAnalyticsPageStyles.mainTitle}>チャンネル統計</h1>
            <div className={ChannelAnalyticsPageStyles.tabuMenu}>
                <nav className={ChannelAnalyticsPageStyles.menus}>
                    {links.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`${ChannelAnalyticsPageStyles.menuLink} ${
                                location.pathname === link.path ? ChannelAnalyticsPageStyles.active : ""}`}
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


export default ChannelAnalyticsPage;
