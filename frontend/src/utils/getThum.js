import { useUpload } from "../config"


export const getThum = (video) => {
    return useUpload ? video.thum : video.thumbnail_url
}


export const getPlaylistThum = (video_details) => {
    return useUpload ? video_details.thum : video_details.thumbnail_url
}
