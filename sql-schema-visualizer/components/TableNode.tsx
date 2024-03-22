import { TableConfig } from "@/types";
import { FC } from "react";
import { Handle, NodeProps, Position } from "reactflow";
import { KeyIcon } from "./KeyIcon";

export const TableNode: FC<NodeProps<TableConfig>> = ({ data }) => {
  return (
    <div className="bg-white">
      <div
        className="relative p-2 border-0 rounded font-bold text-center"
        style={{ backgroundColor: data.schemaColor }}
      >
        {data.schema ? `${data.schema}.${data.name}` : data.name}
      </div>

      <div className="border border-solid border-gray-200 border-t-0">
        {data.columns.map((column, index) => (
          <div key={index} className="text-xs cursor-pointer hover:bg-gray-300">
            {column.handleType && (
              <Handle
                //@ts-ignore
                type={column.handleType}
                position={Position.Right}
                id={`${column.name}-right`}
                className={
                  "w-0.5 h-0.5 min-w-[2px] right-0 top-1/2 -translate-x-1/2 -translate-y-1/2"
                }
              />
            )}
            {column.handleType && (
              <Handle
                //@ts-ignore
                type={column.handleType}
                position={Position.Left}
                id={`${column.name}-left`}
                className={
                  "w-0.5 h-0.5 min-w-[2px] right-0 top-1/2 -translate-x-1/2 -translate-y-1/2"
                }
              />
            )}
            <div className="flex flex-row justify-between p-2 relative">
              <div className="mr-4 flex items-center">
                {column.key && <KeyIcon />}
                {column.name}
              </div>
              <div>{column.type}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
