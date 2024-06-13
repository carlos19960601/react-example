function mobileTabletCheck() {
    let check = false;

    return check
}


const isMobileOrTablet = mobileTabletCheck();

export default {
    SAMPLING_RATE: 16000,
    DEFAULT_AUDIO_URL: `https://huggingface.co/datasets/Xenova/transformers.js-docs/resolve/main/${isMobileOrTablet ? "jfk" : "ted_60_16k"
        }.wav`,
    DEFAULT_MODEL: "Xenova/whisper-tiny",
}