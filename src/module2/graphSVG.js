import {graphModel } from "../module1/graph.js";
const SVG_NS = "http://www.w3.org/2000/svg";

// mode manager
const modeManager = {
    _current: null,

    get current() {
        return this._current;
    },

    set current(newMode) {
        this._current = newMode;
        addEdgeObj.reset();
        this._updateUI();
    },

    _updateUI() {
        const indicator = document.getElementById("mode-indicator");
        indicator.textContent = `Mode: ${this._current ?? "None"}`;

        document.querySelectorAll(".mode-button").forEach(btn => {
            btn.classList.toggle("active", btn.dataset.mode === this._current);
        });
    }
};

const addEdgeObj = {
    firstNode: null,
    reset() {
        this.firstNode = null;
    }
};

// Connecting buttons to mode manager
document.querySelectorAll(".mode-button").forEach(btn => {
    btn.addEventListener("click", () => {
        console.log("Btn clicked:", btn.dataset.mode);
        const clickedMode = btn.dataset.mode;

        if (modeManager.current === clickedMode) {
            modeManager.current = null;
        }
        else {
            modeManager.current = clickedMode;
        }
    });
});

const svg = document.getElementById("graph-canvas");

svg.addEventListener("click", (e) => {
    if (modeManager.current === null) return;

    switch (modeManager.current) {
        case "addNode":
            handleAddNode(e);
            break;
        case "addEdge":
            handleAddEdge(e);
            break;
        case "delete":
            handleDelete(e);
            break;
        case "setStart":
            handleSetStart(e);
            break;
    }
});

function renderNode(node) {
    const nodeLayer = document.getElementById("node-layer");
    const labelLayer = document.getElementById("label-layer");

    const circle = document.createElementNS(SVG_NS, "circle");
    circle.setAttribute("cx", node.x);
    circle.setAttribute("cy", node.y);
    circle.setAttribute("r", 25);
    circle.setAttribute("data-node-id", node.nodeID);
    circle.classList.add("graph-node");

    const label = document.createElementNS(SVG_NS, "text");
    label.setAttribute("x", node.x);
    label.setAttribute("y", node.y);
    label.setAttribute("data-node-id", node.nodeID);
    label.classList.add("node-label");
    label.textContent = node.nodeID;

    nodeLayer.appendChild(circle);
    labelLayer.appendChild(label);
}

function renderEdge(edge) {
    const edgeLayer = document.getElementById("edge-layer");
    const sourceNode = graphModel.getNode(edge.nodeFrom);
    const targetNode = graphModel.getNode(edge.nodeTo);

    const line = document.createElementNS(SVG_NS, "line");
    line.setAttribute("x1", sourceNode.x);
    line.setAttribute("y1", sourceNode.y);
    line.setAttribute("x2", targetNode.x);
    line.setAttribute("y2", targetNode.y);
    line.setAttribute("data-edge-id", edge.edgeID);
    line.classList.add("graph-edge");
    edgeLayer.appendChild(line);
}

function handleAddNode(e) {
    const x = e.offsetX;
    const y = e.offsetY;

    const node = graphModel.addNode(x, y);
    renderNode(node);
}



function handleAddEdge(e) {
    const nodeIdStr = e.target.dataset.nodeId;

    if(nodeIdStr === undefined) return;
    const nodeId = Number(nodeIdStr);

    if (addEdgeObj.firstNode === null) {
        addEdgeObj.firstNode = nodeId;
        return;
    }

    const sourceId = addEdgeObj.firstNode;
    const targetId = nodeId;

    if (sourceId === targetId) {
        addEdgeObj.reset();
        return;
    }

    if (graphModel.getNeighbors(sourceId).includes(targetId)) {
        addEdgeObj.reset();
        return;
    }

    const edge = graphModel.addEdge(sourceId, targetId);
    renderEdge(edge);
    addEdgeObj.reset();
}

function handleDelete(e) {
    const nodeId = e.target.dataset.nodeId;
    const edgeId = e.target.dataset.edgeId;

    if (nodeId !== undefined) {
        deleteNode(Number(nodeId))
    }
    else if (edgeId !== undefined) {
        deleteEdge(Number(edgeId));
    } 
}

function deleteNode(nodeId) {
    const removeEdgeIds = graphModel.removeNode(nodeId);

    document.querySelector(`[data-node-id="${nodeId}"].graph-node`)?.remove();
    document.querySelector(`[data-node-id="${nodeId}"].node-label`)?.remove();

    for (const edgeId of removeEdgeIds) {
        document.querySelector(`[data-edge-id="${edgeId}"]`)?.remove();
    } 

} 

function deleteEdge(edgeId) {
    graphModel.removeEdge(edgeId);
    document.querySelector(`[data-edge-id="${edgeId}"]`)?.remove();
}

function handleSetStart(e) {
    const nodeIdStr = e.target.dataset.nodeId;
    if(nodeIdStr === undefined) return;

    const nodeId = Number(nodeIdStr);
    const previousStartId = graphModel.setStartNode(nodeId);

    if(previousStartId !== null) {
        const oldCir = document.querySelector(`[data-node-id="${previousStartId}"].graph-node`);
        oldCir.classList.remove("start-node");
    }

    const newCir = document.querySelector(`[data-node-id="${nodeId}"].graph-node`);
    newCir.classList.add("start-node");
}

