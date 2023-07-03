import $ from '../in.mjs';
import _ from 'lodash';
// --- browser devtools cutoff ---
/** @type {{red: number, green: number, blue: number}[][]} */
const t = $('IN/02').textContent.trim()
    .split('\n')
    .map(l => l.split(';')
        .map(s => ({
            red: +(s.match(/(\d+) red/)?.[1] || 0),
            green: +(s.match(/(\d+) green/)?.[1] || 0),
            blue: +(s.match(/(\d+) blue/)?.[1] || 0)
        })))

const counts = { red: 12, green: 13, blue: 14 };

console.log(
    t.map((game, idx) =>
        game.every(hand => Object.keys(hand).every(k => hand[k] <= counts[k])) ? idx + 1 : 0
    ).reduce((a, b) => a + b)
);

console.log(
    t.map(game => {
        let mins = game.reduce((mins, c) => ({
            red: Math.max(mins.red || 0, c.red),
            green: Math.max(mins.green || 0, c.green),
            blue: Math.max(mins.blue || 0, c.blue)
        }));

        return mins.red * mins.green * mins.blue;
    }).reduce((a, b) => a + b)
);