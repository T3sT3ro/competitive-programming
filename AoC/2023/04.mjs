import $ from '../in.mjs';
import _ from 'lodash';
import "core-js/es/object/group-by.js";
// --- browser devtools cutoff ---
const t = $('IN/04').textContent.trim()
    .split('\n')
    .map(l => l.split(':')[1].split('|').map(sx => [...sx.matchAll(/(\d+)/g)].map(m => +m[1])));

let d = t.map(([winning, actual]) => _.intersection(winning, actual).length);

console.log(_.sum(d.map(n => n == 0 ? 0 : 1 << (n - 1))));

let cards = Array(d.length).fill(1);
for (let i = 0; i < d.length; i++) {
    for (let j = 0, n = d[i]; j < n; j++)
        cards[i + j + 1] += cards[i];
}

console.log(_.sum(cards));