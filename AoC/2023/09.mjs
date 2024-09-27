import $ from '../in.mjs';
import _ from 'lodash';
import 'core-js/es/object/group-by.js';
import { toString2D } from '../util/src/util.mjs';
// --- browser devtools cutoff ---
const t = $('IN/09').textContent.trim()
    .split('\n')
    .map(tx => tx.split(/\s+/).map(Number));

function findDP(t) {
    const DP = Array(t.length+1).fill().map(() => Array(t.length+1).fill(0));
    DP[0] = t.map(_.identity);
    for(let r = 1; r < t.length; r++) {
        for(let c = 0; c < t.length - r; c++) {
            DP[r][c] = DP[r-1][c+1] - DP[r-1][c];
        }
    }
    return DP;
}

function extrapolateForward(DP) {
    let n = DP.length - 1;
    let last = 0;
    for(let i = n - 1, c = n - i; i >= 0; i--, c++) {
        last = last + DP[i][c-1];
    }
    // console.warn(toString2D(DP));
    return last;
}

function extrapolateBackward(DP) {
    let n = DP.length - 1;
    let last = 0;
    for(let i = n - 1; i >= 0; i--) {
        last = DP[i][0] - last;
    }
    // console.warn(toString2D(DP));
    return last;
}

let DPs = t.map(findDP);
console.log(_.sum(DPs.map(extrapolateForward)));
console.log(_.sum(DPs.map(extrapolateBackward)));