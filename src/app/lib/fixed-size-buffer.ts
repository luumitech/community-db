/**
 * Class that allows adding Buffer up to a fixed size and removes the oldest
 * entries when the buffer size is exceeded
 */
export class FixedSizeBuffer {
  private readonly maxSize: number;
  private readonly buffer: { data: Buffer; size: number }[] = [];
  private currentSize = 0;

  constructor(maxSize: number) {
    this.maxSize = maxSize; // maximum size in bytes
  }

  /** Add data to fixed size buffer */
  public add(data: Buffer): void {
    const bufSize = Buffer.byteLength(data);

    if (bufSize > this.maxSize) {
      // skip adding entry if it is larger than max size
      return;
    }

    if (this.currentSize + bufSize > this.maxSize) {
      this._freeSpace(bufSize);
    }

    this.buffer.push({ data, size: bufSize });
    this.currentSize += bufSize;
  }

  /** Return content of buffer */
  public content(): Buffer[] {
    return this.buffer.map((entry) => entry.data);
  }

  public contentAsString(): string {
    // Convert each buffer to JSON object
    const logData = this.content().map((data) => {
      const str = data.toString();
      try {
        const json = JSON.parse(str);
        return json;
      } catch (err) {
        // treat as a morgan produced string
        return { http: str.trim() };
      }
    });

    // Format the JSON object nicely
    const logStr = JSON.stringify(logData, null, 2);
    return logStr;
  }

  public clear(): void {
    this.buffer.length = 0;
    this.currentSize = 0;
  }

  private _freeSpace(newItemSize: number): void {
    while (
      this.buffer.length > 0 &&
      this.currentSize + newItemSize > this.maxSize
    ) {
      const oldestEntry = this.buffer.shift();
      this.currentSize -= oldestEntry!.size;
    }

    if (this.currentSize + newItemSize > this.maxSize) {
      throw new Error('Buffer size limit exceeded');
    }
  }
}
