
/// Preprocess in O(n log n) time
/// @param {number[]} arr
/// @return {number[][]}
function preprocess(arr) {
    let rmq = [arr];
    for (let k = 1, len = 1 << k; len <= arr.length; k++, len = 1 << k) {
        rmq[k] = [];
        for (let i = 0; i + len - 1 < arr.length; i++)
            rmq[k][i] = Math.min(rmq[k - 1][i], rmq[k - 1][i + (len >> 1)]);
    }
    return rmq;
}

/// Query in O(1) time
/// @param {number[][]} rmq
/// @param {number} l
/// @param {number} r
/// @return {number}
function query(rmq, l, r) {
    let k = Math.floor(Math.log2(r - l + 1));
    return Math.min(rmq[k][l], rmq[k][r - (1 << k) + 1]);
}

let arr = [1, 2, 3, 4, 5, 6, 7, 8];
let rmq = preprocess(arr);
console.log(query(rmq, 0, 7)); // [1..8]
console.log(query(rmq, 1, 4)); // [2..5]
console.log(query(rmq, 3, 5)); // [4..6]
console.log(query(rmq, 2, 6)); // [3..7]
console.log(query(rmq, 0, 0)); // [1]


// ---------------- O(n) preprocess

/// Preprocess in O(n) time using block size b and bit hacks (incomplete)
/// @param {number[]} arr
/// @return {number[][]}
function preprocess(arr) {
    let b = Math.floor(Math.sqrt(arr.length)); // block size
    let rmq = [arr];
    for (let i = 0; i < arr.length; i++) {
        if (i % b == 0) rmq.push([arr[i]]);
        else rmq[rmq.length - 1].push(Math.min(rmq[rmq.length - 1][i - b], arr[i]));
    }
}