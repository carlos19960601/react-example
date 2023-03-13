import { RemWorkspaceFlavour } from "../shared";
import { AffinePlugin } from "./affine";
import { LocalPlugin } from "./local";

export const WorkspacePlugins = {
  [RemWorkspaceFlavour.AFFINE]: AffinePlugin,
  [RemWorkspaceFlavour.LOCAL]: LocalPlugin,
};
