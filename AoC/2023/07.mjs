import $ from '../in.mjs';
import _ from 'lodash';
import "core-js/es/object/group-by.js";
// --- browser devtools cutoff ---
const t = $('IN/07').textContent.trim()
    .split('\n')
    .map(line => line.split(' '));

/**  
 * @param {string} hand 
 * @returns {keyof kinds}
*/
function kind(hand, countJokers = false) {
    // five of a kind => 0;
    let G = Object.groupBy(countJokers ? hand.replaceAll('J', '') : hand, _.identity);
    let J = countJokers ? hand.match(/J/g)?.length ?? 0 : 0;
    let [k1, k2] = _.entries(G).map(([k, v]) => v.length).toSorted().toReversed();
    if ((k1 || 0) + J === 5) return 'five';
    if (k1 + J === 4) return 'four';
    if (k1 + J === 3 && k2 === 2) return 'full'; // handles aabbJ
    if (k1 + J === 3) return 'three';
    if (k1 === 2 && k2 === 2) return 'two';
    if (k1 + J === 2) return 'one';
    return 'high';
}


const kinds = { five: 0, four: 1, full: 2, three: 3, two: 4, one: 5, high: 6, };
function compare(hand1, hand2, withJokers = false) {
    const [k1, k2] = [hand1, hand2].map(h => kind(h, withJokers));
    const S = withJokers ? 'AKQT98765432J' : 'AKQJT98765432';
    if (k1 != k2) return kinds[k1] - kinds[k2];
    for (let i = 0; i < 5; i++) { // same kind
        let c1 = hand1[i];
        let c2 = hand2[i];
        if (c1 != c2) return S.indexOf(c1) - S.indexOf(c2);
    }
    throw new Error('same hand');
}

let hands = t.map(h => [...h, kind(h[0]), kind(h[0], true)]);
let sortedHands = hands.toSorted((p1, p2) => compare(p1[0], p2[0]));
console.log(_.sum(sortedHands.toReversed().map((p, i) => +p[1] * (i + 1))));

let sortedJokerHands = hands.toSorted((p1, p2) => compare(p1[0], p2[0], true));
console.log(_.sum(sortedJokerHands.toReversed().map((p, i) => +p[1] * (i + 1))));