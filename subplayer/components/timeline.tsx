import Sub from "@/libs/sub";
import { cn } from "@nextui-org/react";
import { useRef } from "react";
import { RenderProps } from "./footer";

interface Props {
  player: HTMLVideoElement | null;
  subtitles: Sub[];
  render: RenderProps;
  currentTime: number;
}

const Timeline = ({ player, subtitles, render, currentTime }: Props) => {
  const $blockRef = useRef<HTMLDivElement>(null);
  const $subsRef = useRef<HTMLDivElement>(null);

  const gridGap = document.body.clientWidth / render.gridNum;

  const currentSubs = getCurrentSubs(
    subtitles,
    render.beginTime,
    render.duration
  );
  const currentIndex = currentSubs.findIndex(
    (item) => item.startTime <= currentTime && item.endTime > currentTime
  );

  return (
    <div
      className="absolute top-0 bottom-0 left-0 right-0 w-full h-full pointer-events-none z-20"
      ref={$blockRef}
    >
      <div ref={$subsRef}>
        {currentSubs.map((sub, key) => {
          return (
            <div
              key={key}
              className={cn(
                "absolute left-0 top-1/3 h-2/5 text-white bg-white/20 overflow-hidden flex justify-center items-center font-md cursor-move select-none border-1 border-white/20 pointer-events-auto",
                key === currentIndex
                  ? "bg-primary-600/50 border-1 border-primary-600/50"
                  : ""
              )}
              style={{
                left:
                  render.padding * gridGap +
                  (sub.startTime - render.beginTime) * gridGap * 10,
                width: (sub.endTime - sub.startTime) * gridGap * 10,
              }}
              onClick={() => {
                if (player!.duration >= sub.startTime) {
                  player!.currentTime = sub.startTime + 0.001;
                }
              }}
            >
              <div className="relative z-0 flex justify-center items-center flex-col break-words whitespace-nowrap w-full h-full">
                {`${sub.text}`.split(/\r?\n/).map((line, index) => (
                  <p key={index}>{line}</p>
                ))}
              </div>
              <div className="opacity-50 absolute left-0 right-0 bottom-0 w-full text-center text-sm">
                {sub.duration}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

function getCurrentSubs(
  subs: Sub[],
  beginTime: number,
  duration: number
): Array<Sub> {
  return subs.filter((item) => {
    return (
      (item.startTime >= beginTime && item.startTime <= beginTime + duration) ||
      (item.endTime >= beginTime && item.endTime <= beginTime + duration) ||
      (item.startTime < beginTime && item.endTime > beginTime + duration)
    );
  });
}

export default Timeline;
