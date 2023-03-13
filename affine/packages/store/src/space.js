export class Space {
  constructor(id, doc, awarenessStore) {
    this.id = id;
    this.doc = doc;
    this.awarenessStore = awarenessStore;
  }

  transact(fn) {
    this.doc.transact(fn, this.doc.clientID);
  }
}
