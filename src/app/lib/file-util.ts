/** This is for server use only */
import fs from 'fs';
import path from 'path';
import { Duplex } from 'stream';

/**
 * Create directory if not already exists (can create nested directory)
 *
 * @param dir Directory to create
 */
export function mkdir(dirname: string) {
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname, { recursive: true });
  }
}

/**
 * Remove directory
 *
 * @param dir Directory to remove
 */
export function rmdir(dirname: string) {
  if (fs.existsSync(dirname)) {
    fs.rmSync(dirname, { recursive: true });
  }
}

/**
 * Write readable stream to a destination files
 *
 * @param stream Readable stream
 * @param destFile Destination file name
 */
export async function writeStream(
  stream: NodeJS.ReadableStream,
  destFile: string
) {
  const destStream = fs.createWriteStream(destFile);
  await new Promise((resolve, reject) => {
    stream.pipe(destStream).on('finish', resolve).on('error', reject);
  });
}

/**
 * Recurse directory in breath first search order, and invoke callback for each
 * file/directory encountered
 *
 * @param dir Input directory name
 * @param cb Callback to invoke for each file/directory
 */
export async function listDir(
  dir: string,
  cb: (absPath: string, stat: fs.Stats) => Promise<void>
) {
  const fileList = fs.readdirSync(dir);
  for (const filename of fileList) {
    const file = path.resolve(dir, filename);
    const stat = fs.lstatSync(file);

    await cb?.(file, stat);
    // Recurse down into directory
    if (stat.isDirectory()) {
      await listDir(file, cb);
    }
  }
}

/**
 * Convert readable stream into a string NOTE: Be extra careful when using this,
 * only use this when you KNOW the size of the stream is going to be small.
 * Otherwise, it will blow up the memory footprint.
 *
 * @param stream Readable stream
 */
export async function streamToString(
  stream: NodeJS.ReadableStream
): Promise<string> {
  const chunks: Buffer[] = [];
  return new Promise((resolve, reject) => {
    stream
      .on('data', (chunk) => chunks.push(Buffer.from(chunk)))
      .on('error', reject)
      .on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
  });
}

/**
 * Convert readable stream into a node buffer NOTE: Be extra careful when using
 * this, only use this when you KNOW the size of the stream is going to be
 * small. Otherwise, it will blow up the memory footprint.
 *
 * @param stream Readable stream
 */
export async function streamToBuffer(
  stream: NodeJS.ReadableStream
): Promise<Buffer> {
  const chunks: Buffer[] = [];
  return new Promise((resolve, reject) => {
    stream
      .on('data', (chunk) => chunks.push(Buffer.from(chunk)))
      .on('error', reject)
      .on('end', () => resolve(Buffer.concat(chunks)));
  });
}

/**
 * Convert node buffer into readable stream
 *
 * @param buffer Node buffer
 */
export function bufferToStream(buffer: Buffer) {
  const stream = new Duplex();
  stream.push(buffer);
  stream.push(null);
  return stream;
}
