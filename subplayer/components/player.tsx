import { isPlaying } from "@/utils";
import {
  Dispatch,
  SetStateAction,
  memo,
  useCallback,
  useEffect,
  useRef,
} from "react";

interface VideoProps {
  setPlayer: Dispatch<SetStateAction<HTMLVideoElement | null>>;
  setCurrentTime: Dispatch<SetStateAction<number>>;
  setPlaying: Dispatch<SetStateAction<boolean>>;
}

const VideoWrap = memo(
  ({ setPlayer, setCurrentTime, setPlaying }: VideoProps) => {
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

interface Props {
  setPlayer: Dispatch<SetStateAction<HTMLVideoElement | null>>;
  setCurrentTime: Dispatch<SetStateAction<number>>;
  setPlaying: Dispatch<SetStateAction<boolean>>;
}

const Player = (props: Props) => {
  const $player = useRef(null);

  return (
    <div className="flex flex-1 items-center justify-center">
      <div ref={$player}>
        <VideoWrap {...props} />
      </div>
    </div>
  );
};

export default Player;
