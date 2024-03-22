"use client";

import { nodeTypes } from "@/config/nodeTypes";
import { calculateEdges } from "@/helpers/calculateEdges";
import { initializeNodes } from "@/helpers/initializeNodes";
import { loadDatabases } from "@/helpers/loadDatabases";
import { setHighlightEdgeClassName } from "@/helpers/setHighlightEdgeClassName";
import { DatabaseConfig } from "@/types";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  Background,
  Controls,
  Node,
  ReactFlow,
  ReactFlowInstance,
  ReactFlowProvider,
  getConnectedEdges,
  useEdgesState,
  useNodesState,
  useStoreApi,
} from "reactflow";
import "reactflow/dist/style.css";

interface FlowProps {
  currentDatabase: DatabaseConfig;
}

const Flow: React.FC<FlowProps> = (props: FlowProps) => {
  const currentDatabase = props.currentDatabase;
  const initialNodes = initializeNodes(currentDatabase);

  const store = useStoreApi();

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const onInit = (instance: ReactFlowInstance) => {
    const nodes = instance.getNodes();
    const initialEdges = calculateEdges({ nodes, currentDatabase });
    setEdges(initialEdges);
  };

  const onNodeMouseEnter = useCallback((_: any, node: Node) => {
    const state = store.getState();
    state.resetSelectedElements();
    state.addSelectedNodes([node.id]);

    const connectedEdges = getConnectedEdges([node], edges);
    setEdges((eds) => {
      return eds.map((ed) => {
        if (connectedEdges.find((e) => e.id === ed.id)) {
          setHighlightEdgeClassName(ed);
        }

        return ed;
      });
    });
  }, []);

  const onNodeMouseLeave = useCallback(() => {}, []);

  return (
    <div className="w-full h-full flex-grow text-xs">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        nodeTypes={nodeTypes}
        onInit={onInit}
        onNodeMouseEnter={onNodeMouseEnter}
        onNodeMouseLeave={onNodeMouseLeave}
      >
        <Controls />
        <Background color="#aaa" gap={16} />
      </ReactFlow>
    </div>
  );
};

export default function Home() {
  const [currentDatabase, setCurrentDatabase] = useState({
    tables: [],
    edgeConfigs: [],
    schemaColors: {},
    tablePositions: {},
  } as DatabaseConfig);
  const [databasesLoaded, setDataabasesLoaded] = useState(false);
  const searchParams = useSearchParams();
  const database = searchParams.get("database");

  useEffect(() => {
    loadDatabases().then((data) => {
      if (!database || !(database in data)) {
        return;
      }

      const databaseConfig = data[database] as DatabaseConfig;
      setCurrentDatabase(databaseConfig);
      setDataabasesLoaded(true);
    });
  }, []);

  return (
    <ReactFlowProvider>
      {databasesLoaded && <Flow currentDatabase={currentDatabase} />}
    </ReactFlowProvider>
  );
}
