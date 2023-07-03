import $ from '../in.mjs';
import _ from 'lodash';
import FastPriorityQueue from 'fastpriorityqueue';
// --- browser devtools cutoff ---
const t = $('IN/12').textContent.trim()
    .split('\n')
    .map(r => r.split(''));


function findNested(c) {
    let r = t.findIndex(r => r.includes(c));
    c = t[r].indexOf(c);
    return [r, c];
}

let S = findNested('S');
t[S[0]][S[1]] = 'a';
let E = findNested('E');
t[E[0]][E[1]] = 'z';

function Dijkstra(S, E, canPass = (h, nh) => nh >= h - 1) {
    let d = { [S]: 0 };
    let Q = new FastPriorityQueue((p1, p2) => (d[p1] ?? Infinity) - (d[p2] ?? Infinity));

    Q.add(S);
    function* neighbors([x, y]) {
        let deltas = [[0, 1], [0, -1], [1, 0], [-1, 0]];
        let h = t[x][y].charCodeAt();
        for (const [dx, dy] of deltas) {
            let [nx, ny] = [x + dx, y + dy];
            let nh = t[nx]?.[ny]?.charCodeAt();
            if (nh !== undefined && canPass(h, nh))
                yield [nx, ny];
        }
    }

    while (!Q.isEmpty()) {
        let p = Q.poll();
        for (const n of neighbors(p)) {
            if (d[p] + 1 < (d[n] || Infinity)) {
                d[n] = d[p] + 1;
                Q.add(n);
            }
        }
    }
    return d;
}

// todo: use single pass dijkstra
let D = Dijkstra(S, E, (h, nh) => nh <= h + 1);
console.log(D[E]);

// From End to Start calculates all starting points at once
let fromE = Dijkstra(E, S);
let min = _(fromE).pickBy((v, k) => k.match(/,0/)).values().min();
console.log(min);

// DEBUG (distances, point)
function toSymbol(h) { 
    return isNaN(h) ? '_' : h % 10 
}
console.log(t.map((r, ri) => r.map((c, ci) => toSymbol(fromE[[ri, ci]])).join('')).join('\n'));
