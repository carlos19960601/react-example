import { useRef } from "react";

const AudioPlayer = (props: { audioUrl: string; mimeType: string }) => {
  const audioPlayer = useRef<HTMLAudioElement>(null);
  const audioSource = useRef<HTMLSourceElement>(null);

  return (
    <div className="flex relative z-10 p-4 w-full">
      <audio ref={audioPlayer} controls className="w-full">
        <source ref={audioSource} type={props.mimeType}></source>
      </audio>
    </div>
  );
};

export default AudioPlayer;
