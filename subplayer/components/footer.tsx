import clsx from "clsx";
import { useCallback } from "react";
import DT from "duration-time-conversion";

interface Props {
  className?: string;
  player: HTMLVideoElement | null;
}

const Footer = ({ className, player }: Props) => {
  return (
    <div className={clsx("relative flex flex-col", className)}>
      {player && <></>}
    </div>
  );
};

const Duration = () => {
  const getDuration = useCallback((time: number) => {
    time = time == Infinity ? 0 : time;
    return DT.d2t(time).split(".")[0];
  }, []);
  return (
    <div className="">
      <span></span>
    </div>
  );
};

export default Footer;
