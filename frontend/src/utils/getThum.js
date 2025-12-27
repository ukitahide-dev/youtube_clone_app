import { useUpload } from "../config"


export const getThum = (video) => {
  return useUpload ? video.thum : video.thumbnail_url
}
