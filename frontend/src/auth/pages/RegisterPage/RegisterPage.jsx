import { Link } from 'react-router-dom';


// -----component-----
import RegisterForm from '../../components/RegisterForm/RegisterForm'

// -----css-----
import authStyles from '../../styles/common/AuthPage.module.css'




function RegisterPage() {
    return (
        <>
            <div className={authStyles.mainTitle}>
                <h1>WellCome to MyTube</h1>
            </div>
            <div className={authStyles.pageContainer}>
                <div className={authStyles.authCard}>
                <h2 className={authStyles.title}>新規登録</h2>
                <RegisterForm />
                <p className={authStyles.sub}>
                    すでにアカウントをお持ちですか？
                    <span>
                    <Link to="/login">ログインはこちら</Link>
                    </span>
                </p>
                </div>
            </div>
        </>
    )
}

export default RegisterPage
