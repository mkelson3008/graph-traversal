export class Node {
    type;
    nodeID;
    x;
    y;

    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        }

    get type() {
        return this._type;
    }

    get nodeID() {
        return this._nodeID;
    }
}
