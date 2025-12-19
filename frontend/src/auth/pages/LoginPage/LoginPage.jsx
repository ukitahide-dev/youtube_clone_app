// ----react----
import { Link } from 'react-router-dom'

// -----components-----
import LoginForm from '../../components/LoginForm/LoginForm';

// -----css-----
import authStyles from '../../styles/common/AuthPage.module.css'






function LoginPage() {
    return (
        <>
            <div className={authStyles.mainTitle}>
                <h1>WellCome to MyTube</h1>
            </div>
            <div className={authStyles.pageContainer}>
                <div className={authStyles.authCard}>
                    <h2 className={authStyles.title}>ログインフォーム</h2>
                    <LoginForm />
                    <p className={authStyles.sub}>
                        アカウントがまだありませんか？
                        <span>
                            <Link to="/register">新規登録はこちら</Link>
                        </span>
                    </p>
                </div>
            </div>
        </>
    )
}

export default LoginPage
