import { FlowEndNode, FlowStartNode } from "../core";
import { FlowNode } from "../flow-node";

export const BitNode = (
  node: { disabled?: boolean } & Pick<FlowStartNode | FlowEndNode, "type"> & {
      data: { count?: number; name: string };
    }
) => {
  if (node.type === "start") {
    return <FlowNode title={node.data?.name} />;
  }

  return <FlowNode title={node.data?.name || ""} />;
};
