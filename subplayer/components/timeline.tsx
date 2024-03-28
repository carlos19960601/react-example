import Sub from "@/libs/sub";
import { useRef } from "react";
import { RenderProps } from "./footer";

interface Props {
  player: HTMLVideoElement;
  subtitles: Sub[];
  render: RenderProps;
}

const Timeline = ({
  player,
  subtitles,
  render,
  currentTime,
  checkSub,
  removeSub,
  hasSub,
  updateSub,
  mergeSub,
}: Props) => {
  const $blockRef = useRef();
  const $subsRef = useRef();

  const currentSubs = getCurrentSubs(
    subtitles,
    render.beginTime,
    render.duration
  );

  return (
    <div>
      <div>
        {currentSubs.map((sub, key) => {
          return <div></div>;
        })}
      </div>
    </div>
  );
};

function getCurrentSubs(subs: Sub[], beginTime: number, duration: number) {
  return subs.filter((item) => {
    return (
      (item.startTime >= beginTime && item.startTime <= beginTime + duration) ||
      (item.endTime >= beginTime && item.endTime <= beginTime + duration) ||
      (item.startTime < beginTime && item.endTime > beginTime + duration)
    );
  });
}

export default Timeline;
