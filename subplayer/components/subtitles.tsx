"use client";

import clsx from "clsx";
import { useState } from "react";
import { Table } from "react-virtualized";

type Props = {
  subtitles: Array<string>;
  className?: string;
};

const Subtitles = ({ subtitles, className }: Props) => {
  const [height, setHeight] = useState(100);

  return (
    <div className={clsx("relative", className)}>
      <Table
        headerHeight={40}
        width={250}
        height={height}
        rowHeight={80}
        rowCount={subtitles.length}
      />
    </div>
  );
};

export default Subtitles;
