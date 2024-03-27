import { MouseEvent, useCallback, useEffect, useState } from "react";
import { RenderProps } from "./footer";
// @ts-ignore
import DT from "duration-time-conversion";
import { useTranslations } from "next-intl";
import Sub from "@/libs/sub";

interface Props {
  player: HTMLVideoElement;
  playing: boolean;
  render: RenderProps;
  addSub: (index: number, sub: Sub) => void;
  newSub: (item: { start: number; end: number; text: string }) => Sub;
  subtitles: Sub[];
}

function findIndex(subs: Sub[], startTime: number): number {
  return subs.findIndex((item, index) => {
    return (
      (startTime >= item.endTime && !subs[index + 1]) ||
      (item.startTime <= startTime && item.endTime > startTime) ||
      (startTime >= item.endTime &&
        subs[index + 1] &&
        startTime < subs[index + 1].startTime)
    );
  });
}

const Metronome = ({
  player,
  playing,
  render,
  addSub,
  newSub,
  subtitles,
}: Props) => {
  const [isDroging, setIsDroging] = useState(false);
  const [drogStartTime, setDrogStartTime] = useState(0);
  const [drogEndTime, setDrogEndTime] = useState(0);
  const gridGap = document.body.clientWidth / render.gridNum;

  const t = useTranslations("Subtitle");

  const getEventTime = useCallback(
    (e: MouseEvent) => {
      return (
        (e.pageX - render.padding * gridGap) / gridGap / 10 + render.beginTime
      );
    },
    [gridGap, render]
  );

  const onMouseDown = useCallback(
    (e: MouseEvent) => {
      if (e.button !== 0) return;

      const clickTime = getEventTime(e);
      setIsDroging(true);
      setDrogStartTime(clickTime);
    },
    [getEventTime]
  );

  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isDroging) {
        if (playing) player.pause();
        setDrogEndTime(getEventTime(e));
      }
    },
    [isDroging, playing, player, getEventTime]
  );

  const onDocumentMouseUp = useCallback(() => {
    if (isDroging) {
      if (
        drogStartTime > 0 &&
        drogEndTime > 0 &&
        drogEndTime - drogStartTime >= 0.2
      ) {
        const index = findIndex(subtitles, drogStartTime) + 1;
        const start = DT.d2t(drogStartTime);
        const end = DT.d2t(drogEndTime);
        addSub(
          index,
          newSub({
            start,
            end,
            text: t("subText"),
          })
        );
      }
    }

    setIsDroging(false);
    setDrogStartTime(0);
    setDrogEndTime(0);
  }, []);

  useEffect(() => {
    document.addEventListener("mouseup", onDocumentMouseUp);
    return () => document.removeEventListener("mouseup", onDocumentMouseUp);
  }, [onDocumentMouseUp]);

  return (
    <div
      className=" absolute top-0 right-0 bottom-0 left-0 w-full h-full cursor-ew-resize select-none"
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
    >
      {player &&
        !playing &&
        drogStartTime &&
        drogEndTime &&
        drogEndTime > drogStartTime && (
          <div
            className="absolute top-0 bottom-0 h-full pointer-events-none select-none bg-green-300/50 border-x border-x-green-400"
            style={{
              left:
                render.padding * gridGap +
                (drogStartTime - render.beginTime) * gridGap * 10,
              width: (drogEndTime - drogStartTime) * gridGap * 10,
            }}
          ></div>
        )}
    </div>
  );
};

export default Metronome;
