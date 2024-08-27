import { BlobContainer, getBlobContainer } from '~/lib/azure-storage';
import { GenMD5 } from '~/lib/cache/gen-md5';
import {
  ExportHelper,
  communityData,
  type Community,
} from '~/lib/lcra-community/export';
import { type InputData } from './_type';
import { getDefaultXlsxFn } from './util';

export class XlsxCache extends GenMD5 {
  protected rootDir: string;
  public md5: string;
  /** Directory for storing exported xlsx */
  private xlsxDir: string;
  /** Filename for storing exported xlsx */
  private xlsxFn: string;
  /** Blobname for storing exported xlsx */
  private xlsxBlobName: string;

  private constructor(
    protected container: BlobContainer,
    private community: Community
  ) {
    super();
    this.rootDir = `temp-cache/community/${community.id}`;
    this.md5 = GenMD5.genMD5(community);
    this.xlsxDir = `${this.rootDir}/xlsx`;

    this.xlsxFn = getDefaultXlsxFn(community);
    this.xlsxBlobName = `${this.xlsxDir}/${this.xlsxFn}`;
  }

  static async fromForm(form: InputData) {
    const container = await getBlobContainer();
    const community = await communityData(
      { email: form.email },
      form.communityId
    );
    return new XlsxCache(container, community);
  }

  /**
   * Remove cache artifacts related to this object, but leaves the md5 signature
   * intact.
   */
  async cleanCacheArtifacts() {
    await this.container.deleteAll(this.xlsxDir);
  }

  /**
   * Convert community data into xlsx and cache it
   *
   * - Removes current zip directory if MD5 mismatches
   * - Generates MD5 signature if not already saved
   */
  async cacheAsXlsx() {
    // If existing MD5 is not current, remove artifact and regenerate
    const isUpdated = await super.isCacheUpToDate();
    if (isUpdated) {
      return;
    }

    await this.removeCache();
    const helper = new ExportHelper(this.community.propertyList);
    const xlsxBuf = helper.toXlsx();
    await this.container.upload(this.xlsxBlobName, xlsxBuf, xlsxBuf.length);

    await this.saveCacheMD5();
  }

  /**
   * Construct a URL that user can use to download the blob
   *
   * @param filename Suggested filename for user to save the file as
   * @returns
   */
  async downloadUrl(filename?: string) {
    await this.cacheAsXlsx();
    const downloadUrl = await this.container.getAsSasUrl(this.xlsxBlobName, {
      contentDisposition: `attachment; filename=${filename ?? this.xlsxFn}`,
    });
    return downloadUrl;
  }
}
