import { BlobContainer } from './blob-container';
import { BlobService } from './blob-service';

export { BlobContainer, BlobService };

/**
 * Blob container for storing temporary cache
 *
 * This container should be setup to delete blob that is older than 1 day In
 * Azure portal, see 'Lifecycle management' for the blob service to setup
 * appropriate rules
 */
export async function getBlobContainer() {
  const service = new BlobService();
  const container = await service.getContainer('community-db', {
    createIfMissing: true,
  });
  return container;
}
