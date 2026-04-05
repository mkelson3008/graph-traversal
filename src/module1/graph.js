import {Node} from "./nodes.js";
import {Edge} from "./edges.js";

class Graph {
    nodeTracker = 0;
    edgeTracker = 0;
    nodes;
    edges;
    adjacencyList;
    keys;

    constructor() {
        this.adjacencyList = new Map();
        this.nodes = new Map();
        this.edges = new Map();
        this.keys = [];
    }

    addNode(x, y, type) {
        let nodeObj = new Node(x, y, type);
        nodeObj.nodeID = this.nodeTracker;
        this.adjacencyList.set(nodeObj.nodeID, new Set());
        this.nodes.set(nodeObj.nodeID, nodeObj)
        this.nodeTracker++;
        this.keys = [...this.adjacencyList.keys()];
    }

    removeNode(nodeID) {
        let toBedeletedEdges = [];
        this.nodes.delete(nodeID);

        this.edges.forEach((value, key, map) => {
            if (value.nodeFrom == nodeID || value.nodeTo == nodeID) {
                toBedeletedEdges.push(key);
            }
        })
        for (const deleteEdge of toBedeletedEdges) {
            this.edges.delete(deleteEdge);
        }

        this.adjacencyList.delete(nodeID);
    }

    addEdge(node1, node2) {
        let newEdge = new Edge(node1, node2, this.edgeTracker);
        this.adjacencyList.get(node1).add(node2);
        this.adjacencyList.get(node2).add(node1);
        this.edges.set(newEdge.edgeID, newEdge)
        this.edgeTracker++;
    }
}

let graph = new Graph();
graph.addNode(1, 1, "start");
graph.addNode(2, 2, "sure");
graph.addNode(3, 3, "start");
graph.addNode(4, 4, "sure");
graph.addEdge(graph.keys[0], graph.keys[1]);
graph.addEdge(graph.keys[0], graph.keys[2]);
graph.addEdge(graph.keys[1], graph.keys[3]);
console.log(graph.adjacencyList);
console.log(graph.nodes);
console.log(graph.edges);
graph.removeNode(0);
console.log('After removed node');
console.log(graph.adjacencyList);
console.log(graph.nodes);
console.log(graph.edges);


