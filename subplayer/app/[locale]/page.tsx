"use client";

import Footer from "@/components/footer";
import Player from "@/components/player";
import Subtitles from "@/components/subtitles";
import Tool from "@/components/tool";
import { useState } from "react";

export default function Home() {
  const [subtitles, setSubtitles] = useState([]);
  const [player, setPlayer] = useState<HTMLVideoElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [playing, setPlaying] = useState(false);

  const props = {
    player,
    setPlayer,
    subtitles,
    currentTime,
    setCurrentTime,
    setPlaying,
  };
  return (
    <div className="flex flex-col w-screen h-screen">
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
