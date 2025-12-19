// ----react----
import { useRef } from 'react';


// ----css----
import ContentSectionStyles from './ContentSection.module.css';


// ----fontAwsome----
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleRight, faCircleLeft } from "@fortawesome/free-regular-svg-icons";



// 親: PlaylistPart.jsx、LikeVideoPart.jsx
// 役割: マイページに、プレイリストや、いいねした動画をカルーセル風に表示する




function ContentSection({title, items, onViewAll, renderItem}) {
    const scrollRef = useRef(null);


    const scroll = (direction) => {
        const { current } = scrollRef;
        if (!current) return;

        // カード1枚の幅を取得
        const card = current.querySelector(`.${ContentSectionStyles.card}`);
        if (!card) return;

        const cardWidth = card.offsetWidth + 16; // margin分を少し加える
        const scrollAmount = cardWidth * 4;    // 4枚分の幅をスクロール

        current.scrollBy({
            left: direction === "left" ? -scrollAmount : scrollAmount,
            behavior: "smooth",
        });
    };




    return (
        <div className={ContentSectionStyles.container}>
            <div className={ContentSectionStyles.top}>
                <div className={ContentSectionStyles.left}>
                    <h2>{title}</h2>
                </div>

                <div className={ContentSectionStyles.right}>
                    <button className={ContentSectionStyles.allView} onClick={onViewAll}>すべて表示</button>
                    <button className={ContentSectionStyles.navLeft} onClick={() => scroll("left")}>
                        <FontAwesomeIcon icon={faCircleLeft} size="2x" />
                    </button>
                    <button className={ContentSectionStyles.navRight} onClick={() => scroll("right")}>
                        <FontAwesomeIcon icon={faCircleRight} size="2x" />
                    </button>
                </div>
            </div>

            <div className={ContentSectionStyles.carouselWrapper}>
                <div className={ContentSectionStyles.carousel} ref={scrollRef}>
                    {items.map((item) => (
                        <div key={item.id} className={ContentSectionStyles.card}>
                            {renderItem(item)}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

}


export default ContentSection;
