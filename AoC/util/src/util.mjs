/** @module util */

import FastPriorityQueue from 'fastpriorityqueue';
import _ from 'lodash';


export function gcd(...args) {
    if (args.length == 1) return args[0];
    if (args.length == 2) {
        let [a, b] = args;
        while (b) [a, b] = [b, a % b];
        return a;
    }
    return args.reduce((a, b) => gcd(a, b));
}

export function lcm(...args) {
    if (args.length == 1) return args[0];
    if (args.length == 2) {
        return args[0] * args[1] / gcd(...args);
    };
    return args.reduce((a, b) => lcm(a, b));
}


/**
 * @typedef {"N"|"E"|"S"|"W"} Cardinal
 * @typedef {"NE"|"SE"|"SW"|"NW"} Diagonal
 * @typedef {Cardinal|Diagonal} Direction
 */

/** @type {{N: "U", U: "N",E: "R", R: "E",S: "D", D: "S",W: "L", L: "W"}} */
export const NESW_URDL = {
    N: "U", U: "N",
    E: "R", R: "E",
    S: "D", D: "S",
    W: "L", L: "W",
};

/** @type {[ "N", "NE", "E", "SE", "S", "SW", "W", "NW" ]} */
export const DIRS_CW = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"]
export const DIRS_CW_IDX = { N: 0, NE: 1, E: 2, SE: 3, S: 4, SW: 5, W: 6, NW: 7 };

/**
 * rotates direction to new direction based on cwDirs CW map by n steps
 * @param {Direction} dir starting direction
 * @param {number} n number of steps to rotate in CCW direction where n=1 is 45 deg
 * @returns {Direction}
 */
export function rotateDir(dir, n = 2) {
    const i = DIRS_CW_IDX[dir];
    return DIRS_CW[(i - n + DIRS_CW.length) % DIRS_CW.length];
}

/** @typedef {{[dir: string]: [dr: number, dc: number]}} DirectionDeltas */

/** @type {DirectionDeltas} */
export const CARDINALS = {
    N: [-1, 0],
    E: [0, 1],
    S: [1, 0],
    W: [0, -1],
}

/** @type {DirectionDeltas} */
export const DIAGONALS = {
    NE: [-1, 1],
    SE: [1, 1],
    SW: [1, -1],
    NW: [-1, -1],
}

/** @type {DirectionDeltas} */
export const DIRECTIONS = {
    ...CARDINALS,
    ...DIAGONALS,
}


/**
 * @typedef {{[n: string]: number}} Distances
 */

// taken from AOC 2022/12
// TODO: support cleaning threshold where nodes are deduplicated 
// TODO: support for multiple starting points
// TODO: support for bidirectional search
/**
 * Runs pathfinding algorithm on a graph. By default it is a variation of dijkstra's algorithm.
 * @template N
 * @param {N} S starting node
 * @param {Object} opts
 * @param {(current: N) => Iterable<N>} [opts.neighborEmitter] emits neighbors from current node
 * @param {(current: N, D: Distances) => boolean} [opts.processAndTerminate] process node and if true is returned, end the search
 * @param {(from: N, to: N) => number} [opts.costFunction] returns the cost of moving from n1 to n2
 * @param {(n: N, D: Distances) => number} [opts.heuristic] returns the heuristic distance value for node
 * @param {boolean} [opts.trackParents] should return
 * @returns {{D: Distances, P?: {[parent: string]: N}}} results of pathfinding with distances in D and map of parents (if trackParents was true) of each node in P
 */
export function pathfind(
    S,
    {
        neighborEmitter = function* (n) { },
        processAndTerminate = () => false,
        costFunction = () => 1,
        heuristic = () => 0,
        trackParents = false,
    } = {}
) {
    let returnValue = { D: { [S]: 0 } };
    if (trackParents) 
        returnValue.P = { [S]: undefined };
    let { D, P } = returnValue;
    let Q = new FastPriorityQueue(([, p1], [, p2]) => p1 < p2);
    Q.add([S, 0]);

    while (!Q.isEmpty()) {
        /** @type {N} */
        // @ts-ignore
        let [current,] = Q.poll();
        if (processAndTerminate(current, D))
            break;
        for (const next of neighborEmitter(current, D)) {
            const newCost = D[current] + costFunction(current, next);
            if (newCost < (D[next] || Infinity)) {
                D[next] = newCost;
                if (trackParents) P[next] = current;
                Q.add([next, newCost + heuristic(next, D)]);
            }
        }
    }
    return returnValue;
}

