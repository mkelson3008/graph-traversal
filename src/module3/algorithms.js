function BFS(startId, adj, getEdgeId) {
    const steps = [];
    const visited = new Set();
    const queued = new Set();
    const parentEdge = new Map();

    const queue = [startId];
    queued.add(startId);

    steps.push({
        currentNode: startId,
        visitedNodes: [],
        queuedNodes: [],
        traversedEdge: null
    });

    while (queue.length) {
        const u = queue.shift()
        queued.delete(u);
        visited.add(u);

        for (const v of adj.get(u)) {
            if (!visited.has(v) && !queued.has(v)) {
                queued.add(v);
                queue.push(v);
                parentEdge.set(v, getEdgeId(u, v));
            }
        }

        if (queue.length > 0) {
            const next = queue[0];
            steps.push({
                currentNode: next,
                visitedNodes: [...visited],
                queuedNodes: [...queued].filter(id => id !== next),
                traversedEdge: parentEdge.get(next) ?? null
            });
        }
    }

    return steps;
}


function DFS(startId, adj, getEdgeId) {
    const steps = [];
    const visited = new Set();
    const onStack = new Set();
    const parentEdge = new Map();

    const stack = [startId];
    onStack.add(startId);

    steps.push({
        currentNode: startId,
        visitedNodes: [],
        queuedNodes: [],
        traversedEdge: null
    });

    while (stack.length) {
        const u = stack.pop();
        onStack.delete(u);

        if (visited.has(u)) continue;
        visited.add(u);

        for (const v of adj.get(u)) {
            if (!visited.has(v) && !onStack.has(v)) {
                stack.push(v);
                onStack.add(v);
                parentEdge.set(v, getEdgeId(u, v));
            }
        }

        if (stack.length > 0) {
            const next = stack[stack.length - 1];
            steps.push({
                currentNode: next,
                visitedNodes:  [...visited],
                queuedNodes: [...onStack].filter(id => id !== next),
                traversedEdge: parentEdge.get(next) ?? null
            });
        }
    }

    return steps;
}

export {BFS, DFS}