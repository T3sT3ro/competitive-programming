import $ from '../in.mjs';
import _ from 'lodash';
// --- browser devtools cutoff ---
const t = $('IN/01').textContent.trim()
    .split('\n');

console.log(t.map(l => l.match(/.*?(\d)/)[1] + l.match(/.*(\d)/)[1]).reduce((a, b) => +a + +b, 0))

let names = 'one|two|three|four|five|six|seven|eight|nine|zero';
let lazy = new RegExp(`.*?(${names}|\\d)`);
let eager = new RegExp(`.*(${names}|\\d)`);
let values = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
let parse = x => +x == x ? x : ""+values.indexOf(x); 

console.log(t.map(l => parse(l.match(lazy)[1]) + parse(l.match(eager)[1])).reduce((a, b) => +a + +b, 0));