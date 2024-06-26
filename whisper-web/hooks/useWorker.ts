import { useState } from "react";

export interface MessageEventHandler {
    (event: MessageEvent): void;
}

export const useWorker = (messageEventHandler: MessageEventHandler): Worker => {
    const [worker] = useState(() => createWorker(messageEventHandler))
    return worker
}

const createWorker = (messageEventHandler: MessageEventHandler): Worker => {
    const worker = new Worker(new URL("../worker.js", import.meta.url), { type: "module" })
    worker.addEventListener("message", messageEventHandler)
    return worker
}

