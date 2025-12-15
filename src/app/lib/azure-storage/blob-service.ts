import {
  BlobServiceClient,
  StorageSharedKeyCredential,
} from '@azure/storage-blob';

import { getEnv } from '~/lib/env/server-env';
import { BlobContainer, TransferProgressEvent } from './blob-container';
import { BlobInfo } from './blob-info';
import { ListBlobOpt } from './blob-iterator';

export interface ServiceOpt {}

interface ContainerOpt {
  /** Create container if it doesn't exists */
  createIfMissing?: boolean;
}

export interface ListDirOpt extends ListBlobOpt {
  /** When specified, will only list blobs within specified container */
  container?: string;
  /** Callback when blob is being read from container */
  onList?: (container: BlobContainer, arg: BlobInfo) => Promise<void>;
}

export interface CopyOpt extends ListDirOpt {
  /** Callback when resource is being downloaded from source blob storage */
  downloadOnProgress?: (
    container: BlobContainer,
    args: BlobInfo & { bytes: number }
  ) => void;
  /** Callback when resource is being uploaded to destination blob storage */
  uploadOnProgress?: (
    container: BlobContainer,
    args: BlobInfo & { bytes: number }
  ) => void;
}

/**
 * Copy a blob item from source container to destination It will copy blob from
 * srcContainer to the same container name/blob name in destination
 *
 * @param dest Destination blob service object
 * @param srcContainer Source blob container object
 * @param blobInfo Source blob item to copy
 * @param opt Copy options
 */
async function copyBlob(
  dest: BlobService,
  srcContainer: BlobContainer,
  blobInfo: BlobInfo,
  opt?: CopyOpt
) {
  const { blob } = blobInfo;

  const sourceStream = await srcContainer.getAsStream(blob, {
    onProgress: (progress: TransferProgressEvent) => {
      opt?.downloadOnProgress?.(srcContainer, {
        ...blobInfo,
        bytes: progress.loadedBytes,
      });
    },
  });
  if (sourceStream) {
    const destContainer = await dest.getContainer(srcContainer.name, {
      createIfMissing: true,
    });
    await destContainer.uploadStream(blob.name, sourceStream, {
      // The MD5 is important, otherwise blob API would not be able to read
      // the blob.
      blobHTTPHeaders: {
        blobCacheControl: blob.properties.cacheControl,
        blobContentType: blob.properties.contentType,
        blobContentMD5: blob.properties.contentMD5,
        blobContentEncoding: blob.properties.contentEncoding,
        blobContentLanguage: blob.properties.contentLanguage,
        blobContentDisposition: blob.properties.contentDisposition,
      },
      onProgress: (progress: TransferProgressEvent) => {
        opt?.uploadOnProgress?.(destContainer, {
          ...blobInfo,
          bytes: progress.loadedBytes,
        });
      },
    });
  }
}

export class BlobService {
  serviceClient: BlobServiceClient;

  constructor(opt?: ServiceOpt) {
    // Get all environment variables allow us to make use of discrimnated unions
    const env = getEnv();
    switch (env.AZURE_STORAGE_MODE) {
      case 'local':
        {
          // Development Azurite connection
          const host = env.AZURE_LOCAL_STORAGE_HOST;
          const port = env.AZURE_LOCAL_STORAGE_PORT;
          const account = env.AZURE_LOCAL_STORAGE_ACCOUNT;
          const accountKey = env.AZURE_LOCAL_STORAGE_ACCOUNT_KEY;
          const credential = new StorageSharedKeyCredential(
            account,
            accountKey
          );
          this.serviceClient = new BlobServiceClient(
            `http://${host}:${port}/${account}`,
            credential
          );
        }
        break;

      case 'remote':
        {
          // Connect to remote Azure blob
          const account = env.AZURE_STORAGE_ACCOUNT;
          const accountKey = env.AZURE_STORAGE_ACCOUNT_KEY;
          // connection string
          if (!accountKey) {
            throw new Error('Azure storage accountKey not provided');
          }
          const credential = new StorageSharedKeyCredential(
            account,
            accountKey
          );
          this.serviceClient = new BlobServiceClient(
            `https://${account}.blob.core.windows.net`,
            credential
          );
        }
        break;

      default:
        throw new Error('AZURE_STORAGE_MODE has been set to none');
    }
  }

  /** Check if Azure Blob Container of a specific name exists */
  async hasContainer(containerName: string) {
    const client = this.serviceClient.getContainerClient(containerName);
    const exists = await client.exists();
    return exists;
  }

  /** Get Azure Blob Container of a specific name */
  async getContainer(containerName: string, opt?: ContainerOpt) {
    const client = this.serviceClient.getContainerClient(containerName);
    const exists = await client.exists();

    if (!exists) {
      if (opt?.createIfMissing) {
        const response = await client.create();
        if (response.errorCode) {
          throw new Error(
            `Storage container ${containerName} cannot be created`
          );
        }
      } else {
        throw new Error(`Storage container ${containerName} not found`);
      }
    }
    return new BlobContainer(containerName, client);
  }

  /** Remove Azure Blob Container of a specific name */
  async deleteContainer(containerName: string) {
    const exists = await this.hasContainer(containerName);
    if (exists) {
      const response = await this.serviceClient.deleteContainer(containerName);
      if (response.errorCode) {
        throw new Error(`Deleting container ${containerName} failed`);
      }
    }
  }

  /**
   * List all files within this blob storage
   *
   * @param opt Options to pass to listDir operation
   */
  async listDir(opt?: ListDirOpt) {
    const sourceContainers = this.serviceClient.listContainers();
    for await (const container of sourceContainers) {
      if (opt?.container && opt.container !== container.name) {
        continue;
      }

      const sourceContainer = await this.getContainer(container.name);

      // Loop through each blob within container
      for await (const blobInfo of sourceContainer.listBlobsFlat(opt)) {
        await opt?.onList?.(sourceContainer, blobInfo);
      }
    }
  }

  /**
   * Copy all containers from this blob storage to a destination blob storage
   * The destination blob container will be cleared before accepting new files
   *
   * @param dest Destination blob storage
   * @param opt Options to pass to copy operation
   */
  async copyTo(dest: BlobService, opt?: CopyOpt) {
    await this.listDir({
      ...opt,
      onList: async (container, blob) => {
        await opt?.onList?.(container, blob);
        await copyBlob(dest, container, blob, opt);
      },
    });
  }
}
