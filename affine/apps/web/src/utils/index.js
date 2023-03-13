import { BlockSuiteWorkspace } from "../shared";

const hashMap = new Map();
export const createEmptyBlockSuiteWorkspace = (
  id,
  blobOptionsGetter,
  idGenerator
) => {
  if (hashMap.has(id)) {
    return hashMap.get(id);
  }

  const workspace = new BlockSuiteWorkspace({
    id,
    isSSR: typeof window === "undefined",
    blobOptionsGetter,
    idGenerator,
  });

  hashMap.set(id, workspace);
  return workspace;
};
