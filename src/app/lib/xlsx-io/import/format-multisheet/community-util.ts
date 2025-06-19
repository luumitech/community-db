import { WorksheetHelper } from '~/lib/worksheet-helper';
import { worksheetNames } from '~/lib/xlsx-io/multisheet';
import type { CommunityEntry } from '../_type';
import { extractEventList } from '../event-list-util';
import {
  ImportHelper,
  type MappingColIdxSchema,
  type MappingResult,
  type MappingTypeSchema,
} from '../import-helper';
import { extractPaymentMethodList } from '../payment-method-list-util';
import { extractTicketList } from '../ticket-list-util';
import { extractYearRange } from '../year-range-util';
import { EventUtil } from './event-util';
import { MembershipUtil } from './membership-util';
import { OccupantUtil } from './occupant-util';
import { PropertyUtil } from './property-util';
import { TicketUtil } from './ticket-util';

function safeJsonParse(jsonStr: string) {
  try {
    return JSON.parse(jsonStr);
  } catch (err) {
    // ignore JSON parse error
    return undefined;
  }
}

const mappingType = {
  name: 'string',
  defaultSettingJson: 'string',
  eventListJson: 'string',
  ticketListJson: 'string',
  paymentMethodListJson: 'string',
  mailchimpSettingJson: 'string',
  updatedAt: 'date',
  updatedByEmail: 'string',
} satisfies MappingTypeSchema;
type MappingEntry = MappingResult<typeof mappingType>;

export class CommunityUtil {
  private community: MappingEntry;

  constructor(wsHelper?: WorksheetHelper) {
    if (wsHelper) {
      this.community = this.parseXlsx(wsHelper);
    } else {
      throw new Error(
        `Worksheet "${worksheetNames.community}" is missing and is required`
      );
    }
  }

  private parseXlsx(wsHelper: WorksheetHelper) {
    const importHelper = new ImportHelper(wsHelper, { headerCol: 0 });

    const mappingColIdx: MappingColIdxSchema<typeof mappingType> = {
      name: importHelper.labelColumn('name'),
      defaultSettingJson: importHelper.labelColumn('defaultSetting'),
      eventListJson: importHelper.labelColumn('eventList'),
      ticketListJson: importHelper.labelColumn('ticketList'),
      paymentMethodListJson: importHelper.labelColumn('paymentMethodList'),
      mailchimpSettingJson: importHelper.labelColumn('mailchimpSetting'),
      updatedAt: importHelper.labelColumn('updatedAt'),
      updatedByEmail: importHelper.labelColumn('updatedBy'),
    };

    const entry = importHelper.mapping(1, mappingType, mappingColIdx);
    return entry;
  }

  communityCreateInput(opt: {
    propertyUtil: PropertyUtil;
    occupantUtil: OccupantUtil;
    membershipUtil: MembershipUtil;
    eventUtil: EventUtil;
    ticketUtil: TicketUtil;
  }): CommunityEntry {
    const {
      updatedByEmail,
      defaultSettingJson,
      eventListJson,
      ticketListJson,
      paymentMethodListJson,
      mailchimpSettingJson,
      ...community
    } = this.community;
    const updatedBy = updatedByEmail
      ? {
          connectOrCreate: {
            where: { email: updatedByEmail },
            create: { email: updatedByEmail },
          },
        }
      : undefined;

    const defaultSetting = safeJsonParse(defaultSettingJson);
    const eventList = safeJsonParse(eventListJson);
    const ticketList = safeJsonParse(ticketListJson);
    const paymentMethodList = safeJsonParse(paymentMethodListJson);
    const mailchimpSetting = safeJsonParse(mailchimpSettingJson);

    const propertyList = opt.propertyUtil.propertyList(opt);
    const yearRange = extractYearRange(propertyList);

    return {
      ...community,
      ...(!!defaultSetting && { defaultSetting }),
      ...(!!eventList && { eventList }),
      ...(!!ticketList && { ticketList }),
      ...(!!paymentMethodList && { paymentMethodList }),
      ...(!!mailchimpSetting && { mailchimpSetting }),
      ...(updatedBy && { updatedBy }),
      ...yearRange,
      propertyList: {
        create: propertyList,
      },
    };
  }
}
