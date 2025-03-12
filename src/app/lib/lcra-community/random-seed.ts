import { faker } from '@faker-js/faker';
import { type Ticket } from '@prisma/client';
import { ITEM_DELIMITER, removeDelimiter } from './delimiter-util';
import { toTicketList } from './ticket-list-util';

/**
 * Generate Community data in "LCRA" format
 *
 * Basic fields:
 *
 * - Address: '123 Adventure Drive',
 * - StreetNo: 123,
 * - StreetName: 'Adventure Drive',
 * - PostalCode: 'A0A0A0',
 * - LastModDate: '2023-02-23T03:19:09+00:00',
 * - LastModBy: 'test@email.com',
 * - Notes: '2nd entry',
 *
 * Each occupant has fields:
 *
 * - FirstName1: 'Kevin',
 * - LastName1: 'Smith',
 * - EMail1: 'ksmith@email.com',
 * - EMail1Facebook: 0,
 * - EMail1OptOut: 0,
 * - WorkPhone1: '123-456-7777',
 * - HomePhone1: '123-456-7777',
 * - CellPhone1: '123-456-7777',
 *
 * Each membership year has fields:
 *
 * - Y23: 1,
 * - 'Y23-event': 'Summer Festival;Corn Roast',
 * - 'Y23-date': '2023-06-12T12:07:25-04:00;2023-08-20T17:07:25-04:00',
 * - 'Y23-ticket': 'meal:20:0:free;drink:1:1:cash',
 * - 'Y23-price': '15',
 * - 'Y23-payment': 'cash',
 * - 'Y23-deposited': 1,
 *
 * @param numEntries Number of address to generate
 * @returns
 */
export function seedCommunityData(numEntries: number) {
  const data = Array.from({ length: numEntries }, () => {
    const addr = newAddress();
    return addr;
  });
  // No need to sort here, because the address entries are
  // not necessarily inserted in order when inserting them
  // in prisma
  return data;
}

/**
 * Generate an array of random event names
 *
 * @param count Number of events to generate
 * @returns
 */
function genEvent(count: number) {
  return faker.helpers.uniqueArray(() => {
    const eventName = faker.helpers.arrayElement([
      'Membership Form',
      'Town Hall',
      'Clean-Up',
      'Meet & Greet',
      'Community Forum',
      'Town Planning Night',
    ]);
    return removeDelimiter(eventName);
  }, count);
}

/**
 * Generate an array of random ticket objects for each event
 *
 * @param eventCount Number of events to generate
 * @returns
 */
function genTicket(eventCount: number) {
  return Array.from({ length: eventCount }, () => {
    const ticketCount = faker.number.int({ min: 0, max: 3 });
    const ticketList: Ticket[] = Array.from({ length: ticketCount }, () => {
      const ticketName = faker.helpers.arrayElement([
        'Meal',
        'Coffee',
        'Snack',
      ]);
      const count = faker.number.int({ min: 0, max: 20 });
      const price = faker.finance.amount({ min: 0, max: 10, dec: 0 });
      const paymentMethod = genPaymentMethod();
      return { ticketName, count, price, paymentMethod };
    });
    return toTicketList(ticketList);
  });
}

/**
 * Generate an array of random dates within the given year
 *
 * @param count Number of dates to generate
 * @param year Year (last two digits) to generate dates in
 * @returns
 */
function genDate(count: number, year: number) {
  return Array.from({ length: count }, () => {
    const someDate = faker.date
      .between({
        from: `${year}-01-01T00:00:00.000Z`,
        to: `${year}-12-31T23:59:59.000Z`,
      })
      .toISOString();
    return removeDelimiter(someDate);
  });
}

/** Generate a random payment method */
function genPaymentMethod() {
  return faker.helpers.arrayElement(['cash', 'cheque', 'e-transfer']);
}

/**
 * Generate fields for a single membership year
 *
 * @param year
 */
function newMembershipYear(year: number) {
  // year must be two digits only
  const pfx = `Y${year % 100}`;
  const isMember = faker.datatype.boolean();
  if (!isMember) {
    return {
      [`${pfx}`]: 0,
    };
  }

  // Create a membership year
  const numEvent = faker.number.int({ min: 1, max: 5 });
  return {
    [`${pfx}`]: 1,
    [`${pfx}-event`]: genEvent(numEvent).join(ITEM_DELIMITER),
    [`${pfx}-date`]: genDate(numEvent, year).join(ITEM_DELIMITER),
    [`${pfx}-ticket`]: genTicket(numEvent).join(ITEM_DELIMITER),
    [`${pfx}-price`]: faker.finance.amount({ min: 10, max: 20, dec: 0 }),
    [`${pfx}-payment`]: genPaymentMethod(),
    [`${pfx}-deposited`]: faker.number.int(1),
  };
}

/**
 * Generate fields for a single person
 *
 * @param num The index number for the person to be generated
 * @returns
 */
function newPerson(num: number) {
  const person = {
    [`FirstName${num}`]: faker.person.firstName(),
    [`LastName${num}`]: faker.person.lastName(),
    [`EMail${num}`]: faker.internet.email(),
    [`EMail${num}OptOut`]: faker.number.int(1),
    [`HomePhone${num}`]: faker.phone.number(),
    [`WorkPhone${num}`]: faker.phone.number(),
    [`CellPhone${num}`]: faker.phone.number(),
  };
  return person;
}

/**
 * Generate fields for a single address
 *
 * @returns
 */
function newAddress() {
  const StreetNo = faker.location.buildingNumber();
  const StreetName = faker.location.street();
  const Address = `${StreetNo} ${StreetName}`;

  let addr = {
    Address,
    StreetNo,
    StreetName,
    PostalCode: faker.location.zipCode(),
    Notes: faker.lorem.sentences({ min: 1, max: 5 }, '\n'),
    LastModDate: faker.date.past().toISOString(),
    LastModBy: 'test@email.com',
  };

  const numPerson = faker.number.int(4);
  Array.from({ length: numPerson }, (_, idx) => {
    addr = {
      ...addr,
      ...newPerson(idx + 1),
    };
  });

  const currentYear = new Date().getFullYear();

  addr = {
    ...addr,
    ...newMembershipYear(currentYear),
    ...newMembershipYear(currentYear - 1),
    ...newMembershipYear(currentYear - 2),
    ...newMembershipYear(currentYear - 3),
  };
  return addr;
}
