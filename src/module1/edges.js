export class Edge {
    // node from, node to, id
    nodeFrom;
    nodeTo;
    edgeID;

    constructor(nf, nt, id) {
        this.nodeFrom = nf;
        this.nodeTo = nt;
        this.edgeID = id;
    }

    get edgeID() {
        return this._edgeID;
    }

    set nodeFrom(fromNode) {
        this._nodeFrom = fromNode;
    }

    set nodeTo(toNode) {
        this._nodeTo = toNode;
    }

    get nodeFrom() {
        return this._nodeFrom;
    }

    get nodeTo() {
        return this._nodeFrom;
    }
}

