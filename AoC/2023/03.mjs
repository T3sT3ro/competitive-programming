import $ from '../in.mjs';
import _ from 'lodash';
import "core-js/es/object/group-by.js";
// --- browser devtools cutoff ---
const t = $('IN/03').textContent.trim()
    .split('\n');

/** @type {{[number]: string}[]} */
let numbers = t.map(l => [...l.matchAll(/(\d+)/g)].reduce((positions, m) => ({ [m.index]: m[1], ...positions }), {}));
let symbols = t.map(l => [...l.matchAll(/([^.\d])/g)].reduce((positions, m) => ({ [m.index]: m[1], ...positions }), {}));

let parts = [];
let possiblyGears = {};
for (let r in numbers) { // for all found numbers 
    for (let c in numbers[r]) {
        [r, c] = [+r, +c];
        for (let sR = r - 1; sR <= r + 1; sR++) { // search for symbols around
            for (let sC = c - 1; sC <= c + numbers[r][c].length; sC++) {
                if (symbols[sR]?.[sC] !== undefined) {
                    parts.push([r, c]);
                    if(symbols[sR][sC] === '*') 
                        possiblyGears[[sR, sC]] = [...(possiblyGears[[sR, sC]] || []), +numbers[r][c]];
                }
            }
        }
    }
}
console.log(_.uniqWith(parts, _.isEqual).reduce((a, [r, c]) => a + +numbers[r][c], 0));
console.log(_.values(possiblyGears).filter(v => v.length === 2).reduce((a, v) => a + v[0] * v[1], 0));