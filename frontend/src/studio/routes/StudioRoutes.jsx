// ----react----
import { Route, Routes, Navigate } from "react-router-dom";


// -----pages-----
import ContentsPage from "../pages/ContentsPage/ContentsPage.jsx";
import VideosPage from "../pages/VideosPage/VideosPage.jsx";
import PlaylistsPage from "../pages/PlaylistsPage/PlaylistsPage.jsx";
import ChannelAnalyticsPage from "../pages/ChannelAnalyticsPage/ChannelAnalyticsPage.jsx";
import OverViewPage from "../pages/OverViewPage/OverViewPage.jsx";


// -----components-----
import Header from "../components/Header/Header.jsx";
import Sidebar from "../components/Sidebar/Sidebar.jsx";
import UploadVideoPage from "../pages/UploadVideoPage/UploadVideoPage.jsx";


// -----css-----
import StudioRoutesStyles from './StudioRoutes.module.css';




function StudioRoutes() {
    return (
        <>
            <Header />

            <Routes>
                {/* /studio にアクセスされたとき → /studio/contents/videos にリダイレクト これで、/studio/contents/videosに自動でリダイレクトされて、最初にContentsPageが開くようになる。*/}
                <Route index element={<Navigate to="contents/videos" replace />} />

                {/* === コンテンツ === */}
                <Route
                    path="contents/*"
                    element={
                        <div className={StudioRoutesStyles.container}>
                            <Sidebar />
                            <div className={StudioRoutesStyles.studioContent}>
                                {/* ContentsPage は常に表示される */}
                                <ContentsPage />
                            </div>
                        </div>
                    }
                >
                    {/* Outlet に表示される部分（子ルート） */}
                    <Route path="videos" element={<VideosPage />} />
                    <Route path="playlists" element={<PlaylistsPage />} />
                </Route>

                {/* === アナリティクス === */}
                <Route
                    path="analytics/*"
                    element={
                        <div className={StudioRoutesStyles.container}>
                            <Sidebar />
                            <div className={StudioRoutesStyles.studioContent}>
                                <ChannelAnalyticsPage />

                            </div>
                        </div>
                    }
                >

                    <Route path="channel/overview" element={<OverViewPage />} />

                </Route>

                <Route
                    path="upload-videos"
                    element={<UploadVideoPage />}
                >

                </Route>

            </Routes>
        </>
    );
}

export default StudioRoutes;






