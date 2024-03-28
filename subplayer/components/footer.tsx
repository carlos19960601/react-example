import clsx from "clsx";
import {
  Dispatch,
  MouseEvent,
  SetStateAction,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
// @ts-ignore
import DT from "duration-time-conversion";
import WFPlayer from "wfplayer";
import clamp from "lodash/clamp";
import Metronome from "./metronome";
import Sub from "@/libs/sub";
import Timeline from "./timeline";

interface Props {
  className?: string;
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

const Footer = ({ className, player, ...restProps }: Props) => {
  const [render, setRender] = useState({
    padding: 2,
    duration: 10,
    gridGap: 10,
    gridNum: 110,
    beginTime: -5,
  });

  return (
    <div className={clsx("relative flex flex-col", className)}>
      {player && (
        <>
          <Progress {...restProps} player={player} />
          <Duration {...restProps} player={player} />
          <Waveform {...restProps} player={player} setRender={setRender} />
          <Grab {...restProps} player={player} />
          <Metronome {...restProps} player={player} render={render} />
          <Timeline {...restProps} render={render} player={player} />
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

interface WaveformProps {
  currentTime: number;
  player: HTMLVideoElement;
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
        pixelRatio: 2,
        container: $waveform.current!,
        mediaElement: player,
        backgroundColor: "rgba(0, 0, 0, 0)",
        waveColor: "rgba(255, 255, 255, 0.2)",
        progressColor: "rgba(255, 255, 255, 0.5)",
        gridColor: "rgba(255, 255, 255, 0.05)",
        rulerColor: "rgba(255, 255, 255, 0.5)",
        paddingColor: "rgba(0, 0, 0, 0)",
      });

      setWaveform(waveform);
      // waveform.on("update", setRender);
      waveform.load("/sample.mp3");
    }, [$waveform, setWaveform, setRender]);

    return (
      <div
        className="absolute top-0 right-0 bottom-0 w-full h-full select-none pointer-events-none"
        ref={$waveform}
      />
    );
  },
  () => true
);

interface GrabProps {
  currentTime: number;
  player: HTMLVideoElement;
  waveform: WFPlayer | undefined;
}

const Grab = (props: GrabProps) => {
  const [grabStartX, setGrabStartX] = useState(0);
  const [grabStartTime, setGrabStartTime] = useState(0);
  const [grabbing, setGrabbing] = useState(false);

  const onGrabDown = useCallback(
    (e: MouseEvent) => {
      if (e.button !== 0) return;

      setGrabStartX(e.pageX);
      setGrabStartTime(props.player.currentTime);
      setGrabbing(true);
    },
    [props.player]
  );

  const onGrabMove = useCallback(
    (e: MouseEvent) => {
      if (grabbing && props.player && props.waveform) {
        const currentTime = clamp(
          grabStartTime -
            ((e.pageX - grabStartX) / document.body.clientWidth) * 10,
          0,
          props.player.duration
        );
        props.player.currentTime = currentTime;
        props.waveform.seek(currentTime);
      }
    },
    [grabbing, props.player, props.waveform, grabStartX, grabStartTime]
  );

  const onGrabUp = () => {
    setGrabStartX(0);
    setGrabStartTime(0);
    setGrabbing(false);
  };

  useEffect(() => {
    document.addEventListener("mouseup", onGrabUp);

    return () => document.removeEventListener("mouseup", onGrabUp);
  }, []);

  return (
    <div
      className={clsx(
        "absolute top-0 left-0 right-0 z-20 cursor-grab h-1/5 select-none bg-sky-300/20 border-t-[1px] border-b-[1px] border-solid border-t-sky-300 border-b-sky-300",
        grabbing && "cursor-grabbing"
      )}
      onMouseDown={onGrabDown}
      onMouseMove={onGrabMove}
    ></div>
  );
};

export default Footer;
