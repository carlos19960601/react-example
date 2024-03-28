"use client";

import Footer from "@/components/footer";
import Player from "@/components/player";
import Subtitles from "@/components/subtitles";
import Tool from "@/components/tool";
import Sub from "@/libs/sub";
import { useCallback, useState } from "react";
import WFPlayer from "wfplayer";

export default function Home() {
  const [subtitles, setSubtitles] = useState<Array<Sub>>([]);
  const [player, setPlayer] = useState<HTMLVideoElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [waveform, setWaveform] = useState<WFPlayer | undefined>();

  const newSub = useCallback((item: Partial<Sub>) => new Sub(item), []);
  const hasSub = useCallback((sub: Sub) => subtitles.indexOf(sub), [subtitles]);

  const formatSub = useCallback(
    (sub: Sub | Array<Sub>) => {
      if (Array.isArray(sub)) {
        return sub.map((item) => newSub(item));
      }

      return newSub(sub as Sub);
    },
    [newSub]
  );
  const copySubs = useCallback(
    () => formatSub(subtitles) as Sub[],
    [subtitles, formatSub]
  );

  const addSub = useCallback(
    (index: number, sub: Sub) => {
      const subs = copySubs();
      subs.splice(index, 0, formatSub(sub) as Sub);
      setSubtitles(subs);
      console.log(subs);
    },
    [copySubs, setSubtitles, formatSub]
  );

  const updateSub = useCallback(
    (sub: Sub, obj: Partial<Sub>) => {
      const index = hasSub(sub);
      if (index < 0) return;
      const subs = copySubs() as Sub[];
      const subClone = formatSub(sub) as Sub;
      Object.assign(subClone, obj);
      if (subClone.check) {
        subs[index] = subClone;
        setSubtitles(subs);
      }
    },
    [hasSub, copySubs, setSubtitles, formatSub]
  );

  const props = {
    playing,
    player,
    setPlayer,
    subtitles,
    currentTime,
    setCurrentTime,
    setPlaying,
    waveform,
    setWaveform,
    newSub,
    hasSub,
    addSub,
    updateSub,
  };

  return (
    <div className="flex flex-col w-screen h-screen bg-slate-800 text-white">
      {/* tailwind中使用calc */}
      <div className="flex flex-1">
        <Player {...props} />
        <Subtitles {...props} className="w-[250px]" />
        <Tool className="w-[300px]" />
      </div>
      <Footer className="h-48" {...props} />
    </div>
  );
}
