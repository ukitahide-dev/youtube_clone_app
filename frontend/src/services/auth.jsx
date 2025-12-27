import axios from "axios";
import { USERS_API, AUTH_API } from "./api.jsx";





// 新規登録
export async function register(email, username, password) {
    const response = await axios.post(`${USERS_API}/create/`, {
        email,
        username,
        password,
    });

    console.log(`response.data: ${response.data}`);
    return response.data;
}




// ログイン
export async function login(email, password) {  // LoginForm.jsxから実行されて、email,passwordがわたってくる。

    const response = await axios.post(`${AUTH_API}/jwt/create/`, {  // axios.post(url, data) で HTTP POST リクエスト を送っています。
        email,
        password,
    });
    return response.data;  // 呼び出し元であるLoginForm.jsxに返す
}






// ログアウト
export async function logout(refreshToken) {
    try {
        await axios.post(`${USERS_API}/logout/`, {
            refresh: refreshToken,   // ← Refresh Token をサーバーに送ってる。
        });
        console.log('ログアウト成功、サーバー側でもトークン無効化');
    } catch(err) {
        console.error("ログアウト失敗", err.response?.data || err);
    }
}
