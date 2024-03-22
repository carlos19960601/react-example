type NodeBase = {
  id: string;
  position: {
    x: number;
    y: number;
  };
};

export type FlowCheckpointPublicNode = Pick<FlowCheckpointNode, "id" | "type">;
export type FlowSynchronizeNode = NodeBase & {
  type: "synchronize";
  data?: {
    unlocked: boolean;
  };
};
export type FlowSynchronizePublicNode = Pick<
  FlowSynchronizeNode,
  "id" | "type"
>;

export type FlowTaskNode = NodeBase & {
  type: "task";
  data: Bitflow.Task;
};

export type FlowTaskPublicNode = {
  type: "task";
  id: string;
  data: Pick<Bitflow.Task, "view" | "subtype" | "name">;
};

export type FlowStartNode = NodeBase & {
  type: "start";
  data: Bitflow.Start;
};

export type FlowStartPublicNode = Pick<FlowStartNode, "type" | "data" | "id">;

export type FlowEndNode = NodeBase & {
  type: "end";
  data: Bitflow.End;
};

export type FlowEndPublicNode = Pick<FlowEndNode, "type" | "data" | "id">;

export type FlowInputNode = NodeBase & {
  type: "input";
  data: Bitflow.Input;
};
export type FlowInputPublicNode = Pick<FlowInputNode, "type" | "data" | "id">;
export type FlowTitleNode = NodeBase & {
  type: "title";
  data: Bitflow.Title;
};

export type FlowTitlePublicNode = Pick<FlowTitleNode, "type" | "data" | "id">;

export type FlowCheckpointNode = NodeBase & {
  type: "checkpoint";
};

export type InteractiveFlowNode =
  | FlowTaskNode
  | FlowStartNode
  | FlowEndNode
  | FlowInputNode
  | FlowTitleNode
  | FlowCheckpointNode
  | FlowSynchronizeNode;

export type EqualCondition = {
  type: "equal";
  not: boolean;
  nodeId: string;
  key: string;
  value: string | number;
};
export type TrueCondition = {
  type: "true";
  not: boolean;
  nodeId: string;
  key: string;
};
export type GreaterCondition = {
  type: "greater";
  include: boolean;
  not: boolean;
  nodeId: string;
  key: string;
  value: number;
};

export type LessCondition = {
  type: "less";
  include: boolean;
  not: boolean;
  nodeId: string;
  key: string;
  value: number;
};

export type InCondition = {
  type: "in";
  not: boolean;
  nodeId: string;
  key: string;
  value: (string | number)[];
};

export type PrimitiveCondition =
  | EqualCondition
  | TrueCondition
  | GreaterCondition
  | LessCondition
  | InCondition;

export type AndCondition = {
  type: "and";
  conditions: PrimitiveCondition[];
};

export type OrCondition = {
  type: "or";
  conditions: PrimitiveCondition[];
};
export type Condition = PrimitiveCondition | AndCondition | OrCondition;
export type SplitAnswer = {
  condition: Condition;
};

export type FlowSplitAnswerNode = NodeBase & {
  type: "split-answer";
  data: SplitAnswer;
};
export type SplitResult = {
  condition: Condition;
};
export type FlowSplitResultNode = NodeBase & {
  type: "split-result";
  data: SplitResult;
};
export type SplitPoints = {
  points: number;
};
export type FlowSplitPointsNode = NodeBase & {
  type: "split-points";
  data: SplitPoints;
};
export type PortalInput = {
  portal: string;
  description: string;
};
export type PortalOutput = {
  portal: string;
  description: string;
};
export type FlowPortalInputNode = NodeBase & {
  type: "portal-input";
  data: PortalInput;
};
export type FlowPortalOutputNode = NodeBase & {
  type: "portal-output";
  data: PortalOutput;
};

export type FlowSplitRandomNode = NodeBase & {
  type: "split-random";
};

export type ControlFlowNode =
  | FlowSplitAnswerNode
  | FlowSplitResultNode
  | FlowSplitPointsNode
  | FlowSplitRandomNode
  | FlowPortalInputNode
  | FlowPortalOutputNode;

export type FlowNode = InteractiveFlowNode | ControlFlowNode;

export type FlowEdge = {
  id: string;
  source: string;
  sourceHandle?: "a" | "b" | "c" | "d" | "e" | "f";
  target: string;
};

export type Flow = {
  name: string;
  nodes: FlowNode[];
  edges: FlowEdge[];
  position?: [number, number];
};
