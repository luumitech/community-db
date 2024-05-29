import { BlobItem } from '@azure/storage-blob';

/**
 * Returns blob and also some other useful information
 */
export interface BlobInfo {
  blob: BlobItem;
  blobName: string;
  versionId?: string;
  isCurrentVersion?: boolean;
  totalBytes: number;
}

/**
 * Returns blob and also some other useful information
 */
export function getBlobInfo(blob: BlobItem): BlobInfo {
  // when blob is versioned, isCurrentVersion tells us if it is currrent
  // If blob is not versioned, then it must be current version
  const isCurrentVersion = blob.versionId ? blob.isCurrentVersion : true;

  return {
    blob,
    blobName: blob.name,
    isCurrentVersion,
    versionId: blob.versionId,
    totalBytes: blob.properties.contentLength ?? 0,
  };
}

/**
 * Check if blob matches versionId
 *
 * @param blobInfo blob info
 * @param versionId version to match
 * @returns
 */
export function matchesVersionId(blobInfo: BlobInfo, versionId?: string) {
  return versionId
    ? blobInfo.versionId?.startsWith(versionId)
    : blobInfo.isCurrentVersion;
}
