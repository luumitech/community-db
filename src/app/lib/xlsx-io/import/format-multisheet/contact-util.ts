import { WorksheetHelper } from '~/lib/worksheet-helper';
import type { ContactInfoEntry } from '../_type';
import {
  ImportHelper,
  type MappingColIdxSchema,
  type MappingResult,
  type MappingTypeSchema,
} from '../import-helper';
import { type UtilOpt } from './_type';
import { getMapValue } from './map-util';

const mappingType = {
  contactId: 'number',
  occupantId: 'number',
  type: 'contactInfoType',
  label: 'string',
  value: 'string',
} satisfies MappingTypeSchema;
type MappingEntry = MappingResult<typeof mappingType>;

export class ContactUtil {
  private byContactId = new Map<number, MappingEntry>();
  private byOccupantId = new Map<number, MappingEntry[]>();

  constructor(wsHelper?: WorksheetHelper) {
    if (wsHelper) {
      this.parseXlsx(wsHelper);
    }
  }

  private parseXlsx(wsHelper: WorksheetHelper) {
    const importHelper = new ImportHelper(wsHelper, { headerCol: 0 });

    const mappingColIdx: MappingColIdxSchema<typeof mappingType> = {
      contactId: importHelper.labelColumn('contactId'),
      occupantId: importHelper.labelColumn('occupantId'),
      type: importHelper.labelColumn('type'),
      label: importHelper.labelColumn('label'),
      value: importHelper.labelColumn('value'),
    };

    for (let rowIdx = 1; rowIdx < importHelper.ws.rowCount; rowIdx++) {
      const entry = importHelper.mapping(rowIdx, mappingType, mappingColIdx);

      this.byContactId.set(entry.contactId, entry);
      getMapValue(this.byOccupantId, entry.occupantId).push(entry);
    }
  }

  contactList(occupantId: number, opt: UtilOpt): ContactInfoEntry[] {
    const contactList = this.byOccupantId.get(occupantId) ?? [];
    return contactList.map((entry) => {
      const { contactId, occupantId: _occupantId, ...contact } = entry;
      return contact;
    });
  }
}
