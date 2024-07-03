"use client"

import Constants from "@/utils/Constants";
import { useCallback, useMemo, useState } from "react";
import { useWorker } from "./useWorker";

export interface TranscriberData {
    isBusy: boolean;
    text: string;
    chunks: { text: string; timestamp: [number, number | null] }[];
}

interface ProgressItem {
    file: string;
    loaded: number;
    progress: number;
    total: number;
    name: string;
    status: string;
}

export interface Transcriber {
    onInputChange: () => void;
    isBusy: boolean;
    isModelLoading: boolean;
    progressItems: ProgressItem[];
    model: string;
    setModel: (model: string) => void;

    start: (audioData: AudioBuffer | undefined) => void;

    output?: TranscriberData;
}

interface TranscriberCompleteData {
    data: {
        text: string;
        chunks: { text: string; timestamp: [number, number | null] }[];
    }
}


export function useTranscriber(): Transcriber {
    const [transcript, setTranscript] = useState<TranscriberData>()
    const [isBusy, setIsBusy] = useState(false)
    const [isModelLoading, setIsModelLoading] = useState(false)
    const [model, setModel] = useState<string>(Constants.DEFAULT_MODEL);
    const [progressItems, setProgressItems] = useState<ProgressItem[]>([]);

    const webWorker = useWorker((event) => {
        const message = event.data;
        switch (message.status) {
            case "progress":
                setProgressItems((prev) => prev.map(item => {
                    if (item.file === message.file) {
                        return { ...item, progress: message.progress }
                    }

                    return item
                }))
                break
            case "complete":
                console.log("complete", message)
                const completeMessage = message as TranscriberCompleteData
                setTranscript({
                    isBusy: false,
                    text: completeMessage.data.text,
                    chunks: completeMessage.data.chunks
                })
                setIsBusy(false)
                break;
            case "ready":
                setIsModelLoading(false);
                break;
            case "initiate":
                setProgressItems((prev) => [...prev, message])
                setIsModelLoading(true);
                break
            case "done":
                // 模型加载完成，移除页面显示
                setProgressItems((prev) =>
                    prev.filter((item) => item.file !== message.file),
                );
                break;
            case "error":
                setIsBusy(false);
                alert(
                    `${message.data.message} This is most likely because you are using Safari on an M1/M2 Mac. Please try again from Chrome, Firefox, or Edge.\n\nIf this is not the case, please file a bug report.`,
                );
                break;
            default:
                break;
        }

    })

    const onInputChange = useCallback(() => {
        setTranscript(undefined)
    }, [])

    const postRequest = useCallback(async (audioData: AudioBuffer | undefined) => {
        if (audioData) {
            setTranscript(undefined);
            setIsBusy(true);

            let audio;
            if (audioData.numberOfChannels === 2) {
                const SCALING_FACTOR = Math.sqrt(2);

                let left = audioData.getChannelData(0);
                let right = audioData.getChannelData(1);

                audio = new Float32Array(left.length);
                for (let i = 0; i < audioData.length; i++) {
                    audio[i] = SCALING_FACTOR * (left[i] + right[i]) / 2;
                }
            } else {
                audio = audioData.getChannelData(0);
            }

            webWorker.postMessage({
                audio,
                model,
            })
        }
    }, [webWorker, model])

    const transcriber = useMemo(() => {
        return {
            onInputChange,
            isBusy,
            isModelLoading,
            progressItems,
            model,
            setModel,
            output: transcript,
            start: postRequest,
        }
    }, [onInputChange, isBusy, isModelLoading, progressItems, model, setModel, transcript, postRequest])

    return transcriber
}
