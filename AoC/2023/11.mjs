import $ from '../in.mjs';
import _ from 'lodash';
import 'core-js/es/object/group-by.js';
import 'core-js/actual/iterator/index.js';
import { neighbors2D as neighbours2D, pathfind } from '../util/src/util.mjs';
import FenwickTree from '../util/src/fenwickTree.mjs';
// --- browser devtools cutoff ---
const t = $('IN/11').textContent.trim()
    .split('\n');

const galaxies = t
    .flatMap((l, r) => l.split('')
        .map((x, c) => x === '#' ? [r, c] : undefined)
        .filter(x => x));

const empty = {
    rows: _.toPlainObject(Array(t.length).fill(1)),
    cols: _.toPlainObject(Array(t[0].length).fill(1)),
}

for (const [r, c] of galaxies) {
    delete empty.rows[r];
    delete empty.cols[c];
}

function sumDistances(galaxies, empty, rate) {
    const fenwickRows = new FenwickTree(t.length);
    const fenwickCols = new FenwickTree(t[0].length);

    for (const r in empty.rows) fenwickRows.add(+r, 1);
    for (const c in empty.cols) fenwickCols.add(+c, 1);

    let totalDistances = 0
    for (let g1 = 0; g1 < galaxies.length; g1++) {
        for (let g2 = 0; g2 < g1; g2++) {
            const [r1, c1] = galaxies[g1];
            const [r2, c2] = galaxies[g2];
            let [rmin, rmax] = [Math.min(r1, r2), Math.max(r1, r2)];
            let [cmin, cmax] = [Math.min(c1, c2), Math.max(c1, c2)];
            let rowExpanders = fenwickRows.rangeSum(rmin, rmax);
            let colExpanders = fenwickCols.rangeSum(cmin, cmax);

            let rowDistance = rmax - rmin + rowExpanders * (rate-1);
            let colDistance = cmax - cmin + colExpanders * (rate-1);

            totalDistances += rowDistance + colDistance;
        }
    }
    return totalDistances;
}

console.log(sumDistances(galaxies, empty, 2));
console.log(sumDistances(galaxies, empty, 1000000));
/* let reached = {};

function getCostFunction(multiplier) {
    return (from, [r, c]) => {
        let emptyCount = +empty.rows[r] + +empty.cols[c];
        return emptyCount ? emptyCount * multiplier : 1;
    }
}

for (const galaxy of galaxies) {
    let { D, P } = pathfind(galaxy,
        {
            neighborEmitter: (current) => neighbours2D(current).map(r => r.rc).filter(rc => _.get(t, rc) !== undefined),
            processAndTerminate(current, D) {
                let isGoal = _.get(t, current) === '#' && !_.isEqual(galaxy, current);
                if(isGoal) reached[current] = D[current];
                return isGoal;
            },
            costFunction: getCostFunction(2),
            trackParents: true,
        });
    console.log(D);
}
*/
