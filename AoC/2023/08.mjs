import $ from '../in.mjs';
import _ from 'lodash';
import 'core-js/es/object/group-by.js';
import { lcm } from '../util/src/util.mjs';
// --- browser devtools cutoff ---
const t = $('IN/08').textContent.trim()
    .split('\n\n');

const instr = t[0];
const tree = Object.fromEntries(t[1].split('\n').map(tx => {
    let [, n, l, r] = tx.match(/(\w+) = \((\w+), (\w+)\)/);
    return [n, { L: l, R: r }];
}));

function getSteps(state = 'AAA', pred = (state) => state != 'ZZZ') {
    let steps = 0;
    while (pred(state))
        state = tree[state][instr[steps++ % instr.length]];
    return steps;
}
console.log(getSteps());

// assumption - each cycle has only one accepting state and A -> Z path is the cycle's length.
// This wouldn't be so simple if cycles didn't begin in A or had multiple unevenly spaced accepting Z states.
// then a chinese remainder theorem would be needed to find the cycle length.
let steps = Object.keys(tree).filter(k => k.at(-1) == 'A').map(k => getSteps(k, s => s.at(-1) != 'Z'));
console.log(lcm(...steps));
