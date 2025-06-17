import { WorksheetHelper } from '~/lib/worksheet-helper';
import type { CommunityEntry } from '../_type';
import { extractEventList } from '../event-list-util';
import { ImportHelper } from '../import-helper';
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

export class CommunityUtil {
  private community: ReturnType<typeof this.parseXlsx>;

  constructor(private wsHelper: WorksheetHelper) {
    const parseResult = this.parseXlsx();
    this.community = parseResult;
  }

  private parseXlsx() {
    const importHelper = new ImportHelper(this.wsHelper, { headerCol: 0 });

    const mappingSchema = {
      name: {
        colIdx: importHelper.labelColumn('name'),
        type: 'string',
      },
      defaultSettingJson: {
        colIdx: importHelper.labelColumn('defaultSetting'),
        type: 'string',
      },
      eventListJson: {
        colIdx: importHelper.labelColumn('eventList'),
        type: 'string',
      },
      ticketListJson: {
        colIdx: importHelper.labelColumn('ticketList'),
        type: 'string',
      },
      paymentMethodListJson: {
        colIdx: importHelper.labelColumn('paymentMethodList'),
        type: 'string',
      },
      mailchimpSettingJson: {
        colIdx: importHelper.labelColumn('mailchimpSetting'),
        type: 'string',
      },
      updatedAt: {
        colIdx: importHelper.labelColumn('updatedAt'),
        type: 'date',
      },
      updatedByEmail: {
        colIdx: importHelper.labelColumn('updatedBy'),
        type: 'string',
      },
    } as const;

    const entry = importHelper.mapping(1, mappingSchema);
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
