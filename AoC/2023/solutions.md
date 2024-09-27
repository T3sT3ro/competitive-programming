# Day 7

Determining the strength of a hand in the first case. 

# Day 8

Quick preprocessing shows that cycle periods are simple and of length 1. Turns out lowest common multiple of all cycle periods is enough. If it were not, we could use Chinese remainder theorem to find the first time when all cycles are at the same point (over cartesian product of possible cycle offsets).

# Day 9

Nothing a simple `O(n^2)` dynamic programming algorithm can't solve. Make something like a pascal's triangle where first row is the input. Then run back up from the last rows.

Explicit formula could be found, but it's not worth it.

# Day 10

preprocess: O(n^2)
part1: O(n^2 log n)

1. This was a bit though due to finickiness of the input. First I preprocessed it to use box characters to pretty print it in terminal, found S character and replaced it with it's appropriate pipe
2. then, I defined some rules for pipe traversal depending on the pipe type and direction
3. finally I run my already implemented dijkstra from S to calculate distances
    - I used custom neighbour emitter to generate neigbours based on the current pipe type and direction
4. then I chose a maximum of those distances and printed it for part 1
5. for part two I first preprocessed the input so that any node my previous dijkstra didn't visit becomes `.` (to get rid of free-floating pipes)
6. then, I wrote a state machine, that basically sends a little mouse on an adventure along the pipes until it reaches start once again.
   - transition logic takes into account current facing direction and current pipe shape to give new direction
   - for any pipe processed, I store a list of candidate positions on mouse left and right side.
   - In the state machine I also track the turning number. If mouse turns left, it is decremented, if it turns right, it's incremented. This way, after the mouse reaches the start I know in which way does the loop turn and on which side is "the inside" - on the left if it's `-1` and on the right if it's `1`.
7. when the little mouse reaches the start, I run a simple floodfill over `.` tiles for all positions in the appropriate candidates list counting the area.

The complicated and messy logic is inside the state machine function, because having to deal with directions, offsets etc is never easy.

Another aproach could be a rendering algorithm: scan top to bottom, and for every encountered (appropriate) path tile of the main loop, toggle the `inside` flag anc count any tile that isn't a part of the main loop. This would be `O(n^2)` and but would be much simpler to implement (only special case would probably be `-` to avoid flipping).

# Day 11

preprocess: O(n^2)
part1: O(n^2 log n)
part2: same

It is quite simple when you think about it. 

1. Preprocessing: only empty rows and columns are interesting → find them and store them Store their indexes as keys in objects to get quick lookup if they are empty.
2. Assume the galaxy is not expanding. Distance between two galaxies is manhattan distance. When we account for expanding rows and column, whenever we pass a row or a column instead of making `1` step we make `expansionFactor` steps. So now we just have to find a manhattan distance between two galaxies and account for expanded space by subtracting (already counted) `1` distance and add instead add `expansionFactor` steps for any crossed row or column.
    - To do that, we want to quickly find "how many expanded rows/columns are between galaxies". This is the same as counting expanded rows and columns separately. Fenwick tree (aka BIT, Binary Indexed Tree) is a simple and fast (`O(log n)` operations) data structure that supports operations of `findCount(left, right)` and `addCount(idx, value)`. We will use simple 2 separate Fenwick trees, one for rows and one for columns.
3. For any empty row/column, add it to Fenwick tree with `add(idx, 1)`.
4. Now, for any pair of galaxies `g1`, `g2` `g1 < g2`, we will find count their distance as `manhattan(g1, g2) - empties + empties * expansionFactor`, which is basically `manhattan(g1, g2) + findCount(g1, g2) * (expansionFactor - 1)` (remember to account for `g1 < g2` when using their rows/columns in BIT query).
5. We can solve part 1 and 2 with the same code using different expansion factors.
   
# Day 12

Today is the day of logic images aka nonograms. I wrote a solver for them once upon a time (for 2D version of the problem). Here we have a simple case where problem space (row) is already narrowed down. We just have to 