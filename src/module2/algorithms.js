function BFS(s, adj) {
    let level = new Map();
    level.set(s, 0);
    let i = 1;
    let frontier = [s];

    while (frontier.length) {
        let next = [];
        for (const u of frontier) {
            for (const v of adj.get(u)) {
                if (level.has(v) == false) {
                    level.set(v, i);
                    next.push(v);
                }
            }
        }
        frontier = next;
        i+= 1;
    }
    return level;
}

function DFS(s, adj) {
    let visited = new Set();
    let stack = [s];

    while (stack.length) {
        u = stack.pop();
        
        if (visited.has(u) == false) {
            visited.add(u);
            for (const v of adj.get(u)){
                if (visited.has(v) == false) {
                    stack.push(v);
                }
            }
        }
    }

    return visited;
}

export {BFS, DFS};