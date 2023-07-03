// Finds strongly connected components using 2 DFSes
// 1. DFS on G finds the time of exit for each vertex
// 2. DFS on G' (transpose) in decreasing order of exit time finds SCCs
// Time Complexity: O(V+E)
import { DFS, transpose } from "./graphUtil.js";
import { expect, test } from 'vitest';

/**
 * Finds strongly connected components using 2 DFSes and graph transpose. 
 * Can be used in 2-SAT.
 * @param {Graph} G 
 * @returns {[Vertex[]]} strongly connected components
 */
export function kasaraju(G) {
    // stack as exit times
    let stack = [];
    let visited = new Array(G.length).fill(false);
    for (let u = 0; u < G.length; u++) {
        if (!visited[u])
            DFS(G, u, { visited: visited, onExit(v) { stack.push(v) } });
    }

    let Gt = transpose(G);
    visited.fill(false);
    let SCCs = [];
    while (stack.length) {
        let u = stack.pop();
        if (!visited[u]) {
            let SCC = [];
            DFS(Gt, u, {
                visited: visited,
                onEnter(v) { SCC.push(v) }
            });
            SCCs.push(SCC);
        }
    }

    return SCCs;
}

// untested, waiting for site refactor
test('kasaraju, strongly connected components', () => {
    let G = {
        1: [2, 4],
        2: [1, 5],
        3: [2, 7],
        4: [],
        5: [4],
        6: [3, 5],
        7: [6]
    };
    console.log(kasaraju(G));
});