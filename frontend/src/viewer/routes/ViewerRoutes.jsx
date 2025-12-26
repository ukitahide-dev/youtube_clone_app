// ----react----
import { Routes, Route, Navigate } from 'react-router-dom'
import { useContext } from 'react'


// ----context
import { AuthContext } from '../../context/AuthContext'


// -----components-----
import Header from '../components/Header/Header.jsx'


// -----pages-----
import HomePage from '../pages/HomePage/HomePage.jsx'
import RegisterPage from '../../auth/pages/RegisterPage/RegisterPage.jsx'
import LoginPage from '../../auth/pages/LoginPage/LoginPage.jsx'
import LogoutPage from '../../auth/pages/LogoutPage.jsx'
import VideoDetailPage from '../pages/VideoDetailPage/VideoDetailPage.jsx'
import SubscribedVideosPage from '../pages/SubscribedVideosPage/SubscribedVideosPage.jsx'
import UserPlaylistPage from '../pages/UserPlaylistPage/UserPlaylistPage.jsx'
import MyPage from "../pages/MyPage/MyPage.jsx";
import SubscribedChannelsPage from '../pages/SubscribedChannelsPage/SubscribedChannelsPage.jsx'
import ChannelDetailPage from '../pages/ChannelDetailPage/ChannelDetailPage.jsx'
import PlaylistDetailPage from '../pages/PlaylistDetailPage/PlaylistDetailPage.jsx'
import SearchResultsPage from '../pages/SearchResultsPage/SearchResultsPage.jsx'
import LikeVideosPage from '../pages/LikeVideosPage/LikeVideosPage.jsx'






function RequireAuth({ children }) {
    const { accessToken } = useContext(AuthContext);
    if (!accessToken) {
        return <Navigate to="/login" replace />
    }
    return children
}



function ViewerRoutes() {
    return (
        <Routes>
            {/* 認証不要 */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* 認証必要 */}
            <Route
                path="/"
                element={
                    <RequireAuth>
                        <Header />
                        <HomePage />
                    </RequireAuth>
                }
            />
            <Route
                path="/results"
                element={
                    <RequireAuth>
                        <Header />
                        <SearchResultsPage />
                    </RequireAuth>
                }
            />
            <Route
                path="/logout"
                element={
                    <RequireAuth>
                        <LogoutPage />
                    </RequireAuth>
                }
            />
            <Route
                path="/videos/:id"
                element={
                    <RequireAuth>
                        <Header />
                        <VideoDetailPage />
                    </RequireAuth>
                }
            />
            {/* チャンネル登録した動画を表示 */}
            <Route
                path="/subscribed-videos"
                element={
                    <RequireAuth>
                        <Header />
                        <SubscribedVideosPage />
                    </RequireAuth>
                }
            />
            {/* 登録したチャンネル一覧を表示 */}
            <Route
                path="/subscribed-channels"
                element={
                    <RequireAuth>
                        <Header />
                        <SubscribedChannelsPage />
                    </RequireAuth>
                }
            />
            <Route
                path="/channel/:id"
                element={
                    <RequireAuth>
                        <Header />
                        <ChannelDetailPage />
                    </RequireAuth>
                }
            />
            <Route
                path="/playlistsPage"
                element={
                    <RequireAuth>
                        <Header />
                        <UserPlaylistPage />
                    </RequireAuth>
                }
            />
            <Route
                path="/playlists/:type/:playlistId"
                element={
                    <RequireAuth>
                        <Header />
                        <PlaylistDetailPage />
                    </RequireAuth>
                }
            />
            <Route
                path="/likeVideosPage"
                element={
                    <RequireAuth>
                        <Header />
                        <LikeVideosPage />
                    </RequireAuth>
                }
            />
            <Route
                path="/mypage"
                element={
                    <RequireAuth>
                        <Header />
                        <MyPage />
                    </RequireAuth>
                }
            />
        </Routes>
    )
}




export default ViewerRoutes;
