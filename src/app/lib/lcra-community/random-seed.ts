import { faker } from '@faker-js/faker';

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
 * - LastModBy: 'testuser',
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
  return faker.helpers.uniqueArray(
    () =>
      faker.helpers.arrayElement([
        'New Year',
        'Easter',
        'Victoria Day',
        'Canada Day',
        'Labour Day',
        'Xmas',
      ]),
    count
  );
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
    return faker.date
      .between({
        from: `20${year}-01-01T00:00:00.000Z`,
        to: `20${year}-12-31T23:59:59.000Z`,
      })
      .toISOString();
  });
}

/**
 * Generate fields for a single membership year
 *
 * @param year Two digit year (i.e. 21)
 */
function newMembershipYear(year: number) {
  const pfx = `Y${year}`;
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
    [`${pfx}-event`]: genEvent(numEvent).join(';'),
    [`${pfx}-date`]: genDate(numEvent, year).join(';'),
    [`${pfx}-payment`]: faker.helpers.arrayElement([
      'cash',
      'cheque',
      'e-transfer',
    ]),
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
    LastModBy: 'mockeduser',
  };

  const numPerson = faker.number.int(4);
  Array.from({ length: numPerson }, (_, idx) => {
    addr = {
      ...addr,
      ...newPerson(idx + 1),
    };
  });

  addr = {
    ...addr,
    ...newMembershipYear(24),
    ...newMembershipYear(23),
    ...newMembershipYear(22),
    ...newMembershipYear(21),
  };
  return addr;
}
