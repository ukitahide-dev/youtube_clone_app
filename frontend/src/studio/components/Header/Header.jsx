import { useState } from 'react';
import { Link } from 'react-router-dom';


// ----components----
import CreateModalMenu from '../CreateModalMenu/CreateModalMenu';


// -----css-----
import HeaderStyles from './Header.module.css';


// -----fontAwsome-----
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVideo } from '@fortawesome/free-solid-svg-icons';





function Header() {
    const [activeModal, setActiveModal] = useState(null);


    return (
        <>
            <header>
                <div className={HeaderStyles.left}>
                    <Link>
                        <FontAwesomeIcon icon={faVideo} />
                        <p>Studio</p>
                    </Link>
                </div>
                <div className={HeaderStyles.right}>
                    <p onClick={() => setActiveModal('create')}>作成</p>
                    <p>アイコン</p>
                </div>

            </header>

            {activeModal === 'create' && (
                <CreateModalMenu
                    setActiveModal={setActiveModal}
                />
            )}

        </>

    )

}



export default Header;







