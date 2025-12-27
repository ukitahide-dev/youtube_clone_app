// ----react----
import { createContext, useState, useEffect } from "react";


// ----services----
import { USERS_API } from "../services/api";
import { logout } from "../services/auth";


import axios from "axios";





export const AuthContext = createContext();   // createContext() を呼ぶと Context オブジェクト が作られる。




export function AuthProvider({ children }) {
    const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken") || null);
    const [refreshToken, setRefreshToken] = useState(localStorage.getItem("refreshToken") || null);
    const [user, setUser] = useState(null);



    // ログイン中のユーザー情報をサーバーから取得する関数
    const fetchUser = async (token) => {
        try {
            const response = await axios.get(`${USERS_API}/me/`, {
                headers: {Authorization: `Bearer ${token}`},
            });
            setUser(response.data);

        }catch (err) {
            console.error('ユーザー情報を取得できませんでした', err);
        }
    };



    const loginUser = (access, refresh) => {
        setAccessToken(access);
        setRefreshToken(refresh);
        localStorage.setItem("accessToken", access);
        localStorage.setItem("refreshToken", refresh);

        fetchUser(access);   // ログイン直後にユーザー情報を取得
    };



    const logoutUser = async () => {
        try {
            if (refreshToken) {
                await logout(refreshToken);   // services/auth.jsxのlogout関数
            }
        } catch(err) {
            console.error("サーバーログアウト失敗", err);
        } finally {
            setAccessToken(null);
            setRefreshToken(null);
            setUser(null);
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
        }
    }



    useEffect(() => {
        if (accessToken && !user) {
            fetchUser(accessToken);
        }
    }, [accessToken]);





    return (
        <AuthContext.Provider   // Provider は「Context の値をアプリに配る人」の役割。value に渡したものが、Context にアクセスする 子コンポーネント全てから見える状態や関数になる。
            value={{ accessToken, refreshToken, loginUser, logoutUser, user }}  // Provider 内の value に状態や関数を渡すと、子コンポーネント全てが useContext(AuthContext) でアクセス可能。
        >
            {children}
        </AuthContext.Provider>  // {children} はこの Provider に包まれた 子コンポーネント のこと。
    );



}



