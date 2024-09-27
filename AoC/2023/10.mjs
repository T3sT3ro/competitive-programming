import $ from '../in.mjs';
import _ from 'lodash';
import 'core-js/es/object/group-by.js';
import 'core-js/actual/iterator/index.js';
import { find2D, map2D, neighbors2D, pathfind, rotateDir, toString2D, neighbour, DIRECTIONS }
    from '../util/src/util.mjs';

// --- browser devtools cutoff ---
const mappings = [
    "S.-|L7FJ",
    "S.─│└┐┌┘"
];

let t = $('IN/10').textContent.trim()
    .replaceAll(/./g, c => mappings[1][mappings[0].indexOf(c)])
    .split('\n');

/** @type {{[dir: string]: string}} */
const canEnterInDir = {
    E: "─┐┘",
    W: "─┌└",
    N: "│┐┌",
    S: "│┘└",
};

/**  @type {import('../util/src/util.mjs').RC} */
const { rc: startPos } = find2D(t, m => m.e === 'S');
const startOutputs = [...neighbors2D(startPos)]
    .filter(({ dir, rc }) => canEnterInDir[dir].includes(_.get(t, rc)))
    .map(({ dir, rc }) => dir).toSorted().join('');

// keys are sorted
const pipeConnections = { "─": "EW", "│": "NS", "┌": "ES", "┐": "SW", "└": "EN", "┘": "NW" };
const startSymbol = Object.keys(pipeConnections).find(k => pipeConnections[k] == startOutputs);

// replace S to disambiguate the symbol
t = map2D(t, (e, rc) => e === 'S' ? startSymbol : e);

function* validPipeNeighbors(current) {
    yield* pipeConnections[_.get(t, current)]
        .split('')
        .map(dir => neighbour(current, dir));
}

const { D } = pathfind(startPos, { neighborEmitter: validPipeNeighbors });

console.warn(toString2D(t, 0));
console.log(Math.max(...Object.values(D)));

// we walk the pipes in certain direction until we start again. track the turning number at the same time (CCW = 1)
// add adjacent areas to the left and right to the respective arrays
function walkPipes(t, start) {
    // it is a mapping of the current path to map of previous direction to new direction + area candidates + turning number
    const stateMaps = {
        "│": {
            N: { dir: "N", l: ["W"], r: ["E"], turn: 0 },
            S: { dir: "S", l: ["E"], r: ["W"], turn: 0 },
        },
        "─": {
            E: { dir: "E", l: ["N"], r: ["S"], turn: 0 },
            W: { dir: "W", l: ["S"], r: ["N"], turn: 0 },
        },
        "┌": {
            N: { dir: "E", l: ["N", "NW", "W"], r: ["SE"], turn: 1 },
            W: { dir: "S", r: ["N", "NW", "W"], l: ["SE"], turn: -1 },
        },
        "┐": {
            N: { dir: "W", r: ["N", "NE", "E"], l: ["SW"], turn: -1 },
            E: { dir: "S", l: ["N", "NE", "E"], r: ["SW"], turn: 1 },
        },
        "└": {
            S: { dir: "E", r: ["S", "SW", "W"], l: ["NE"], turn: -1 },
            W: { dir: "N", l: ["S", "SW", "W"], r: ["NE"], turn: 1 },
        },
        "┘": {
            S: { dir: "W", l: ["S", "SE", "E"], r: ["NW"], turn: 1 },
            E: { dir: "N", r: ["S", "SE", "E"], l: ["NW"], turn: -1 },
        },
    };

    let [L, R] = [[], []]; // areas on the left and right of the pipe
    let turningNumber = 0; // -1 for CCW, 1 for CW
    let dir = rotateDir(pipeConnections[_.get(t, start)][0], 4); // flip direction as if we just came throug hit 
    let current = start;
    do {
        let { dir: newDir, l, r, turn } = stateMaps[_.get(t, current)][dir];
        turningNumber += turn;
        L.push(...l.map(nDir => neighbour(current, nDir)).filter(n => _.get(t, n) == '.'));
        R.push(...r.map(nDir => neighbour(current, nDir)).filter(n => _.get(t, n) == '.'));
        dir = newDir;
        current = neighbour(current, newDir);
    }
    while (current.toString() != start.toString());
    let areaCandidates = turningNumber < 0 ? L : R;
    let visited = {};
    while (areaCandidates.length > 0) {
        let candidate = areaCandidates.pop();
        if (visited[candidate]) continue;
        visited[candidate] = true;
        for (const n of neighbors2D(candidate, DIRECTIONS)) {
            if (_.get(t, n.rc) == '.' && !visited[n.rc])
                areaCandidates.push(n.rc);
        }
    }
    return Object.keys(visited).length;
}
let sanitized = map2D(t, (e, rc) => D[rc] !== undefined ? e : '.');
console.warn(toString2D(sanitized))
console.log(walkPipes(sanitized, startPos));