import {
  ContainerClient,
  ContainerListBlobsOptions,
} from '@azure/storage-blob';

import * as blobInfoUtil from './blob-info';

export interface ListBlobOpt extends ContainerListBlobsOptions {
  /**
   * A version ID that will only return those files whose versionID startsWith
   * the specified versionId If not specified, only current version of the files
   * will be returned
   */
  versionId?: string;
}

/**
 * Blob iterator within container
 *
 * Can optionally list a specific version of blob items
 */
export class BlobIterator {
  private versionId?: string;
  private blobIter: ReturnType<ContainerClient['listBlobsFlat']>;

  constructor(
    private client: ContainerClient,
    opt?: ListBlobOpt
  ) {
    const { versionId, ...listBlobsFlatOpt } = opt ?? {};
    this.versionId = versionId;

    this.blobIter = client.listBlobsFlat({
      ...(versionId && { includeVersions: true }),
      ...listBlobsFlatOpt,
    });
  }

  /** Async iterator for looping through all blobs within container */
  async *iter() {
    let item = await this.blobIter.next();
    while (!item.done) {
      const blob = item.value;

      /**
       * If versionId is specified, then only return blob items whose versionId
       * has the same prefix as the specified versionId
       *
       * If versionId is not specified, only return current version
       */
      const blobInfo = blobInfoUtil.getBlobInfo(blob);
      if (blobInfoUtil.matchesVersionId(blobInfo, this.versionId)) {
        yield blobInfo;
      }
      item = await this.blobIter.next();
    }
  }
}
