import { ContainerClient } from '@azure/storage-blob';

import * as blobInfoUtil from './blob-info';

export const DEFAULT_HIERARCHY_DELIMITER = '/';

export interface ListBlobHierarchyOpt {
  /**
   * The character or string used to define the virtual hierarchy.
   * {@link BLOB_HIERARCHY_DELIMITER} is the default delimiter.
   */
  delimiter?: string;
  /**
   * A version ID that will only return those files whose versionID startsWith
   * the specified versionId If not specified, only current version of the files
   * will be returned
   */
  versionId?: string;
  /**
   * Filters the results to return only blobs whose names with the specified
   * prefix. If no prefix is specified, then only blobs at the root of the
   * container are returned.
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
   * If no prefix is specified or an empty string is specified as prefix, then
   * only blob1 and blob2 are returned.
   *
   * If the prefix is specified as `folder1` or `folder1/`, then only blob3 and
   * blob4 are returned.
   *
   * If the prefix is specified as `folder1/subfolder` or `folder1/subfolder/`,
   * then only blob5 and blob6 are returned.
   */
  prefix?: string;
}

/**
 * Blob iterator within container
 *
 * Can list blobs within a (virtual) "folder" when a prefix is specified.
 *
 * Can optionally list a specific version of blob items
 */
export class BlobHierarchyIterator {
  private blobHierarchyIter: ReturnType<
    ContainerClient['listBlobsByHierarchy']
  >;
  private versionId?: string;
  private containerName: string;
  private prefix?: string;

  constructor(
    private client: ContainerClient,
    opt?: ListBlobHierarchyOpt
  ) {
    this.versionId = opt?.versionId;
    this.containerName = client.containerName;
    this.prefix = opt?.prefix;

    const delimiter = opt?.delimiter ?? DEFAULT_HIERARCHY_DELIMITER;
    if (opt?.prefix && !opt.prefix.endsWith(delimiter)) {
      this.prefix = `${opt.prefix}${delimiter}`;
    }
    this.blobHierarchyIter = client.listBlobsByHierarchy(delimiter, {
      ...(opt?.versionId && { includeVersions: true }),
      ...(opt?.prefix && { prefix: this.prefix }),
    });
  }

  /**
   * Async iterator for looping through all blobs within container. Blobs within
   * (virtual) "folders" are not included.
   *
   * Specify a preix to list blobs within a (virtual) "folder"
   */
  async *iter() {
    let item = await this.blobHierarchyIter.next();
    while (!item.done) {
      const blob = item.value;
      if (blob.kind === 'blob') {
        const blobInfo = blobInfoUtil.getBlobInfo(blob);
        if (this.prefix) {
          blobInfo.blobName = blobInfo.blobName.replace(this.prefix, '');
        }
        if (blobInfoUtil.matchesVersionId(blobInfo, this.versionId)) {
          yield blobInfo;
        }
      }
      item = await this.blobHierarchyIter.next();
    }
  }
}
