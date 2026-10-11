export class SparseSet {
    private size: number = 0;
    private maxValue: number = -1;
    private denseArray: number[] = [];
    private sparseArray: number[] = [];

    private validateArgument(value: number): void {
        if (!Number.isInteger(value) || value < 0 || value > this.maxValue) 
            throw new Error("Value must be a non-negative integer within the range of 0 to maxValue");
    }

    /**
     * Construct a sparse set for a values in range [0, maxValue]. O(maxValue) space complexity.
     */
    public constructor(maxValue: number) {
        this.maxValue = maxValue;
        this.sparseArray = new Array(maxValue + 1);
        this.denseArray = new Array(maxValue + 1);
    }

    /**
     * Inserts a value into the sparse set. O(1) operation.
     * @param value The value to insert.
     * @throws Error if the value is out of range or the sparse set is at maximum capacity.
     */
    public insert(value: number) {
        this.validateArgument(value);
        if (this.size >= this.maxValue + 1)
            throw new Error(`SparseSet has reached its maximum capacity of ${this.maxValue + 1}`);

        this.denseArray[this.size] = value;
        this.sparseArray[value] = this.size;
        this.size++;
    }

    private safeHas(value: number): boolean {
        const denseIndex = this.sparseArray[value];
        return denseIndex < this.size && this.denseArray[denseIndex] === value;
    }

    /**
     * Checks if a value exists in the sparse set. O(1) operation.
     * @param value The value to check.
     * @returns True if the value exists, false otherwise.
     * @throws Error if the value is out of range.
     */
    public has(value: number): boolean {
        this.validateArgument(value);
        return this.safeHas(value);
    }

    /**
     * Removes a value from the sparse set if it exists. O(1) operation.
     * @param value The value to remove.
     * @returns True if the value was removed, false if it was not present.
     * @throws Error if the value is out of range.
     */ 
    public remove(value: number): boolean {
        this.validateArgument(value);
        if (!this.safeHas(value)) return false;

        const denseIndex = this.sparseArray[value];
        const lastValue = this.denseArray[this.size - 1];

        this.denseArray[denseIndex] = lastValue;
        this.sparseArray[lastValue] = denseIndex;
        this.size--;
        return true;
    }

    /**
     * Clear the whole set. O(1) operation.
     */
    public clear(): void {
        this.size = 0;
    }
}