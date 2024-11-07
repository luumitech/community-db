import {
  BlobDownloadOptions,
  BlobGenerateSasUrlOptions,
  BlobGetPropertiesOptions,
  BlobItem,
  BlobSASPermissions,
  BlockBlobUploadOptions,
  ContainerClient,
  SASProtocol,
} from '@azure/storage-blob';
import { addMinutes } from 'date-fns';
import { Readable } from 'stream';

import {
  BlobHierarchyIterator,
  ListBlobHierarchyOpt,
} from './blob-hierarchy-iterator';
import { BlobIterator, ListBlobOpt } from './blob-iterator';

import { env } from '~/lib/env-cfg';
import { streamToBuffer, streamToString } from '~/lib/file-util';

export { type TransferProgressEvent } from '@azure/core-http';
export { type BlobItem } from '@azure/storage-blob';

/** Return name of blob or blob item */
export function getBlobName(blob: string | BlobItem) {
  if (typeof blob === 'string') {
    return blob;
  }
  return blob.name;
}

/**
 * Azure Storage Blob container service
 *
 * For detail:
 * https://docs.microsoft.com/en-us/javascript/api/overview/azure/storage-blob-readme?view=azure-node-latest
 */
export class BlobContainer {
  constructor(
    public name: string,
    public client: ContainerClient
  ) {}

  /**
   * Async iterator for looping through all blobs within container including
   * blobs within (virtual) "folders". Retruns a flat list of blobs.
   *
   * Can optionally list a specific version of blob items
   *
   * @example
   *
   * ```js
   * const listBlobOpt = { versionId: '2022-01-01' };
   * for await (const blobInfo of container.listBlobs(listBlobOpt)) {
   *   // blob with versionId with prefix "2022-01-01"
   *   const { blob, versionId } = blobInfo;
   * }
   * ```
   */
  listBlobsFlat(opt?: ListBlobOpt) {
    const blobIterator = new BlobIterator(this.client, opt);
    return blobIterator.iter();
  }

  /**
   * Async iterator for looping through all blobs by hierarchy within container.
   *
   * {@link BLOB_HIERARCHY_DELIMITER} is the default delimiter. Can optionally
   * specify a different delimiter in {@link ListBlobHierarchyOpt}
   *
   * Can optionally list a specific version of blob items
   *
   * For example, for a container with the following content:
   *
   * - Blob1
   * - Blob2
   * - Folder1/blob3
   * - Folder1/blob4
   * - Folder1/subfolder/blob5
   * - Folder1/subfolder/blob6
   *
   * @example
   *
   * ```js
   *  let blobNames: string[] = [];
   *  const blobs = container.listBlobsByHierarchy()
   *  for await (const blobInfo of blobs) {
   *    blobNames.push(blobInfo.blobName);
   *  }
   *  expect(blobNames).toIncludeSameMembers(['blob1', 'blob2']);
   *
   *  blobNames: string[] = [];
   *  const blobs = container.listBlobsByHierarchy({ prefix: "folder1/subfolder" })
   *  for await (const blobInfo of blobs) {
   *    blobNames.push(blobInfo.blobName);
   *  }
   *  expect(blobNames).toIncludeSameMembers(['blob5', 'blob6']);
   * ```
   *
   * @param opt List options
   * @returns
   */
  listBlobsByHierarchy(opt?: ListBlobHierarchyOpt) {
    const blobIterator = new BlobHierarchyIterator(this.client, opt);
    return blobIterator.iter();
  }

  /** Get Blob client for download purpose */
  private getBlobClient(input: string | BlobItem) {
    if (typeof input === 'string') {
      return this.client.getBlobClient(input);
    }

    // Must be a BlobItem
    const client = this.client.getBlobClient(getBlobName(input));
    if (input.versionId) {
      return client.withVersion(input.versionId);
    } else if (input.snapshot) {
      return client.withSnapshot(input.snapshot);
    }
    return client;
  }

  /**
   * Check if blob name exists
   *
   * @param input Blob name
   * @returns Blob client if exists, null otherwise
   */
  async exists(input: string | BlobItem) {
    const blobClient = this.getBlobClient(input);
    const exist = await blobClient.exists();
    return exist ? blobClient : null;
  }

  /**
   * Check if specified directory exists
   *
   * @returns True if directory exists, false otherwise
   */
  async dirExists(dir: string) {
    const iter = this.listBlobsByHierarchy({ prefix: dir });
    const { done } = await iter.next();
    // If first item returned is done, that means listBlobsByHierarchy
    // did not return any entries. i.e. dir doesn't exist
    return !done;
  }

