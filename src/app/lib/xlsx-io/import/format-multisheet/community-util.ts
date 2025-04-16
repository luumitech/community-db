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
    const { updatedByEmail, defaultSettingJson, ...community } = this.community;
    const updatedBy = updatedByEmail
      ? {
          connectOrCreate: {
            where: { email: updatedByEmail },
            create: { email: updatedByEmail },
          },
        }
      : undefined;

    let defaultSetting = undefined;
    try {
      defaultSetting = JSON.parse(defaultSettingJson);
    } catch (err) {
      // ignore JSON parse error
    }

    const propertyList = opt.propertyUtil.propertyList(opt);
    const eventNameList = extractEventList(propertyList);
    const paymentMethodList = extractPaymentMethodList(propertyList);
    const ticketList = extractTicketList(propertyList);
    const yearRange = extractYearRange(propertyList);

    return {
      ...community,
      ...(!!defaultSetting && { defaultSetting }),
      ...(updatedBy && { updatedBy }),
      ...yearRange,
      eventList: eventNameList.map((eventName) => ({
        name: eventName,
        hidden: false,
      })),
      ticketList: ticketList.map((ticketName) => ({
        name: ticketName,
        hidden: false,
      })),
      paymentMethodList: paymentMethodList.map((method) => ({
        name: method,
        hidden: false,
      })),
      propertyList: {
        create: propertyList,
      },
    };
  }
}
