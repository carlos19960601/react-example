import { Dispatch, SetStateAction, memo, useEffect, useRef } from "react";
import WFPlayer from "wfplayer";
import { RenderProps } from "./footer";

interface WaveformProps {
  currentTime: number;
  player: HTMLVideoElement | null;
  setWaveform: Dispatch<SetStateAction<WFPlayer | undefined>>;
  setRender: Dispatch<SetStateAction<RenderProps>>;
}

const Waveform = memo(
  ({ setWaveform, setRender, player }: WaveformProps) => {
    const $waveform = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if ($waveform.current == null) return;

      [...WFPlayer.instances].forEach((item) => item.destroy());

      const waveform = new WFPlayer({
        scrollable: true,
        useWorker: false,
        duration: 10,
        padding: 1,
        wave: true,
        grid: true,
        pixelRatio: 2,
        container: $waveform.current!,
        mediaElement: player!,
        backgroundColor: "rgba(0, 0, 0, 0)",
        waveColor: "rgba(255, 255, 255, 0.2)",
        progressColor: "rgba(255, 255, 255, 0.5)",
        gridColor: "rgba(255, 255, 255, 0.05)",
        rulerColor: "rgba(255, 255, 255, 0.5)",
        paddingColor: "rgba(0, 0, 0, 0)",
      });

      setWaveform(waveform);
      waveform.on("update", setRender);
      waveform.load("/sample.mp3");
    }, [$waveform, setWaveform, setRender, player]);

    return (
      <div
        className="absolute left-0 top-0 right-0 bottom-0 w-full h-full select-none pointer-events-none"
        ref={$waveform}
      />
    );
  },
  () => true
);

Waveform.displayName = "Waveform";

export default Waveform;
