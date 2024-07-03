import { useEffect, useRef } from "react";

const AudioPlayer = (props: { audioUrl: string; mimeType: string }) => {
  const audioPlayer = useRef<HTMLAudioElement>(null);
  const audioSource = useRef<HTMLSourceElement>(null);

  useEffect(() => {
    console.log(props.audioUrl);
    if (audioPlayer.current && audioSource.current) {
      audioSource.current.src = props.audioUrl;
      audioPlayer.current.load();
    }
  }, [props.audioUrl]);

  return (
    <div className="flex relative z-10 p-4 w-full">
      <audio
        ref={audioPlayer}
        controls
        className="w-full h-14 rounded-lg bg-white shadow-xl shadow-black/5 ring-1 ring-slate-700/10"
      >
        <source ref={audioSource} type={props.mimeType}></source>
      </audio>
    </div>
  );
};

export default AudioPlayer;
