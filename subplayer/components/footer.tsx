import Sub from "@/libs/sub";
import {
  Dispatch,
  MouseEvent,
  SetStateAction,
  useCallback,
  useState,
} from "react";
// @ts-ignore
import DT from "duration-time-conversion";
import WFPlayer from "wfplayer";
import Grab from "./grab";
import Metronome from "./metronome";
import Timeline from "./timeline";
import Waveform from "./wavefrom";

interface Props {
  player: HTMLVideoElement | null;
  currentTime: number;
  setWaveform: Dispatch<SetStateAction<WFPlayer | undefined>>;
  waveform: WFPlayer | undefined;
  playing: boolean;
  addSub: (index: number, sub: Sub) => void;
  newSub: (item: { start: number; end: number; text: string }) => Sub;
  subtitles: Sub[];
}

export interface RenderProps {
  padding: number;
  duration: number;
  gridGap: number;
  gridNum: number;
  beginTime: number;
}

const Footer = (props: Props) => {
  const [render, setRender] = useState({
    padding: 2,
    duration: 10,
    gridGap: 10,
    gridNum: 110,
    beginTime: -5,
  });

  return (
    <div className="relative flex flex-col h-48">
      {props.player && (
        <>
          <Waveform {...props} setRender={setRender} />
          <Grab {...props} />
          {/* 滑动时显示的方块 */}
          <Metronome {...props} render={render} />
          <Timeline {...props} render={render} />
        </>
      )}
    </div>
  );
};

interface DurationProps {
  currentTime: number;
  player: HTMLVideoElement;
}

const Duration = (props: DurationProps) => {
  const getDuration = useCallback((time: number) => {
    time = time == Infinity ? 0 : time;
    return DT.d2t(time).split(".")[0];
  }, []);

  return (
    <div className="absolute top-[-40px] left-0 right-0 z-10 w-full text-[18px] text-center select-none pointer-events-none ">
      <span>
        {getDuration(props.currentTime)}/
        {getDuration(props.player.duration || 0)}
      </span>
    </div>
  );
};

interface ProgressProps {
  currentTime: number;
  player: HTMLVideoElement;
  waveform: WFPlayer | undefined;
}

const Progress = (props: ProgressProps) => {
  const onProgressClick = useCallback(
    (e: MouseEvent) => {
      if (e.button !== 0) return; // 鼠标左键
      const currentTime =
        (e.pageX / document.body.clientWidth) * props.player.duration;
      props.player.currentTime = currentTime;
      props.waveform?.seek(currentTime);
    },
    [props]
  );

  return (
    <div
      className="absolute left-0 right-0 w-full h-3"
      onClick={onProgressClick}
    >
      <div className="absolute left-0 right-0 bottom-0"></div>
    </div>
  );
};

export default Footer;
