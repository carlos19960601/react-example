import { motion } from "framer-motion";
import { PropsWithChildren } from "react";
import useResizeObserver from "use-resize-observer";

export function ResizablePanel({ children }: PropsWithChildren) {
  const { ref, height } = useResizeObserver<HTMLDivElement>();

  return (
    <motion.div
      animate={{ height: height ?? "auto" }}
      className="relative w-full overflow-hidden"
    >
      <div ref={ref} className={height ? "absolute" : "hidden"}>
        {children}
      </div>
    </motion.div>
  );
}
