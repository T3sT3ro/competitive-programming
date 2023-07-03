import $ from '../in.mjs';
import _ from 'lodash';
import "core-js/es/object/group-by.js";
// --- browser devtools cutoff ---
/** @type {{cmd:"turn on"|"turn off"|"toggle", start:[number, number], end: [number, number]}[]} */
let t = $('IN/06').textContent.trim()
    .split('\n')
    .map(l => l.match(/(turn on|turn off|toggle) (\d+),(\d+) through (\d+),(\d+)/))
    .map(([_, cmd, r1, c1, r2, c2]) => ({ cmd, start: [+r1, +c1], end: [+r2, +c2] }));

let quadTree = {}; // lazy quad tree, zeroes are implicit, only operations are stored

function insert(cmd, areaStart, areaEnd, nodeStart = [0, 0], nodeEnd = [999, 999], idx = 0) {
    let [asr, asc] = areaStart;
    let [aer, aec] = areaEnd;
    let [nsr, nsc] = nodeStart;
    let [ner, nec] = nodeEnd;
    let [q1, q2, q3, q4] = [idx * 4 + 1, idx * 4 + 2, idx * 4 + 3, idx * 4 + 4];

    if (quadTree[idx] != undefined) { // lazy update
        quadTree[q1] = quadTree[q2] = quadTree[q3] = quadTree[q4] = quadTree[idx];
        quadTree[idx] = undefined;
    }

    if (asr > ner || aer < nsr || asc > nec || aec < nsc) return; // no overlap
    if (asr <= nsr && aer >= ner && asc <= nsc && aec >= nec) { // area covers node
        quadTree[idx] ??= 0;
        if (cmd == 'turn on') quadTree[idx] = 1;
        if (cmd == 'turn off') quadTree[idx] = 0;
        if (cmd == 'toggle') quadTree[idx] = 1 - quadTree[idx];
        return;
    }
    let [mr, mc] = [nsr + ((ner - nsr) >>> 1), nsc + ((nec - nsc) >>> 1)]; // mid point
    // insert into children by quadrants
    let [q1s, q1e] = [[nsr, nsc], [mr, mc]];
    let [q2s, q2e] = [[nsr, mc + 1], [mr, nec]];
    let [q3s, q3e] = [[mr + 1, nsc], [ner, mc]];
    let [q4s, q4e] = [[mr + 1, mc + 1], [ner, nec]];

    insert(cmd, areaStart, areaEnd, q1s, q1e, q1);
    insert(cmd, areaStart, areaEnd, q2s, q2e, q2);
    insert(cmd, areaStart, areaEnd, q3s, q3e, q3);
    insert(cmd, areaStart, areaEnd, q4s, q4e, q4);
}

for (const i in t) {
    insert(t[i].cmd, t[i].start, t[i].end);
}

function countLights(nodeStart = [0, 0], nodeEnd = [999, 999], idx = 0) {
    let [nsr, nsc] = nodeStart;
    let [ner, nec] = nodeEnd;
    let [q1, q2, q3, q4] = [idx * 4 + 1, idx * 4 + 2, idx * 4 + 3, idx * 4 + 4];

    if (quadTree[idx] != undefined) { // lazy update
        quadTree[q1] = quadTree[q2] = quadTree[q3] = quadTree[q4] = quadTree[idx];
        quadTree[idx] = undefined;
    }

    if (nsr == ner && nsc == nec) return quadTree[idx] ?? 0; // leaf
    let [mr, mc] = [nsr + ((ner - nsr) >>> 1), nsc + ((nec - nsc) >>> 1)]; // mid point
    // count children by quadrants
    let [q1s, q1e] = [[nsr, nsc], [mr, mc]];
    let [q2s, q2e] = [[nsr, mc + 1], [mr, nec]];
    let [q3s, q3e] = [[mr + 1, nsc], [ner, mc]];
    let [q4s, q4e] = [[mr + 1, mc + 1], [ner, nec]];

    return countLights(q1s, q1e, q1)
        + countLights(q2s, q2e, q2)
        + countLights(q3s, q3e, q3)
        + countLights(q4s, q4e, q4);
}
