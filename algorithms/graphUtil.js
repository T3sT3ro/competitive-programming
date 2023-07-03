/**
 * @typedef {number} Vertex
 * @typedef {Vertex | {v: Vertex, weight: number}} Edge
 * @typedef {{[u: Vertex] : Edge[]}} Graph
 * @typedef {(u: Vertex) => void} NodeEvent
 * @typedef {(u: Vertex, v: Vertex, weight?: number) => void} EdgeEvent
 */

/**
 * @param {number} n vertices
 * @returns {Graph}
 */
export function createGraph(n) {
    let G = new Array(n).fill([]);
    return G;
}

/**
 * Randomly connect, naive, doesn't check for duplicates
 * @param {Graph} G 
 * @param {number} p edge probability
 * @param {boolean} directed 
 */
export function fillRandom(G, p = 0.5, directed = false) {
    for (const u of G) {
        for (const v of G) {
            if (Math.random() < p) {
                G[u].push(v);
                if (!directed)
                    G[v].push(u);
            }
        }
    }
}

/**
 * transposes edges of a graph (adjacency list)
 * @param {Graph} G 
 * @returns {Graph} Gt, transposed graph
 */
export function transpose(G) {
    let Gt = new Array(G.length).fill([]);
    for (const u in G) {
        for (const v of G[u]) {
            Gt[v] = Gt[v] || [];
            Gt[v].push(u);
        }
    }
    return Gt;
}

/**
 * 
 * @param {Graph} G
 * @param {Vertex} u
 * @param {{visited: boolean[], onEnter: NodeEvent, onExit: NodeEvent}} opts 
 */
export function DFS(G, u, opts = {}) {
    opts.visited = opts.visited || new Array(G.length).fill(false);
    opts.onEnter = opts.onEnter || (() => { });
    opts.onExit = opts.onExit || (() => { });

    onEnter(u);
    visited[u] = true;
    for (const v of G[u]) {
        if (!visited[v])
            DFS(G, v, opts);
    }
    onExit(u);
}

/**
 * 
 * @param {Graph} G 
 * @param {Vertex} u 
 * @param {{visited: boolean[], onEnter: NodeEvent, onExit: NodeEvent}} opts 
 */
export function BFS(G, u, opts = {}) {
    opts.visited = opts.visited || new Array(G.length).fill(false);
    opts.onEnter = opts.onEnter || (() => { });
    opts.onExit = opts.onExit || (() => { });

    let queue = [u];
    while (queue.length) {
        let u = queue.shift();
        onEnter(u);
        visited[u] = true;
        for (const v of G[u]) {
            if (!visited[v])
                queue.push(v);
        }
        onExit(u);
    }
}