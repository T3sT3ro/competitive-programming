import $ from '../in.mjs';
import _ from 'lodash';
import "core-js/es/object/group-by.js";
// --- browser devtools cutoff ---
const t = $('IN/05').textContent.trim()
    .split('\n\n');

let seeds = t[0].split(" ").slice(1).map(id => +id);

/** @typedef {{dst: number, src: number, n: number}} entry */
/** @typedef {entry[] & {next: map, name: string}} map */
/** @returns {map} */
function createMaps(description) {
    let root = [];
    let [current, previous] = [root, undefined];
    for (const l of description) {
        let lines = l.split('\n');
        Object.defineProperty(current, 'name', { value: lines.shift().split(" ")[0], enumerable: false });
        if (previous != undefined)
            Object.defineProperty(previous, 'next', { value: current, enumerable: false });
        for (const [dst, src, n] of lines.map(l => l.split(" ")))
            current.push({ dst: +dst, src: +src, n: +n });
        current.sort((a, b) => a.src - b.src);
        [previous, current] = [current, []];
    }
    return root;
}
let maps = createMaps(t.slice(1));

/**
 * 
 * @param {number} id current id
 * @param {map} map id mappings
 * @returns 
 */
function findLocation(id, map) { // binsearch on such small arrrays is not worth it
    if (map == undefined) return id;
    let found = map.find(e => e.src <= id && id < e.n + e.src);
    return findLocation(found === undefined ? id : found.dst + id - found.src, map.next);
}

console.log(_.min(seeds.map(s => findLocation(s, maps))));

/** 
 * @typedef {{type: 'rs'|'re'|'me', id: number}} eventRsReMe
 * @typedef {{type: 'ms', id: number, delta: number}} eventMs
 * @typedef {{src: number, n: number}} range
 * @param {range[]} ranges 
 * @param {map} maps
*/
function findLocationRanges(ranges, maps) {
    ranges.sort((a, b) => a.src - b.src);

    if (maps == undefined) return ranges;
    // assumptions: there are no overlapping ranges, map start/end events of different ranges don't overlap
    /** @type {(eventRsReMe|eventMs)[]} */
    let events = ranges.flatMap((r, i) => [
        { type: 'rs', id: r.src },
        { type: 're', id: r.src + r.n }
    ]);
    // @ts-ignore
    events.push(...maps.flatMap(e => [
        { type: 'ms', id: e.src, delta: e.dst - e.src },
        { type: 'me', id: e.src + e.n }
    ]));
    const eventOrder = { re: 0, rs: 1, me: 2, ms: 3 };
    events.sort((a, b) => a.id - b.id || eventOrder[a.type] - eventOrder[b.type]);
    let newRanges = [];
    let rs = undefined; // range start
    let delta = 0; // mapping ranges are disjoint
    for (const e of events) {
        if (e.type == 'rs') {
            rs = e.id;
        } else if (e.type == 're') {
            newRanges.push({ src: rs + delta, n: e.id - rs });
            rs = undefined;
        } else if (e.type == 'ms') {
            if (rs != undefined && e.id - rs > 0) {
                newRanges.push({ src: rs + delta, n: e.id - rs });
                rs = e.id;
            }
            delta = e.delta;
        } else if (e.type == 'me') {
            if (rs != undefined && e.id - rs > 0) {
                newRanges.push({ src: rs + delta, n: e.id - rs });
                rs = e.id;
            }
            delta = 0;
        }
    }
    return findLocationRanges(newRanges, maps.next);
}

let seedRanges = [...t[0].matchAll(/(\d+) (\d+)/g)]
    .map(m => ({ src: +m[1], n: +m[2] }));
console.log(findLocationRanges(seedRanges, maps)[0].src);