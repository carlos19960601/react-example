export function isPlaying($video: HTMLVideoElement) {
    return $video.currentTime > 0 && !$video.paused && !$video.ended && $video.readyState > 2;
}