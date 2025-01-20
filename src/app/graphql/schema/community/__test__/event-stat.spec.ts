import path from 'path';
import * as XLSX from 'xlsx';
import { graphql } from '~/graphql/generated';
import { TestUtil } from '~/graphql/test-util';
import { ITEM_DELIMITER } from '~/lib/lcra-community/delimiter-util';
import { toTicketList } from '~/lib/lcra-community/ticket-list-util';
import { WorksheetHelper } from '~/lib/worksheet-helper';

const EventStatQuery = graphql(/* GraphQL */ `
  query EventStatSpec_EventStat($year: Int!) {
    userCurrent {
      accessList {
        community {
          id
          communityStat {
            eventStat(year: $year) {
              eventName
              ticketList {
                ticketName
                count
                price
                paymentMethod
              }
            }
          }
        }
      }
    }
  }
`);

/** Find column index header matches the specified `val` */
function findColIdx(ws: WorksheetHelper, val: string) {
  for (const cell of ws.iterColumn('1')) {
    if (typeof cell.v === 'string' && cell.v === val) {
      return cell.colIdx;
    }
  }
}

describe('Event Statistices', () => {
  const testUtil = new TestUtil();
  const workbook = XLSX.readFile(
    path.join(process.cwd(), '__fixtures__', 'simple.xlsx')
  );

  beforeAll(async () => {
    await testUtil.initialize();
  });

  afterAll(async () => {
    await testUtil.terminate();
  });

  afterEach(async () => {
    await testUtil.database.dropDatabase();
  });

  test('Verify event statistics', async () => {
    const wb = testUtil.database.cloneWorkbook(workbook);
    await testUtil.database.seedFromWorkbook(wb);

    const result = await testUtil.graphql.executeSingle({
      document: EventStatQuery,
      variables: { year: 2023 },
    });
    const eventStat =
      result.data?.userCurrent.accessList[0].community.communityStat.eventStat;
    expect(eventStat).toBeDefined();
    expect(eventStat).toMatchSnapshot();
  });

  test('Ticket with zero count and zero price should be ignored', async () => {
    const wb = testUtil.database.cloneWorkbook(workbook);
    const ws = WorksheetHelper.fromFirstSheet(wb);
    const colIdx = findColIdx(ws, 'Y23-ticket');

    expect(colIdx).toBeDefined();
    const row2 = ws.cell(colIdx!, '2');
    const row3 = ws.cell(colIdx!, '3');
    row2.v = toTicketList([
      { ticketName: 'meal', count: 0, price: '0', paymentMethod: '' },
      { ticketName: 'drink', count: 1, price: '1', paymentMethod: 'cash' },
    ]);
    // No ticket information for row 3 (for both events)
    row3.v = [toTicketList([]), toTicketList([])].join(ITEM_DELIMITER);

    await testUtil.database.seedFromWorkbook(wb);
    const result = await testUtil.graphql.executeSingle({
      document: EventStatQuery,
      variables: { year: 2023 },
    });
    const eventStat =
      result.data?.userCurrent.accessList[0].community.communityStat.eventStat;
    expect(eventStat).toBeDefined();
    expect(eventStat).toMatchSnapshot();
  });

  test('Ticket name with delimiter characters should be filtered', async () => {
    const wb = testUtil.database.cloneWorkbook(workbook);
    const ws = WorksheetHelper.fromFirstSheet(wb);
    const colIdx = findColIdx(ws, 'Y23-ticket');

    expect(colIdx).toBeDefined();
    const row2 = ws.cell(colIdx!, '2');
    const row3 = ws.cell(colIdx!, '3');
    row2.v = toTicketList([
      {
        ticketName: 'me:/;al',
        count: 2,
        price: '0.03',
        paymentMethod: 'ca:s/h;',
      },
      {
        ticketName: 'd:r:/i;nk',
        count: 1,
        price: '1.23',
        paymentMethod: 'cas::h',
      },
    ]);
    // No ticket information for row 3 (for both events)
    row3.v = [toTicketList([]), toTicketList([])].join(ITEM_DELIMITER);

    await testUtil.database.seedFromWorkbook(wb);
    const result = await testUtil.graphql.executeSingle({
      document: EventStatQuery,
      variables: { year: 2023 },
    });
    const eventStat =
      result.data?.userCurrent.accessList[0].community.communityStat.eventStat;
    expect(eventStat).toBeDefined();
    expect(eventStat).toMatchSnapshot();
  });
});
