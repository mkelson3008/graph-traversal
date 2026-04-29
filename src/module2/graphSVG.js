import {graphModel } from "../module1/graph.js";
import { BFS, DFS } from "../module3/algorithms.js";
const SVG_NS = "http://www.w3.org/2000/svg";

// The portion manages the state (add node, add edge, etc.)
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

// Relates buttons with mode manager
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

// Playback horror begins

const PLAYBACK_INTERVAL_MS = 800;

const playbackEngine = {
    steps: [],
    currentStepIndex: 0,
    timerId: null,

    load(steps) {
        this.stop();
        this.steps = steps;
        this.currentStepIndex = 0;
        this.render();
        this._updateUI();
    },

    next() {
        if (this.currentStepIndex < this.steps.length - 1) {
            this.currentStepIndex++;
            this.render();
            this._updateUI();
        } else {
            this.stop();
        }
    },

    previous() {
        if (this.currentStepIndex > 0) {
            this.currentStepIndex--;
            this.render();
            this._updateUI();
        }
    },

    skipToStart() {
        this.stop();
        this.currentStepIndex = 0;
        this.render();
        this._updateUI();
    },

    skipToEnd() {
        this.stop();
        this.currentStepIndex = Math.max(0, this.steps.length - 1);
        this.render();
        this._updateUI();
    },

    play() {
        if (this.timerId !== null) return; // traveral is alreay running here, so return!
        if (this.currentStepIndex >= this.steps.length - 1) {
            this.currentStepIndex = 0;
            this.render();
        }
        this.timerId = setInterval(() => this.next(), PLAYBACK_INTERVAL_MS);
        this._updateUI();
    },

    stop() {
        if (this.timerId !== null) {
            clearInterval(this.timerId);
            this.timerId = null;
            this._updateUI();
        }
    },

    isPlaying() {
        return this.timerId !== null;
    },

    render() {
        document.querySelectorAll("#node-layer circle").forEach(c => {
            c.classList.remove("visited", "current", "queued");
        });
        document.querySelectorAll("#edge-layer line").forEach(l => {
            l.classList.remove("traversed");
        });

        if (this.steps.length === 0) {
            document.getElementById("queue-display").textContent = "—";
            return;
        }

        const step = this.steps[this.currentStepIndex];

        const currentEl = document.querySelector(
            `[data-node-id="${step.currentNode}"].graph-node`
        );
        currentEl?.classList.add("current");

        for (const id of step.visitedNodes) {
            document.querySelector(`[data-node-id="${id}"].graph-node`)
                ?.classList.add("visited");
        }

        for (const id of step.queuedNodes) {
            document.querySelector(`[data-node-id="${id}"].graph-node`)
                ?.classList.add("queued");
        }

        if (step.traversedEdge !== null) {
            document.querySelector(`[data-edge-id="${step.traversedEdge}"]`)
                ?.classList.add("traversed");
        }

        const queueDisplay = document.getElementById("queue-display");
        const allQueued = [step.currentNode, ...step.queuedNodes];
        queueDisplay.textContent = allQueued.length > 0 ? allQueued.join(" → ") : "—";
    },

    _updateUI() {
        const indicator = document.getElementById("step-indicator");
        const total = this.steps.length;
        const display = total === 0 ? 0 : this.currentStepIndex + 1;
        indicator.textContent = `Step ${display} / ${total}`;

        const playPauseBtn = document.getElementById("play-pause");
        playPauseBtn.textContent = this.isPlaying() ? "⏸" : "▶";

        const atStart = this.currentStepIndex === 0;
        const atEnd = this.currentStepIndex >= this.steps.length - 1;
        document.getElementById("skip-start").disabled = atStart;
        document.getElementById("step-back").disabled = atStart;
        document.getElementById("skip-end").disabled = atEnd || total === 0;
        document.getElementById("step-forward").disabled = atEnd || total === 0;
        playPauseBtn.disabled = total === 0;
    },

    
};

// This portion handles running BFS or DFS
document.getElementById("run-button").addEventListener("click", () => {
    if (graphModel.startNodeId === null) {
        alert("Must choose start node.");
        return;
    }

    const algorithm = document.getElementById("algorithm-select").value;
    const adj = graphModel.getAdjacencyList();

    const getEdgeId = (u, v) => {
        const edge = graphModel.getAllEdges().find(e =>
            (e.nodeFrom === u && e.nodeTo === v) ||
            (e.nodeFrom === v && e.nodeTo === u)
        );
        return edge ? edge.edgeID : null;
    };

    const algorithmFn = algorithm === "BFS" ? BFS : DFS;
    document.getElementById("queue-label").textContent = algorithm === "BFS" ? "Queue" : "Stack";

    const steps = algorithmFn(graphModel.startNodeId, adj, getEdgeId);
    playbackEngine.load(steps);
});


document.getElementById("skip-start").addEventListener("click", () => playbackEngine.skipToStart());
document.getElementById("step-back").addEventListener("click", () => playbackEngine.previous());
document.getElementById("step-forward").addEventListener("click", () => playbackEngine.next());
document.getElementById("skip-end").addEventListener("click", () => playbackEngine.skipToEnd());

document.getElementById("play-pause").addEventListener("click", () => {
    if (playbackEngine.isPlaying()) {
        playbackEngine.stop();
    } else {
        playbackEngine.play();
    }
});

playbackEngine._updateUI();