/**
 * @template {RC} N
 * @param {N} E goal node
 * @returns {(n: N, D: Distances) => number} heuristic value of the next node
 */
export function aStarHeuristic(E) {
    return (n, D) => distance(n, E, 1);
}

/**
 * returns p-norm of a vector (euclidean by default). `Infinity` is a max norm
 * @param {number[]} v vector
 * @param {number} [p] exponent in the `[0..Infinity]` range
 */
export function lpnorm(v, p = 2) {
    if (p === Infinity) return Math.max(...v.map(Math.abs));
    return v.reduce((acc, v) => acc + Math.abs(v) ** p, 0) ** (1 / p);
}

/**
 * @param {number[]} v1
 * @param {number[]} v2
 * @param {number} [pNorm] param for {@link lpnorm}, default is `2` i.e. euclidean
 * @returns {number} distance between two vectors
 */
export function distance(v1, v2, pNorm = 2) {
    return lpnorm(_.zipWith(v1, v2, (xi, Ei) => xi - Ei), pNorm);
}

/**
 * @typedef {[r: number, c: number]} RC 2d index as an array of [row, column]
 */

/**
 * @template T
 * @typedef {{[r: number]: {[c: number]: T}}} Array2D
 */

/**
 * @template T
 * @param {Array2D<T>} array 
 * @param {number} [padLength]
 * @param {string} [joinString]
 * @returns 
 */
export function toString2D(
    array,
    padLength = Math.max(...Object.values(array).flatMap(Object.values).map(e => e.toString().length)),
    joinString = ''
) {
    const padPrint = (e) => e.toString().padEnd(padLength, ' ');
    return Object.values(array).map(tx => Object.values(tx).map(padPrint).join(joinString)).join('\n');
}


/**
 * @param {RC} rc
 * @param {DirectionDeltas} [directions]
 * @yields {{rc: RC, dir: keyof DirectionDeltas}} neighbors in cardinal NESW directions
 */
export function* neighbors2D(rc, directions = CARDINALS) {
    for (const k in directions)
        yield { rc: [rc[0] + directions[k][0], rc[1] + directions[k][1]], dir: k };
}

/**
 * @template T
 * @param {Array2D<T>} t 
 * @returns {Iterable<{e: T, rc: RC}>}
*/
export function* iter2D(t) {
    for (const r in t)
        for (const c in t[r])
            yield { e: t[r][c], rc: [+r, +c] };
}

/**
 * @template T
 * @template R
 * @param {Array2D<T>} t 
 * @param {(e: T, rc: RC) => R} f 
 * @returns {Array2D<R>}
 */
export function map2D(t, f) {
    return Object.fromEntries(Object.entries(t).map(([r, tx]) => [r, Object.fromEntries(Object.entries(tx).map(([c, e]) => [c, f(e, [+r, +c])]))]));
}


/**
 * 
 * @param {RC} rc current position
 * @param {Direction} dir neigbour in this direction
 * @param {DirectionDeltas} [directions]
 * @returns {RC} neighbor's position
 */
export function neighbour(rc, dir, directions = DIRECTIONS) {
    return [rc[0] + DIRECTIONS[dir][0], rc[1] + DIRECTIONS[dir][1]];
}

/**
 * @template T
 * @param {Array2D<T>} t
 * @param {(erc: {e: T, rc: RC}) => boolean} pred 
 * @returns {{e: T, rc: RC}|{e: undefined, rc: undefined}}
 */
export function find2D(t, pred) {
    for (const erc of iter2D(t))
        if (pred(erc))
            return erc;
    return { e: undefined, rc: undefined };
}