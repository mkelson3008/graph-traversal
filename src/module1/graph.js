import {Node} from "./nodes.js";
import {Edge} from "./edges.js";

export class Graph {
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
        this.startNodeId = null;
    }

    addNode(x, y, type = "normal") {
        let nodeObj = new Node(x, y, type);
        nodeObj.nodeID = this.nodeTracker;
        this.adjacencyList.set(nodeObj.nodeID, new Set());
        this.nodes.set(nodeObj.nodeID, nodeObj)
        this.nodeTracker++;
        this.keys = [...this.adjacencyList.keys()];
        return nodeObj;
    }

    removeNode(nodeID) {
        let toBeDeletedEdges = [];
        this.nodes.delete(nodeID);

        if (this.startNodeId === nodeID) {
            this.startNodeId = null;
        }

        this.edges.forEach((value, key) => {
            if (value.nodeFrom == nodeID || value.nodeTo == nodeID) {
                toBeDeletedEdges.push(key);
            }
        })
        for (const deleteEdge of toBeDeletedEdges) {
            this.edges.delete(deleteEdge);
        }

        this.adjacencyList.delete(nodeID);
        return toBeDeletedEdges
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
        return newEdge;
    }

    removeEdge(edgeID) {
        let edge = this.edges.get(edgeID);
        if (!edge) return;
        this.edges.delete(edgeID);

        this.adjacencyList.get(edge.nodeFrom).delete(edge.nodeTo);
        this.adjacencyList.get(edge.nodeTo).delete(edge.nodeFrom);
    }

    getNeighbors(nodeID) {
        let neighbors = this.adjacencyList.get(nodeID);
        return [...neighbors]
    }

    setStartNode(nodeID) {
        if (this.startNodeId === nodeID) return null;
        const previousStartId = this.startNodeId;

        if (previousStartId !== null) {
            this.nodes.get(previousStartId).type = "normal";
        }

        this.nodes.get(nodeID).type = "start";
        this.startNodeId = nodeID;

        return previousStartId;
    }

    getNode(nodeID) {
        return this.nodes.get(nodeID);
    }

    getAllNodes() {
        return [...this.nodes.values()];
    }

    getAllEdges() {
        return [...this.edges.values()];
    }

    getAdjacencyList() {
        return this.adjacencyList;
    }
}

export const graphModel = new Graph();