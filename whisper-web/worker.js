import { env, pipeline } from "@xenova/transformers";

env.allowLocalModals = false;

class PipelineFactory {
    static task = null;
    static model = null;
    static quantized = null;
    static instance = null;


    constructor(tokenizer, model, quantized) {
        this.tokenizer = tokenizer;
        this.model = model;
        this.quantized = quantized;
    }

    static async getInstance() {
        if (this.instance === null) {
            this.instance = pipeline(this.task, this.model, {})
        }

        return this.instance
    }
}

class AutomaticSpeechRecognitionPipelineFactory extends PipelineFactory {
    static task = "automatic-speech-recognition";
    static model = null;
    static quantized = null;
}

self.addEventListener("message",async (event) => {
    const message = event.data;

    let transcript = await transcribe(message.audio, message.model);
    if (transcript === null) return;

    self.postMessage({
        status: "complete",
        task: "automatic-speech-recognition",
        data: transcript,
    })
})


const transcribe = async (audio, model) => {
    let modelName = model;

    const p = AutomaticSpeechRecognitionPipelineFactory;
    if (p,model !== modelName) {
        p.model = modelName;
        
        if (p.instance !== null) {
            (await p.getInstance()).dispose();
            p.instance = null
        }
    }

    let transcriber = await p.getInstance();

    let output = await transcriber(audio, {}).catch((error)=>{
        self.postMessage({
            status: "error",
            task: "automatic-speech-recognition",
            data: error
        })

        return null;
    })

    return output
}