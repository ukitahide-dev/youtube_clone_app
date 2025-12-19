import styles from './VideoSidebar.module.css';





function VideoSidebar({ videos, onSelectVideo }) {
    return (
        <div className={styles.sidebar}>
            <h4>このプレイリスト</h4>
            <ul className={styles.videoList}>
                {videos.map((video) => (
                <li
                    key={video.id}
                    className={styles.videoItem}
                    onClick={() => onSelectVideo(video)}
                >
                    <img
                    src={video.thumbnail}
                    alt={video.title}
                    className={styles.thumbnail}
                    />
                    <span className={styles.title}>{video.title}</span>
                </li>
                ))}
            </ul>
        </div>
    );
}

export default VideoSidebar;
