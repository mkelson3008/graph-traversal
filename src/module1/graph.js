import {Node} from "./nodes.js";
import {Edge} from "./edges.js";
import {BFS, DFS} from "../module2/algorithms.js"

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

        this.edges.forEach((value, key) => {
            if (value.nodeFrom == nodeID || value.nodeTo == nodeID) {
                toBedeletedEdges.push(key);
            }
        })
        for (const deleteEdge of toBedeletedEdges) {
            this.edges.delete(deleteEdge);
        }

        this.adjacencyList.delete(nodeID);
    }

    updateNodePos(x, y, nodeID) {
        let node = this.nodes.get(nodeID);
        node.x = x;
        node.y = y;
    }

    addEdge(node1, node2) {
        let newEdge = new Edge(node1, node2, this.edgeTracker);
        this.adjacencyList.get(node1).add(node2);
        this.adjacencyList.get(node2).add(node1);
        this.edges.set(newEdge.edgeID, newEdge)
        this.edgeTracker++;
    }

    removeEdge(edgeID) {
        let edge = this.edges.get(edgeID);
        this.edges.delete(edgeID);

        this.adjacencyList.forEach((neighbors) => {
            neighbors.forEach((neighborsID) => {
                if(neighborsID === edge.nodeFrom || neighborsID === edge.nodeTo) {
                    neighbors.delete(neighborsID);
                }
            })
        })
    }

    getNeighbors(nodeID) {
        let neighbors = graph.adjacencyList.get(nodeID);
        return [...neighbors]
    }

    getNode(nodeID) {
        return graph.nodes.get(nodeID);
    }

    getAllNodes() {
        return [...graph.nodes.values()];
    }

    getAllEdges() {
        return [...graph.edges.values()];
    }

    getAdjacencyList() {
        return this._adjacencyList;
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
console.log("After testing BFS");
console.log(BFS(0, graph.adjacencyList))
console.log("After testing DFS");
console.log(0, graph.adjacencyList)