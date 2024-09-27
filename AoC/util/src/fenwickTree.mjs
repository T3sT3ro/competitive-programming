/**
 * Fenwick tree or BIT is used for computing prefix sums and doing queries and updates on it in O(log n)
 * https://cp-algorithms.com/data_structures/fenwick.html
 */
export default class Fenwick {
    #tree;

    /**
     * creates fenwick tree of given size or from given array in O(n)
     * @param {number|number[]} values size of the tree (will be all zeroes) or array to create the tree from
     */
    constructor(values) {
        if (typeof values === "number") {
            this.#tree = new Array(values).fill(0);
        } else if (Array.isArray(values)) {
            this.#tree = new Array(values.length).fill(0);
            for (let i = 0; i < values.length; i++) {
                this.#tree[i] += values[i];
                let r = i | (i + 1)
                if (r < values.length) this.#tree[r] += this.#tree[i];
            }
        } else throw new Error("Invalid argument");
    }


    /**
     * adds value at given index in O(log n)
     * @param {number} index 
     * @param {number} value 
     */
    add(index, value) {
        for (; index < this.#tree.length; index |= index + 1)
            this.#tree[index] += value;
    }

    /**
     * computes sum of range [0, r] in O(log n)
     * @param {number} r 
     * @returns {number}
     */
    sum(r) {
        let sum = 0;
        for (; r >= 0; r = (r & (r + 1)) - 1)
            sum += this.#tree[r];
        return sum;
    }

    /**
     * computes sum of range [l, r] in O(log n)
     * @param {number} l 
     * @param {number} r 
     * @returns {number}
     */
    rangeSum(l, r) {
        return this.sum(r) - this.sum(l - 1);
    }
}