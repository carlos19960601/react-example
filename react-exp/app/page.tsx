"use client";

import { useEffect, useRef, useState } from "react";

export default function Home() {
  useEffect(() => {
    fetch("http://www.poine.com/weed/7,7c502c347d")
      .then((res) => res.json())
      .catch((err) => console.log(err));
  }, []);

  return <div></div>;
}
