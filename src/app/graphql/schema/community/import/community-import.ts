import { Job } from '@hokify/agenda';
import { GraphQLError } from 'graphql';
import * as R from 'remeda';
import * as XLSX from 'xlsx';
import { getGeoapifyApi } from '~/graphql/schema/geocode/util';
import { jobProgress, type JobProgressOutput } from '~/graphql/schema/job/util';
import { getSubscriptionEntry } from '~/graphql/schema/payment/util';
import { ContextUser } from '~/lib/context-user';
import prisma from '~/lib/prisma';
import { utapi } from '~/lib/uploadthing';
import { WorksheetHelper } from '~/lib/worksheet-helper';
import { importXlsx } from '~/lib/xlsx-io/import';
import { seedCommunityData } from '~/lib/xlsx-io/random-seed';
import { getCommunityEntry } from '../util';
import type { CommunityImportInput, CommunityImportJobArg } from './index';

const stepDefinition = {
  updateCommunity: 20,
  updateProperty: 30,
};

export class CommunityImport {
  constructor(
    private user: ContextUser,
    private input: CommunityImportInput,
    private progress?: JobProgressOutput<typeof stepDefinition>
  ) {}

  static fromJob(job: Job<CommunityImportJobArg>) {
    const { user, input } = job?.attrs.data;
    const progress = jobProgress(job, stepDefinition);
    return new CommunityImport(user, input, progress);
  }

  async start() {
    const { id: shortId, method, xlsx, map } = this.input;

    let workbook: XLSX.WorkBook;
    switch (method) {
      case 'random':
        workbook = await this.importRandom();
        break;

      case 'xlsx':
        if (!xlsx) {
          throw new GraphQLError(
            'When Import Method is Excel, you must upload a valid xlsx file.'
          );
        }
        workbook = await this.importXlsx(xlsx);
        break;

      case 'map':
        if (!map) {
          throw new GraphQLError(
            'When Import Method is Map, you must supply GPS coordinates'
          );
        }
        workbook = await this.importMap(map);
        break;

      default:
        throw new GraphQLError(`Unrecognized import method ${method}`);
    }

    const {
      propertyList: { create: propertyList },
      ...others
    } = importXlsx(workbook);

    const community = await getCommunityEntry(this.user, shortId, {
      select: { id: true, owner: true },
    });

    // Check community owner's subscription status to determine
    // limitation
    const existingSub = await getSubscriptionEntry(community.owner);
    const { propertyLimit } = existingSub;
    if (propertyLimit != null) {
      if (propertyList.length > propertyLimit) {
        throw new GraphQLError(
          `This community can at most have ${propertyLimit} properties.`
        );
      }
    }

    await this.progress?.updateCommunity.set(0);

    /**
     * It's possible to do the update in an interactive transaction
     *
     * See:
     * https://www.prisma.io/docs/orm/prisma-client/queries/transactions#interactive-transactions
     *
     * But by default, interactive transaction timeouts after 5s, but we don't
     * know how long an import action may take. So we decided not to do
     * transaction here.
     */
    await prisma.community.update({
      where: { id: community.id },
      data: {
        ...others,
        propertyList: {
          // Remove existing property list
          deleteMany: {},
          // Add new imported property list
          // For unknown reason, when adding lots of properties within a single transaction,
          // the transaction operation fails in production instance.  (works fine locally)
          // create: propertyList,
        },
      },
    });
    await this.progress?.updateCommunity.set(100);

    // Inserting in bulk by chunks would allow progress report
    const propertyChunk = R.chunk(propertyList, 100);
    for (const [chunkIdx, chunk] of propertyChunk.entries()) {
      await prisma.community.update({
        where: { id: community.id },
        data: {
          propertyList: {
            create: chunk,
          },
        },
      });
      const chunkProgress = ((chunkIdx + 1) / propertyChunk.length) * 100;
      await this.progress?.updateProperty.set(chunkProgress);
    }
  }

  private async importRandom() {
    const seedJson = seedCommunityData(10);
    const wsHelper = WorksheetHelper.fromJson(seedJson, 'Membership');
    const workbook = wsHelper.wb;
    return workbook;
  }

  private async importXlsx(xlsx: NonNullable<CommunityImportInput['xlsx']>) {
    const res = await fetch(xlsx.ufsUrl, { method: 'GET' });
    const bytes = await res.arrayBuffer();
    const xlsxBuf = Buffer.from(bytes);
    const workbook = XLSX.read(xlsxBuf);

    // Remove xlsx from uploadthing, after processing its content
    await utapi.deleteFiles(xlsx.key);

    return workbook;
  }

  private async importMap(map: NonNullable<CommunityImportInput['map']>) {
    const seedJson = seedCommunityData(10);
    const wsHelper = WorksheetHelper.fromJson(seedJson, 'Membership');
    const workbook = wsHelper.wb;
    return workbook;
  }
}
