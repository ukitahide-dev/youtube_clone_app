// ----react----
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// ----services----
import { register } from '../../../services/auth'

// ---css----
import authStyles from '../../styles/common/AuthForm.module.css'






function RegisterForm() {
    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            await register(email, username, password) // auth.jsxのregister関数

            alert('登録成功！ログインしてください')
            navigate('/login')
        } catch (err) {
            setError('登録に失敗しました')
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
                type="text"
                placeholder="ユーザー名"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="password"
                placeholder="パスワード"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">新規登録</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
    )
}

export default RegisterForm
