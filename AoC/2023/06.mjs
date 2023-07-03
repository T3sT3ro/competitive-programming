import $ from '../in.mjs';
import _ from 'lodash';
import "core-js/es/object/group-by.js";
// --- browser devtools cutoff ---
const t = $('IN/06').textContent.trim()
    .split('\n');

/** @type {[number, number][]} */
const races = _.zip(...t.map(tx => [...tx.matchAll(/\d+/g)].map(m => +m)))

// fastest to code
function twoPointers([raceTime, record]) {
    let [s, e] = [0, raceTime];
    while (record >= (raceTime - s) * s) s++;
    while (record >= (raceTime - e) * e) e--;
    return e - s + 1;

}

// most performant
function quadratic([raceTime, record]) {
    // given a function distance(x) = x * (raceTime - x) > record, aka inverted parabola
    let x1 = (raceTime - Math.sqrt(raceTime ** 2 - 4 * record)) / 2;
    let x2 = (raceTime + Math.sqrt(raceTime ** 2 - 4 * record)) / 2;
    return Math.floor(x2) - Math.ceil(x1) + 1;
}

let findWays = quadratic;

console.log(races.map(findWays).reduce((a, b) => a * b));
console.log(findWays(t.map(tx => +tx.replaceAll(/[^\d]/g, ''))));