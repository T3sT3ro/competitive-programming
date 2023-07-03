// util when I copy-paste the code from browser, where I use jquery to extract t.
import { readFileSync } from 'fs';

/**
 * 
 * @param {string} s 
 * @returns {{textContent: string}}
 */
export default function $(s) {
    return {textContent: readFileSync(typeof document === 'undefined' ? s : 'pre', 'utf8')};
}