import { Space } from "../Space";
import { Store } from "../store";

class WorkspaceMeta extends Space {
  constructor(id, doc, awarenessStore) {
    super(id, doc, awarenessStore);
  }
}

export class Workspace {
  constructor(options) {
    this._store = new Store(options);
    this.meta = new WorkspaceMeta("space:meta", this.doc, this.awarenessStore);
  }

  setName(name) {
    this.doc.transact(() => {
      this.proxy.name = name;
    });
  }
}
