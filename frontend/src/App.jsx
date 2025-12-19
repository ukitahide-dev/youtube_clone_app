// このファイルはアプリ全体の中心（親）コンポーネント

// ----react----
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


// ----context----
import { AuthProvider } from './context/AuthContext';


// ----routes----
import ViewerRoutes from './viewer/routes/ViewerRoutes.jsx';
import StudioRoutes from './studio/routes/StudioRoutes.jsx';





function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* 視聴者向け */}
                    <Route path="/*" element={<ViewerRoutes />} />

                    {/* 投稿者向け（例: /studio/...） */}
                    <Route path="/studio/*" element={<StudioRoutes />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
