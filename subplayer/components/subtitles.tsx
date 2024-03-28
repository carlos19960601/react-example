"use client";

import Sub from "@/libs/sub";
import clsx from "clsx";
import { debounce } from "lodash";
import { useCallback, useEffect, useState } from "react";
import { Table } from "react-virtualized";

type Props = {
  subtitles: Array<Sub>;
  className?: string;
  updateSub: (sub: Sub, newSub: Partial<Sub>) => void;
};

const Subtitles = ({ subtitles, updateSub, className }: Props) => {
  const [height, setHeight] = useState(100);

  const resize = useCallback(() => {
    setHeight(document.body.clientHeight - 170);
  }, [setHeight]);

  useEffect(() => {
    resize();

    const debounceResize = debounce(resize, 500);
    window.addEventListener("resize", debounceResize);
  }, [resize]);

  return (
    <div className={clsx("relative", className)}>
      <Table
        headerHeight={40}
        width={250}
        height={height}
        rowHeight={80}
        rowCount={subtitles.length}
        rowGetter={({ index }) => subtitles[index]}
        rowRenderer={(props) => (
          <div key={props.key} style={props.style}>
            <div className="h-full p-[5px]">
              <textarea
                className="border border-solid border-white/10 bg-white/5 resize-none outline-none h-full w-full p-[10px] text-center"
                value={unescape(props.rowData.text)}
                maxLength={200}
                spellCheck={false}
                onChange={(e) => {
                  updateSub(props.rowData, { text: e.target.value });
                }}
              />
            </div>
          </div>
        )}
      />
    </div>
  );
};

export default Subtitles;
