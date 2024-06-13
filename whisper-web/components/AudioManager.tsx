"use client";
import { Transcriber } from "@/hooks/useTranscriber";
import Constants from "@/utils/Constants";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Progress,
  Select,
  SelectItem,
  useDisclosure,
} from "@nextui-org/react";
import axios from "axios";
import { ReactNode, useCallback, useEffect, useState } from "react";
import AudioPlayer from "./AudioPlayer";
import TranscribeButton from "./TranscribeButton";

export enum AudioSource {
  URL = "URL",
  FILE = "FILE",
  RECORDING = "RECORDING",
}

const AudioManager = (props: { transcriber: Transcriber }) => {
  const [audioDownloadUrl, setAudioDownloadUrl] = useState<string>();
  const [progress, setProgress] = useState<number>();
  const [audioData, setAudioData] = useState<{
    buffer: AudioBuffer;
    url: string;
    source: AudioSource;
    mimeType: string;
  }>();

  const isAudioLoading = progress !== undefined;

  const downloadAudioFromUrl = useCallback(
    async (requestAbortController: AbortController) => {
      if (audioDownloadUrl) {
        try {
          setProgress(0);
          const { data, headers } = (await axios.get(audioDownloadUrl, {
            signal: requestAbortController.signal,
            responseType: "arraybuffer",
            onDownloadProgress: (progressEvent) => {
              setProgress(progressEvent.progress || 0);
            },
          })) as {
            data: ArrayBuffer;
            headers: { "content-type": string };
          };

          let mimeType = headers["content-type"];
          if (!mimeType || mimeType === "audio/wave") {
            mimeType = "audio/wav";
          }
        } catch (error) {
          console.log("Request failed or aborted", error);
        } finally {
          setProgress(undefined);
        }
      }
    },
    [audioDownloadUrl]
  );

  // 当URL改变的时候，下载audio
  useEffect(() => {
    if (audioDownloadUrl) {
      const requestAbortController = new AbortController();
      downloadAudioFromUrl(requestAbortController);
      return () => {
        requestAbortController.abort();
      };
    }
  }, [audioDownloadUrl, downloadAudioFromUrl]);

  return (
    <>
      <div className="flex flex-col justify-center items-center rounded-xl bg-white shadow-xl shadow-black/5 ring-1 ring-slate-700/10">
        <div className="flex flex-row space-x-2 py-2 w-full px-2 divide-x-1">
          <UrlTile
            icon={<AnchorIcon />}
            text={"From URL"}
            onUrlUpdate={(e) => {
              props.transcriber.onInputChange();
              setAudioDownloadUrl(e);
            }}
          />
          <FileTile
            icon={<FolderIcon />}
            text="From File"
            onFileUpdate={(decoded, blobUrl, mimeType) => {
              props.transcriber.onInputChange();
              setAudioData({
                buffer: decoded,
                url: blobUrl,
                source: AudioSource.URL,
                mimeType: mimeType,
              });
            }}
          />
        </div>
        <AudioDataBar progress={isAudioLoading ? progress : +!!audioData} />
      </div>
      {audioData && (
        <>
          <AudioPlayer audioUrl={audioData.url} mimeType={audioData.mimeType} />
          <div>
            <TranscribeButton
              onClick={() => {
                props.transcriber.start(audioData.buffer);
              }}
              isModelLoading={props.transcriber.isModelLoading}
              isTranscribing={props.transcriber.isBusy}
            />
          </div>
        </>
      )}
    </>
  );
};

export default AudioManager;

const AudioDataBar = (props: { progress: number }) => {
  return <Progress value={Math.round(props.progress * 100)} size="sm" />;
};

const UrlTile = (props: {
  icon: ReactNode;
  text: string;
  onUrlUpdate: (url: string) => void;
}) => {
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();

  const onSubmit = (url: string) => {
    props.onUrlUpdate(url);
    onClose();
  };

  return (
    <>
      <Tile icon={props.icon} text={props.text} onClick={onOpen} />
      <UrlModal
        isOpen={isOpen}
        onSubmit={onSubmit}
        onOpenChange={onOpenChange}
      />
    </>
  );
};