  async getProperties(
    input: string | BlobItem,
    options?: BlobGetPropertiesOptions
  ) {
    const blobClient = this.getBlobClient(input);
    const resp = await blobClient.getProperties(options);
    return resp;
  }

  /**
   * Upload content to blob storage
   *
   * @param blobName Blob name
   * @param content Blob content
   * @param contentLength Content length
   */
  async upload(
    blobName: string,
    content: string | Blob | ArrayBuffer,
    contentLength: number,
    opt?: BlockBlobUploadOptions
  ) {
    const blockBlobClient = this.client.getBlockBlobClient(blobName);
    const response = await blockBlobClient.upload(content, contentLength, opt);
    if (response.errorCode) {
      throw new Error(`Upload block blob ${blobName} failed`);
    }
  }

  /**
   * Upload stream to blob storage
   *
   * @param blobName Blob name
   * @param stream Readable stream
   */
  async uploadStream(
    blobName: string,
    stream: NodeJS.ReadableStream,
    opt?: BlockBlobUploadOptions
  ) {
    const blockBlobClient = this.client.getBlockBlobClient(blobName);

    const response = await blockBlobClient.uploadStream(
      stream as Readable,
      undefined,
      undefined,
      opt
    );
    if (response.errorCode) {
      throw new Error(`Upload block blob ${blobName} failed`);
    }
  }

  /**
   * Get readable stream from blob
   *
   * @param blob Blob name or blob item
   * @param opt Additional download option (i.e. progress)
   * @returns Readable stream
   */
  async getAsStream(blob: string | BlobItem, opt?: BlobDownloadOptions) {
    const blobClient = await this.exists(blob);
    if (!blobClient) {
      throw new Error(`Cannot find ${getBlobName(blob)}`);
    }
    const downloadBlockBlobResponse = await blobClient.download(
      0,
      undefined,
      opt
    );
    const { readableStreamBody } = downloadBlockBlobResponse;
    if (!readableStreamBody) {
      throw new Error(`Unable to download Blob ${getBlobName(blob)}`);
    }
    return readableStreamBody;
  }

  /**
   * Get Node Buffer from blob
   *
   * @param blob Blob name or blob item
   * @param opt Additional download option (i.e. progress)
   * @returns Node buffer
   */
  async getAsBuffer(blob: string | BlobItem, opt?: BlobDownloadOptions) {
    const stream = await this.getAsStream(blob, opt);
    return await streamToBuffer(stream);
  }

  /**
   * Get String from blob
   *
   * @param blob Blob name or blob item
   * @param opt Additional download option (i.e. progress)
   * @returns Node buffer
   */
  async getAsString(blob: string | BlobItem, opt?: BlobDownloadOptions) {
    const stream = await this.getAsStream(blob, opt);
    return await streamToString(stream);
  }

  /**
   * Get a SAS Url for accessing blob By default:
   *
   * - URL will be available for 10 minutes
   * - Permission is set to read only
   *
   * @param blob Blob name or blob item
   * @param options BlobGenerateSasUrlOptions
   * @returns URL to access blob
   */
  async getAsSasUrl(
    blob: string | BlobItem,
    options?: BlobGenerateSasUrlOptions
  ) {
    const blobClient = await this.exists(blob);
    if (!blobClient) {
      throw new Error(`Cannot find ${getBlobName(blob)}`);
    }

    const url = blobClient.generateSasUrl({
      // Available permissions:
      // r - read
      // a - add
      // c - create
      // w - write
      // d - delete
      permissions: BlobSASPermissions.parse('r'),
      // If using local azurite emulator, then it's likely http
      protocol:
        env().AZURE_STORAGE_MODE === 'local'
          ? SASProtocol.HttpsAndHttp
          : SASProtocol.Https,
      expiresOn: addMinutes(Date.now(), 10),
      ...options,
    });
    return url;
  }

  /**
   * Remove a blob
   *
   * @param blob Blob name or blob item
   */
  async delete(blob: string | BlobItem) {
    const blobClient = this.getBlobClient(blob);
    return blobClient.deleteIfExists();
  }

  /** Delete all blobs within container */
  async deleteAll(prefix?: string) {
    // List all blobs within the container matching prefix
    const blobs = this.listBlobsFlat({ prefix });
    for await (const blobInfo of blobs) {
      const blobName = blobInfo.blob.name;
      await this.delete(blobName);
    }
  }
}
