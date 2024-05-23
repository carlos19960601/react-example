import Sub from "@/libs/sub";
import { isPlaying } from "@/utils";
import {
  Dispatch,
  SetStateAction,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import TextareaAutosize from "react-textarea-autosize";

interface VideoProps {
  currentIndex: number;
  subtitles: Sub[];
  setPlayer: Dispatch<SetStateAction<HTMLVideoElement | null>>;
  setCurrentTime: Dispatch<SetStateAction<number>>;
  setPlaying: Dispatch<SetStateAction<boolean>>;
}

const VideoWrap = memo(
  ({
    setPlayer,
    setCurrentTime,
    setPlaying,
    subtitles,
    currentIndex,
  }: VideoProps) => {
    const $video = useRef<HTMLVideoElement>(null);

    useEffect(() => {
      setPlayer($video.current);
      const updateState = () => {
        if ($video) {
          setPlaying(isPlaying($video.current!));
          setCurrentTime($video.current!.currentTime);
        }

        window.requestAnimationFrame(updateState);
      };
      updateState();
    }, [setPlayer, setCurrentTime, setPlaying, $video]);

    const onClick = useCallback(() => {
      if ($video.current) {
        if (isPlaying($video.current)) {
          $video.current.pause();
        } else {
          $video.current.play();
        }
      }
    }, [$video]);

    return <video src="/sample.mp4?t=1" ref={$video} onClick={onClick} />;
  }
);

VideoWrap.displayName = "VideoWrap";

interface Props {
  currentIndex: number;
  subtitles: Sub[];
  player: HTMLVideoElement | null;
  setPlayer: Dispatch<SetStateAction<HTMLVideoElement | null>>;
  setCurrentTime: Dispatch<SetStateAction<number>>;
  setPlaying: Dispatch<SetStateAction<boolean>>;
}

const Player = (props: Props) => {
  const $player = useRef(null);
  const [currentSub, setCurrentSub] = useState<Sub>();

  useMemo(() => {
    setCurrentSub(props.subtitles[props.currentIndex]);
  }, [props.subtitles, props.currentIndex]);

  return (
    <div className="flex flex-1 items-center justify-center w-full h-full px-[20%] py-[10%]">
      <div
        ref={$player}
        className="relative h-auto w-auto items-center flex justify-center"
      >
        <VideoWrap {...props} />
        {props.player && currentSub ? (
          <div className="flex flex-col justify-center items-center absolute left-0 right-0 bottom-[5%] w-full py-4 select-none pointer-events-none">
            <TextareaAutosize
              value={currentSub.text}
              className="w-full outline-none resize-none text-white border-none select-all bg-black/0"
            />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Player;
