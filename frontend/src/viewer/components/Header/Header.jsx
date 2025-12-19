// ----react----
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";


// ----css----
import styles from "./Header.module.css";




function Header() {
    const [query, setQuery] = useState('');
    const navigate = useNavigate();



    const handleSubmit = (e) => {
        e.preventDefault();
        if (!query.trim()) return;
        navigate(`/results?search_query=${encodeURIComponent(query)}`);

    }




    return (
        <header className={styles.header}>
            <div className={styles.headerLeft}>
                <Link to="/" className={styles.logo}>Youtube</Link>
            </div>

            <div className={styles.headerCenter}>
                <form className={styles.searchForm} onSubmit={handleSubmit}>
                    <input
                        className={styles.searchInput}
                        type="text"
                        value={query}
                        placeholder="検索"
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <button type="submit">検索</button>
                </form>
            </div>

            <div className={styles.headerRight}>
                <Link to="/studio" className={styles.uploadButton}>動画投稿</Link>
                <Link to="/logout" className={styles.logoutButton}>ログアウト</Link>
            </div>
        </header>
    );
}

export default Header;
