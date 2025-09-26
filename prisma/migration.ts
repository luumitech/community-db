import { ContactInfoType, PrismaClient, type Occupant } from '@prisma/client';

function insertIf<T>(condition: boolean, ...elements: T[]) {
  return condition ? elements : [];
}

async function main() {
  const prisma = new PrismaClient();

  try {
    console.log('Starting migration...');

    // Find all documents that have the oldTags field
    const documentsToMigrate = await prisma.property.findMany({
      where: {
        // id: '68715a541752e3221f2c81db',
      },
    });

    console.log(`Found ${documentsToMigrate.length} documents to migrate.`);

    for (const doc of documentsToMigrate) {
      const occupantList: Occupant[] = [];
      for (const occupant of doc.occupantList) {
        const newEntry: Occupant = {
          firstName: occupant.firstName,
          lastName: occupant.lastName,
          optOut: occupant.optOut,
          email: occupant.email,
          home: occupant.home,
          work: occupant.work,
          cell: occupant.cell,
          infoList: [
            ...insertIf(!!occupant.email, {
              label: 'email',
              type: ContactInfoType.EMAIL,
              value: occupant.email!,
            }),
            ...insertIf(!!occupant.home, {
              label: 'home',
              type: ContactInfoType.PHONE,
              value: occupant.home!,
            }),
            ...insertIf(!!occupant.work, {
              label: 'work',
              type: ContactInfoType.PHONE,
              value: occupant.work!,
            }),
            ...insertIf(!!occupant.cell, {
              label: 'cell',
              type: ContactInfoType.PHONE,
              value: occupant.cell!,
            }),
          ],
        };
        occupantList.push(newEntry);
      }
      await prisma.property.update({
        where: {
          id: doc.id,
        },
        data: {
          occupantList,
        },
      });

      console.log(`Migrated user with ID: ${doc.shortId}, ${doc.address}`);
    }

    console.log('Migration finished successfully.');
  } catch (e) {
    console.error('Migration failed:', e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
