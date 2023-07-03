export function gcd(...args) {
    if (args.length == 1) return args[0];
    if (args.length == 2) {
        let [a, b] = args;
        while (b) [a, b] = [b, a % b];
        return a;
    }
    return args.reduce((a, b) => gcd(a, b));
}

export function lcm(...args) {
    if (args.length == 1) return args[0];
    if (args.length == 2) {
        return args[0] * args[1] / gcd(...args);
    };
    return args.reduce((a, b) => lcm(a, b));
}