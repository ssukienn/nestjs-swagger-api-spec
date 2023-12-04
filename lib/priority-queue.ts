type Comparator<T> = (valueA: T, valueB: T) => number;

const swap = (arr: unknown[], i: number, j: number) => {
  [arr[i], arr[j]] = [arr[j], arr[i]];
};

export class PriorityQueue<T> {
  readonly #heap;
  readonly #isGreater;

  constructor(comparator: Comparator<T>, init: T[] = []) {
    this.#heap = init;
    this.#isGreater = (a: number, b: number) =>
      comparator(init[a] as T, init[b] as T) > 0;
  }

  get size(): number {
    return this.#heap.length;
  }

  add(value: T): void {
    this.#heap.push(value);
    this.#siftUp();
  }

  poll(): T | undefined;
  poll(
    heap = this.#heap,
    value = heap[0],
    length = heap.length,
  ): T | undefined {
    if (length) {
      swap(heap, 0, length - 1);
    }

    heap.pop();
    this.#siftDown();

    return value;
  }

  #siftUp(): void;
  #siftUp(node = this.size - 1, parent = (node - 1) >>> 1): void {
    for (
      ;
      node && this.#isGreater(node, parent);
      node = parent, parent = ((node + 1) >>> 1) - 1
    ) {
      swap(this.#heap, node, parent);
    }
  }

  #siftDown(): void;
  #siftDown(size = this.size, node = 0, isGreater = this.#isGreater): void {
    while (true) {
      const leftNode = (node << 1) + 1;
      const rightNode = leftNode + 1;

      if (
        (leftNode >= size || isGreater(node, leftNode)) &&
        (rightNode >= size || isGreater(node, rightNode))
      ) {
        break;
      }

      const maxChild =
        rightNode < size && isGreater(rightNode, leftNode)
          ? rightNode
          : leftNode;

      swap(this.#heap, node, maxChild);

      node = maxChild;
    }
  }
}
