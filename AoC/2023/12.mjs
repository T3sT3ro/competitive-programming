import $ from '../in.mjs';
import _ from 'lodash';
import 'core-js/es/object/group-by.js';
import 'core-js/actual/iterator/index.js';
// --- browser devtools cutoff ---
const t = $('IN/12').textContent.trim()
    .split('\n');

let entries = t.map(tx => tx.match(/([?.#]+) ([0-9,]+)/)).map(m => [m[1], m[2].split(',').map(Number)]);

// finds possible ways of solving nonogram row
function findPossibilities([row, desc]) {
    const onesOfLength = (n) => (1 << n) - 1;
    const wiggleRoom = row.length - desc.reduce((a, b) => a + b, 0) - Math.max(0, desc.length - 1);
    let mustBe0 = parseInt(row.replaceAll(/[?#]/g, '0').replaceAll('.', '1'), 2);
    let mustBe1 = parseInt(row.replaceAll(/[?.]/g, '0').replaceAll('#', '1'), 2);
    let isEmpty = parseInt(row.replaceAll(/[.#]/g, '0').replaceAll('?', '1'), 2);
}

findPossibilities(entries[0]);

console.log(entries);