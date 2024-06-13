"use client"

import Constants from "@/utils/Constants";
import { useCallback, useMemo, useState } from "react";
import { useWorker } from "./useWorker";

export interface TranscriberData {
    isBusy: boolean;
    text: string;
    chunks: { text: string; timestamps: [number, number | null] }[];
}

export interface Transcriber {
    onInputChange: () => void;
    isBusy: boolean;
    isModelLoading: boolean;
    model: string;
    setModel: (model: string) => void;

    start: (audioData: AudioBuffer | undefined) => void;

    output?: TranscriberData;
}

interface TranscriberCompleteData {
    data: {
        text: string;
        chunks: { text: string; timestamps: [number, number | null] }[];
    }
}



export function useTranscriber(): Transcriber {
    const [transcript, setTranscript] = useState<TranscriberData>()
    const [isBusy, setIsBusy] = useState(false)
    const [isModelLoading, setIsModelLoading] = useState(false)
    const [model, setModel] = useState<string>(Constants.DEFAULT_MODEL);

    const webWorker = useWorker((event) => {
        const message = event.data;
        switch (message.status) {
            case "complete":
                const completeMessage = message as TranscriberCompleteData
                setTranscript({
                    isBusy: false,
                    text: completeMessage.data.text,
                    chunks: completeMessage.data.chunks
                })
                setIsBusy(false)
                break;
            case "error":
                setIsBusy(false);
                alert(
                    `${message.data.message} This is most likely because you are using Safari on an M1/M2 Mac. Please try again from Chrome, Firefox, or Edge.\n\nIf this is not the case, please file a bug report.`,
                );
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
            model,
            setModel,
            output: transcript,
            start: postRequest,
        }
    }, [onInputChange, isBusy, isModelLoading, model, setModel, transcript, postRequest])

    return transcriber
}
