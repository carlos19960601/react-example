import { nanoid } from "./utils/id-generator";
import { Awareness } from 'y-protocols/awareness.js';
import { BlockSuiteDoc } from "./yjs";

const flagsPreset = {
  enable_set_remote_flag: true,
  enable_drag_handle: true,
  enable_block_hub: true,
  enable_surface: true,
  enable_edgeless_toolbar: true,
  enable_slash_menu: true,

  enable_database: false,
  enable_toggle_block: false,
  enable_block_selection_format_bar: true,

  readonly: {},
};

export class Store {
  doc = new BlockSuiteDoc();

  constructor({
    id = nanoid(),
    providers = [],
    awareness,
    idGenerator,
    defaultFlags,
  }) {
    this.id = id;
    this.awarenessStore = new AwarenessStore(
      this,
      awareness ?? new Awareness(this.doc),
      merge(true, flagsPreset, defaultFlags)
    );
  }
}