const SettingTile = (props: {
  icon: ReactNode;
  className?: string;
  transcriber: Transcriber;
}) => {
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  return (
    <div>
      <Tile icon={props.icon} onClick={onOpen} />
      <SettingModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onSubmit={onClose}
        transcriber={props.transcriber}
      />
    </div>
  );
};

const FileTile = (props: {
  icon: ReactNode;
  text: string;
  onFileUpdate: (
    decoded: AudioBuffer,
    blobUrl: string,
    mimeType: string
  ) => void;
}) => {
  let elem = document.createElement("input");
  elem.type = "file";
  elem.oninput = (event) => {
    let files = (event.target as HTMLInputElement).files;
    if (!files) return;

    const urlObj = URL.createObjectURL(files[0]);
    const mimeType = files[0].type;

    const reader = new FileReader();
    reader.addEventListener("load", async (e) => {
      const arrayBuffer = e.target?.result as ArrayBuffer;
      if (!arrayBuffer) return;

      const audioCtx = new AudioContext({
        sampleRate: Constants.SAMPLING_RATE,
      });

      const decoded = await audioCtx.decodeAudioData(arrayBuffer);
      props.onFileUpdate(decoded, urlObj, mimeType);
    });

    reader.readAsArrayBuffer(files[0]);

    // 重置
    elem.value = "";
  };

  return (
    <>
      <Tile icon={props.icon} text={props.text} onClick={() => elem.click()} />
    </>
  );
};

const SettingModal = (props: {
  isOpen: boolean;
  onSubmit: (url: string) => void;
  onOpenChange: VoidFunction;
  transcriber: Transcriber;
}) => {
  const models = {
    // Original checkpoints
    "Xenova/whisper-tiny": [41, 152],
    "Xenova/whisper-base": [77, 291],
    "Xenova/whisper-small": [249],
    "Xenova/whisper-medium": [776],

    // Distil Whisper (English-only)
    "distil-whisper/distil-medium.en": [402],
    "distil-whisper/distil-large-v2": [767],
  };
  return (
    <Modal isOpen={props.isOpen} onOpenChange={props.onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Settings</ModalHeader>
            <ModalBody>
              <label>Select the model to use.</label>
              <Select>
                {Object.keys(models)
                  // @ts-ignore
                  .filter((key) => models[key].length === 2)
                  .filter((key) => !key.startsWith("distil-whisper/"))
                  .map((key) => (
                    <SelectItem key={key}>{`${key}  (${
                      // @ts-ignore
                      models[key][props.transcriber.quantized ? 0 : 1]
                    }MB)`}</SelectItem>
                  ))}
              </Select>

              <ModalFooter>
                <Button color="danger" variant="light" onClick={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onClick={() => props.onSubmit(url)}>
                  Load
                </Button>
              </ModalFooter>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

const UrlModal = (props: {
  isOpen: boolean;
  onSubmit: (url: string) => void;
  onOpenChange: VoidFunction;
}) => {
  const [url, setUrl] = useState(Constants.DEFAULT_AUDIO_URL);

  return (
    <Modal isOpen={props.isOpen} onOpenChange={props.onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>From URL</ModalHeader>
            <ModalBody>
              {"Enter the URL of the audio file you want to load."}
              <Input value={url} onValueChange={setUrl} type="url" />

              <ModalFooter>
                <Button color="danger" variant="light" onClick={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onClick={() => props.onSubmit(url)}>
                  Load
                </Button>
              </ModalFooter>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

const Tile = (props: {
  icon: ReactNode;
  text?: string;
  onClick?: () => void;
}) => {
  return (
    <button
      onClick={props.onClick}
      className="flex items-center justify-center p-2 text-slate-500 hover:text-indigo-600 transition-all duration-200"
    >
      <div className="w-7 h-7">{props.icon}</div>
      {props.text && (
        <div className="ml-2 break-all text-base w-30">{props.text}</div>
      )}
    </button>
  );
};

function AnchorIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
      />
    </svg>
  );
}

function FolderIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776"
      />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.25"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  );
}

function MicrophoneIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"
      />
    </svg>
  );
}
