"use client";
import { Flow as IFlow } from "@/components/core";
import { FC } from "react";
import { Background, Controls, ReactFlow, ReactFlowProvider } from "reactflow";
import "reactflow/dist/style.css";
import { BitNode } from "./BitNode";

export type FlowProps = Pick<IFlow, "nodes" | "edges" | "position"> & {
  autoFitView?: boolean;
  interactive?: boolean;
};

export const Flow: FC<FlowProps> = ({
  interactive = true,
  autoFitView = false,
  nodes,
  edges,
}) => {
  console.log(nodes);
  return (
    <ReactFlowProvider>
      <ReactFlow
        zoomOnDoubleClick={false}
        minZoom={0.05}
        nodes={nodes}
        edges={edges}
        nodeTypes={{
          title: BitNode,
          start: BitNode,
          end: BitNode,
        }}
      >
        <Background />
        <Controls />
        {/* {interactive && <Controls />} */}
      </ReactFlow>
    </ReactFlowProvider>
  );
};
