// ----react----
import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'

// ----services----
import { login } from '../../../services/auth'

// ----context----
import { AuthContext } from '../../../context/AuthContext'


// -----css-----
import authStyles from '../../styles/common/AuthForm.module.css'






function LoginForm() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const { loginUser } = useContext(AuthContext)
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const data = await login(email, password) //auth.jsxのlogin関数。 response.dataが返ってくる。
            loginUser(data.access, data.refresh)  // AuthContext.jsxのloginUser関数
            navigate('/') // ホームページへ遷移
        } catch (err) {
            setError('ログインに失敗しました')
        }
    }

    return (
        <form className={authStyles.formArea} onSubmit={handleSubmit}>
            <input
                type="email"
                placeholder="メールアドレス"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="パスワード"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">
                ログイン
            </button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
    )
}

export default LoginForm
