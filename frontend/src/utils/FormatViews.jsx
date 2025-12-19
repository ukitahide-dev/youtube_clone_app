



// 再生回数を「1.2万回」などに整形する関数

export function formatViews(views) {
    if (views < 1000) {
        return `${views}回視聴`;
    } else if (views < 10000) {
        // 例: 7200 → "7.2千回"
        return `${(views / 1000).toFixed(1)}千回視聴`;
    } else if (views < 100000000) {
        // 例: 25400 → "2.5万回"
        return `${(views / 10000).toFixed(1)}万回視聴`;
    } else {
        // 1億以上
        return `${(views / 100000000).toFixed(1)}億回視聴`;
    }
}
