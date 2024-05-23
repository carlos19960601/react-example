import clsx from "clsx";
import { clamp } from "lodash";
import { MouseEvent, useCallback, useState } from "react";

interface GrabProps {
  currentTime: number;
  player: HTMLVideoElement | null;
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
      setGrabStartTime(props.player!.currentTime);
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

  // useEffect(() => {
  //   document.addEventListener("mouseup", onGrabUp);

  //   return () => document.removeEventListener("mouseup", onGrabUp);
  // }, []);

  return (
    <div
      className={clsx(
        "absolute top-0 left-0 right-0 z-20 cursor-grab h-1/5 select-none bg-sky-300/20 border-t-[1px] border-b-[1px] border-solid border-t-sky-300 border-b-sky-300",
        grabbing && "cursor-grabbing"
      )}
      onMouseDown={onGrabDown}
      onMouseMove={onGrabMove}
      onMouseUp={onGrabUp}
    ></div>
  );
};

export default Grab;
