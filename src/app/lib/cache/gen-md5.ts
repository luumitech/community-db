import hash from 'object-hash';

import { BlobContainer } from '~/lib/azure-storage';

export interface GenMD5Opt {
  /**
   * List of keys to exclude from hashing
   */
  excludeKeys?: string[];
}

/**
 * Abstract class for handling generation and management of
 * MD5 signature storage in blob container
 */
export abstract class GenMD5 {
  /**
   * container containing cache
   */
  protected abstract container: BlobContainer;
  /**
   * root directory for storing cache information
   */
  protected abstract rootDir: string;
  /**
   * MD5 signature for data in cache
   */
  public abstract md5: string; // cache MD5 signature

  /**
   * Generate a MD5 signature for arbitrary object
   * - Keys that do not alter actual data are excluded
   *
   * @param input plain object
   * @returns MD5 signature
   */
  static genMD5(input: object, opt?: GenMD5Opt) {
    const md5Str = hash(input, {
      algorithm: 'md5',
      respectFunctionProperties: false,
      respectFunctionNames: false,
      excludeKeys: (key) => {
        switch (key) {
          case 'createdAt':
          case 'updatedAt':
            return true;
        }
        if (opt?.excludeKeys?.includes(key)) {
          return true;
        }
        return false;
      },
    });
    return md5Str;
  }

  /**
   * Directory for storing MD5 signature
   */
  private getMd5Dir() {
    return `${this.rootDir}/md5`;
  }

  /**
   * blob name for MD5 signature
   */
  private getMd5Fn() {
    return `${this.getMd5Dir()}/${this.md5}.md5`;
  }

  /**
   * Remove cache artifacts created by this Cache object, but
   * leaves the md5 signature intact.
   */
  abstract cleanCacheArtifacts(): Promise<void>;

  /**
   * Verify if the cache contains up-to-date information
   * to the associated database content
   */
  async isCacheUpToDate() {
    // Check if md5 signature matches current scenario
    const found = await this.container.exists(this.getMd5Fn());
    return !!found;
  }

  /**
   * Add MD5 signature to container, so we can check if scenario in
   * database matches the cache
   */
  protected async saveCacheMD5() {
    const isUpdated = await this.isCacheUpToDate();
    if (!isUpdated) {
      await this.container.deleteAll(`${this.getMd5Dir()}`);
      await this.container.upload(this.getMd5Fn(), '', 0);
    }
  }

  /**
   * Remove MD5 signature, (i.e. invalidates cache)
   */
  async removeCacheMD5() {
    await this.container.deleteAll(`${this.getMd5Dir()}`);
  }

  /**
   * Remove all cache content stored within the root directory
   * This function removes all resources within cache (including MD5)
   */
  async removeCache() {
    await this.container.deleteAll(`${this.rootDir}`);
  }
}
