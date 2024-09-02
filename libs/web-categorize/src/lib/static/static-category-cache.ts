
export type HashFunction = (key: string) => string;


export class CategoryCacheHash {
  private keys = {}
  private hashFunction: HashFunction;

  private length: number = 0

  constructor(hashFunction: HashFunction) {
    this.hashFunction = hashFunction
  }

  add(_key: string, val: number) {
    const hashedKey = this.hashFunction(_key)
    const arr = this.keys[hashedKey];

    if (arr) {
      if (!arr.includes(val)) {
        arr.push(val)
      }
      return
    }
    this.keys[hashedKey] = [val]
    this.length++;
  }

  get(_key: string): Array<number> {
    const hashedKey = this.hashFunction(_key)
    return this.keys[hashedKey]
  }

  size(): number {
    return this.length;
  }
}
