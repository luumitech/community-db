import { Occupant } from '@prisma/client';
import { GraphQLError } from 'graphql';
import { builder } from '~/graphql/builder';
import prisma from '~/lib/prisma';
import { getCommunityEntry } from '../community/util';
import { propertyListFindManyArgs } from '../property/util';
import { mailchimpAudienceRef, mailchimpMemberRef } from './object';
import { getMailchimpApi } from './util';

const MailchimpAudienceListInput = builder.inputType(
  'MailchimpAudienceListInput',
  {
    fields: (t) => ({
      communityId: t.string({ required: true }),
    }),
  }
);

builder.queryField('mailchimpAudienceList', (t) =>
  t.field({
    type: [mailchimpAudienceRef],
    args: {
      input: t.arg({ type: MailchimpAudienceListInput, required: true }),
    },
    resolve: async (parent, args, ctx) => {
      const { user } = ctx;
      const { communityId } = args.input;
      const shortId = communityId;

      // const api = await getMailchimpApi(user, shortId);
      // const audienceList = await api.audience.lists(['id', 'name']);

      // const result = audienceList.map((entry) => ({
      //   listId: entry.id,
      //   name: entry.name,
      // }));
      // return result;

      return [{ name: 'LuumiTech Consulting Inc.', listId: '9e1f03ec3e' }];
      // return audienceList;
    },
  })
);

const MailchimpMemberListInput = builder.inputType('MailchimpMemberListInput', {
  fields: (t) => ({
    communityId: t.string({ required: true }),
    listId: t.string({ required: true }),
  }),
});

builder.queryField('mailchimpMemberList', (t) =>
  t.field({
    type: [mailchimpMemberRef],
    args: {
      input: t.arg({ type: MailchimpMemberListInput, required: true }),
    },
    resolve: async (parent, args, ctx) => {
      const { user } = ctx;
      const { communityId: shortId, listId } = args.input;

      // const api = await getMailchimpApi(user, shortId);
      // const memberList = await api.audience.memberLists(listId, [
      //   'email_address',
      //   'full_name',
      //   'status',
      // ]);

      // const result = memberList.map((entry) => ({
      //   email: entry.email_address,
      //   fullName: entry.full_name,
      //   status: entry.status,
      // }));
      // return result;

      const community = await getCommunityEntry(user, shortId);
      const findManyArgs = await propertyListFindManyArgs(community.id, null);
      const propertyList = await prisma.property.findMany({
        ...findManyArgs,
        select: {
          address: true,
          occupantList: true,
        },
      });

      const occupantMap = new Map<string, Occupant>();
      propertyList.forEach((entry) => {
        entry.occupantList.forEach((occupant) => {
          if (occupant.email) {
            occupantMap.set(occupant.email, occupant);
          }
        });
      });

      // const cleanedAndNotInDB: Occupant[] = [];
      // const subscribedButOptout: Occupant[] = [];
      // const unsubscribedButNotOptout: Occupant[] = [];
      const notInDB: Occupant[] = [];
      const inDB: Occupant[] = [];

      const result = [
        {
          __typename: 'MailchimpMember',
          email: 'kendrickw@luumitech.com',
          fullName: 'Kendrick Wong',
          status: 'subscribed',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Keara_Kautzer@yahoo.com',
          fullName: 'Carmella Maggio',
          status: 'cleaned',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Shawn_Schmidt@hotmail.com',
          fullName: 'Orie Langosh',
          status: 'cleaned',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Gussie60@hotmail.com',
          fullName: 'Retha Kihn',
          status: 'cleaned',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Valentine13@yahoo.com',
          fullName: 'Emmet Block',
          status: 'cleaned',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Elmira81@hotmail.com',
          fullName: 'Pierce Mayert',
          status: 'cleaned',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Kaylin.Nader87@gmail.com',
          fullName: 'Javonte Monahan',
          status: 'cleaned',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Rey_Gottlieb97@hotmail.com',
          fullName: 'Arvid Buckridge',
          status: 'cleaned',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Lafayette_Kutch34@hotmail.com',
          fullName: 'Amy Corwin',
          status: 'cleaned',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Judy.Mante47@hotmail.com',
          fullName: 'Jena Pouros',
          status: 'cleaned',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Percy72@gmail.com',
          fullName: 'Randy Ebert',
          status: 'cleaned',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Porter.Schiller9@hotmail.com',
          fullName: 'Viva Nienow',
          status: 'cleaned',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Jessyca.OKeefe@gmail.com',
          fullName: 'Elian Pollich',
          status: 'cleaned',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Roy_Runte@hotmail.com',
          fullName: 'Mariah Huel',
          status: 'cleaned',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Eugenia_Brekke12@gmail.com',
          fullName: 'Rene Raynor',
          status: 'cleaned',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Kobe0@gmail.com',
          fullName: 'Jerrell Kub',
          status: 'cleaned',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Therese.Kutch78@yahoo.com',
          fullName: 'Tony Baumbach',
          status: 'cleaned',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Emelia.Herzog@hotmail.com',
          fullName: 'Sandra Wolf',
          status: 'cleaned',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Stefanie94@gmail.com',
          fullName: 'Tremaine Bogisich',
          status: 'cleaned',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Hyman_Jenkins53@yahoo.com',
          fullName: 'Elbert Metz',
          status: 'cleaned',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Godfrey_Boyle@yahoo.com',
          fullName: 'Demetris Walter',
          status: 'cleaned',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Mariana.West@yahoo.com',
          fullName: 'Juston Hackett',
          status: 'cleaned',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Glennie.Bashirian89@hotmail.com',
          fullName: 'Geoffrey Batz',
          status: 'cleaned',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Thea_Zemlak@yahoo.com',
          fullName: 'Newell Ankunding',
          status: 'cleaned',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Ivah_Franecki@hotmail.com',
          fullName: 'Veda Becker',
          status: 'cleaned',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Heath_Bednar@gmail.com',
          fullName: 'Lou Lockman',
          status: 'cleaned',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Jaeden.Rempel@hotmail.com',
          fullName: 'Fanny Schiller',
          status: 'cleaned',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Jazmin30@yahoo.com',
          fullName: 'Birdie Weissnat',
          status: 'cleaned',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Toney13@gmail.com',
          fullName: 'Lonny Turcotte',
          status: 'cleaned',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Una.Parisian@yahoo.com',
          fullName: 'Mathilde Donnelly',
          status: 'cleaned',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Judge_McCullough@yahoo.com',
          fullName: 'Marcos Wolf',
          status: 'cleaned',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Margaretta_Bartell@gmail.com',
          fullName: 'Dallin Cronin',
          status: 'cleaned',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Jeramie_Volkman@yahoo.com',
          fullName: 'Hector Hoppe',
          status: 'cleaned',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Fred_Deckow71@hotmail.com',
          fullName: 'Alysa Gerlach',
          status: 'cleaned',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Karlie26@yahoo.com',
          fullName: 'Jovanny Dibbert',
          status: 'cleaned',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Pierce.Adams50@gmail.com',
          fullName: 'Lilyan Brakus-Corwin',
          status: 'cleaned',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Allan_Collier@gmail.com',
          fullName: 'Dax Simonis',
          status: 'cleaned',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Hettie.Heathcote@hotmail.com',
          fullName: 'Fatima Beahan',
          status: 'cleaned',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Stephania17@yahoo.com',
          fullName: 'Lenny Cremin',
          status: 'cleaned',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Tamara75@hotmail.com',
          fullName: 'Rosalee Wyman',
          status: 'cleaned',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Bailey_Sipes51@gmail.com',
          fullName: 'Kadin Thompson',
          status: 'cleaned',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Tina.Langosh@yahoo.com',
          fullName: 'Marley Schroeder',
          status: 'cleaned',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Asia.Veum@gmail.com',
          fullName: 'Rebeca Reichel',
          status: 'cleaned',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Kelton_Miller@yahoo.com',
          fullName: 'Luther Davis',
          status: 'cleaned',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Merle.Halvorson79@yahoo.com',
          fullName: 'Viola Toy-Williamson',
          status: 'cleaned',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Jerrold.Fadel33@yahoo.com',
          fullName: 'Ashlee Turcotte',
          status: 'cleaned',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Ward40@hotmail.com',
          fullName: 'Juanita Hansen',
          status: 'cleaned',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Koby70@gmail.com',
          fullName: 'Cullen Green',
          status: 'cleaned',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Cornelius.Crooks53@yahoo.com',
          fullName: 'Kellie Weissnat',
          status: 'cleaned',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Bryce_Windler88@gmail.com',
          fullName: 'Rosalee Johnston',
          status: 'cleaned',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Vella58@hotmail.com',
          fullName: 'Kelley Hackett',
          status: 'cleaned',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Ewell_Treutel47@gmail.com',
          fullName: 'Otho Reinger',
          status: 'cleaned',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Zula_Bradtke@hotmail.com',
          fullName: 'Chelsie Boehm',
          status: 'cleaned',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Tanner65@yahoo.com',
          fullName: 'Christian Dach',
          status: 'cleaned',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Eloy_Grant86@hotmail.com',
          fullName: 'Bettie Batz',
          status: 'cleaned',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Margret.Johnston99@yahoo.com',
          fullName: 'Cassandra Brakus',
          status: 'cleaned',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Sophia.Kerluke89@hotmail.com',
          fullName: 'Karli Tillman',
          status: 'cleaned',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Brennon.Moen89@gmail.com',
          fullName: 'Alexanne Waters',
          status: 'cleaned',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Bridgette_Kessler8@gmail.com',
          fullName: 'Rafaela Reichert',
          status: 'cleaned',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Okey_Skiles44@yahoo.com',
          fullName: 'Bernita Ryan',
          status: 'cleaned',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Diana_Larson11@gmail.com',
          fullName: 'Addie Upton',
          status: 'cleaned',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Karlee.Grant4@hotmail.com',
          fullName: 'Sabina Ernser',
          status: 'cleaned',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Angelina_DuBuque@hotmail.com',
          fullName: 'Irving Nader',
          status: 'cleaned',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Tremaine.Cummerata@hotmail.com',
          fullName: 'Roselyn Paucek',
          status: 'cleaned',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Bethany_Jast73@yahoo.com',
          fullName: 'Golda Zboncak',
          status: 'cleaned',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Fabian.Orn@hotmail.com',
          fullName: 'Zackary Gerlach',
          status: 'cleaned',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Helmer17@gmail.com',
          fullName: 'Charlie Batz',
          status: 'cleaned',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Mekhi.Kunze@gmail.com',
          fullName: 'Sasha Mraz',
          status: 'cleaned',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Pearl31@yahoo.com',
          fullName: 'Cheyenne Jacobs',
          status: 'cleaned',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Tatum.Hudson@hotmail.com',
          fullName: 'Clotilde Kub',
          status: 'cleaned',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Velda.Gutmann@gmail.com',
          fullName: 'Bianka Bashirian',
          status: 'cleaned',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Arch_Rippin-Schuppe@gmail.com',
          fullName: 'Krystel Reilly',
          status: 'cleaned',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Angelo.Gutkowski@hotmail.com',
          fullName: 'Michael Grant',
          status: 'cleaned',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Shayna.Rogahn@gmail.com',
          fullName: "Margarita O'Kon",
          status: 'cleaned',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Finn89@yahoo.com',
          fullName: 'Porter Batz',
          status: 'cleaned',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Bertrand32@yahoo.com',
          fullName: 'Colton Kerluke',
          status: 'cleaned',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Carroll86@gmail.com',
          fullName: 'Cooper Ortiz',
          status: 'cleaned',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Rhea89@hotmail.com',
          fullName: 'Shaniya Auer',
          status: 'cleaned',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Verna50@yahoo.com',
          fullName: 'Alta Macejkovic',
          status: 'cleaned',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Rhoda.Schumm56@gmail.com',
          fullName: 'Chloe Hoeger',
          status: 'cleaned',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Jermain11@yahoo.com',
          fullName: 'Cleora Gutmann',
          status: 'cleaned',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Charlotte88@hotmail.com',
          fullName: 'Chet Crona',
          status: 'cleaned',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Claude_Renner-Schimmel89@yahoo.com',
          fullName: 'Thad Luettgen',
          status: 'cleaned',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Mabelle18@hotmail.com',
          fullName: 'Kian Halvorson',
          status: 'cleaned',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Gordon.Leuschke@gmail.com',
          fullName: 'Connie Koelpin',
          status: 'cleaned',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Jessy_Braun9@hotmail.com',
          fullName: 'Thad Purdy',
          status: 'cleaned',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Elda.Hettinger@gmail.com',
          fullName: 'Eula Hackett',
          status: 'cleaned',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Cooper_Keebler51@yahoo.com',
          fullName: 'Alexa Mertz',
          status: 'cleaned',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Hardy_Mueller57@hotmail.com',
          fullName: 'Korbin Parisian',
          status: 'cleaned',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Sheldon_Fahey55@yahoo.com',
          fullName: 'Ruben Ritchie',
          status: 'cleaned',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Kayleigh.Schulist50@yahoo.com',
          fullName: 'Estel Reichert',
          status: 'cleaned',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Pearlie.Stokes@yahoo.com',
          fullName: 'Jamar Klein',
          status: 'cleaned',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Celestino.Lowe12@gmail.com',
          fullName: 'Edward Lemke',
          status: 'cleaned',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Bridie6@hotmail.com',
          fullName: 'Paul Mertz',
          status: 'cleaned',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Karelle3@gmail.com',
          fullName: 'Alek Kohler',
          status: 'cleaned',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Heath25@hotmail.com',
          fullName: 'Dejon Beer',
          status: 'cleaned',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Clemens_Kertzmann@hotmail.com',
          fullName: 'Cecile Bosco',
          status: 'cleaned',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Aaron57@yahoo.com',
          fullName: 'Declan Fadel',
          status: 'transactional',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Everette55@hotmail.com',
          fullName: 'Julius Green',
          status: 'transactional',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Rubye85@yahoo.com',
          fullName: 'Chet Roob',
          status: 'transactional',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Polly.Torphy@gmail.com',
          fullName: 'Ivy Stamm',
          status: 'transactional',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Tyra.Kiehn34@yahoo.com',
          fullName: 'Zoila Green',
          status: 'transactional',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Guillermo10@yahoo.com',
          fullName: 'Janessa Johnston',
          status: 'transactional',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Joyce.White@yahoo.com',
          fullName: 'Jerome Cassin',
          status: 'transactional',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Madison12@gmail.com',
          fullName: 'Ellie Gerhold',
          status: 'transactional',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Keon.Kilback99@gmail.com',
          fullName: 'Otho Buckridge',
          status: 'transactional',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Evalyn.Boyer@hotmail.com',
          fullName: 'Margot Littel',
          status: 'transactional',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Sheridan.Gulgowski21@hotmail.com',
          fullName: 'Monica Rau',
          status: 'transactional',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Bertrand_Zboncak@gmail.com',
          fullName: 'Stella Davis',
          status: 'transactional',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Otis_Terry@yahoo.com',
          fullName: 'Pansy Champlin',
          status: 'transactional',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Jerel.Daniel47@yahoo.com',
          fullName: 'Madisyn Hand',
          status: 'transactional',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Hassie.Nader@hotmail.com',
          fullName: 'Lori Beahan',
          status: 'transactional',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Dorthy_Nicolas@gmail.com',
          fullName: 'Savanna Terry',
          status: 'transactional',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Zoey58@yahoo.com',
          fullName: 'Kyra Block',
          status: 'transactional',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Marietta.Hayes@gmail.com',
          fullName: 'Virgie Konopelski',
          status: 'transactional',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Cleo_Orn85@yahoo.com',
          fullName: 'Kelsie Cassin',
          status: 'transactional',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Ethyl_Lemke26@yahoo.com',
          fullName: 'Lon Abshire',
          status: 'transactional',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Austin_Wunsch31@hotmail.com',
          fullName: 'Hudson Kuphal',
          status: 'transactional',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Madonna_Kemmer50@hotmail.com',
          fullName: 'Don Cummerata',
          status: 'transactional',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Hallie_Fadel@yahoo.com',
          fullName: 'Lou Graham-Keeling',
          status: 'transactional',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Judah_Windler@gmail.com',
          fullName: 'Shyann Considine',
          status: 'transactional',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Emilie_Yost64@yahoo.com',
          fullName: 'Kavon Muller',
          status: 'transactional',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Verlie_Gutkowski-Gutkowski26@yahoo.com',
          fullName: 'Walter Botsford',
          status: 'transactional',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Kyleigh51@yahoo.com',
          fullName: 'Mohamed Wehner',
          status: 'transactional',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Jayde.Satterfield@hotmail.com',
          fullName: 'Gia Ortiz',
          status: 'transactional',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Baylee.Collier26@hotmail.com',
          fullName: 'Cheyenne Koch',
          status: 'transactional',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Omari24@gmail.com',
          fullName: 'Macey Carroll',
          status: 'transactional',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Eva.Predovic46@gmail.com',
          fullName: 'Kiara Lynch',
          status: 'transactional',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Ansley30@hotmail.com',
          fullName: 'Dax Konopelski',
          status: 'transactional',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Alejandrin.Boyer0@gmail.com',
          fullName: 'Christian Shanahan',
          status: 'transactional',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Curt31@gmail.com',
          fullName: 'Wellington Abbott-Bashirian',
          status: 'transactional',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Dayna.Dickinson52@yahoo.com',
          fullName: 'Finn Gorczany',
          status: 'transactional',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Verner33@hotmail.com',
          fullName: 'Prudence Bode',
          status: 'transactional',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Alvina.Will97@yahoo.com',
          fullName: 'Casey Waters',
          status: 'transactional',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Julianne99@hotmail.com',
          fullName: 'Deborah Champlin',
          status: 'transactional',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Dorris94@gmail.com',
          fullName: 'Aaron Nitzsche',
          status: 'transactional',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Arvid_Stroman29@gmail.com',
          fullName: 'Lavon Botsford',
          status: 'transactional',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Chelsie93@gmail.com',
          fullName: 'Janick Abbott',
          status: 'transactional',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Sage33@hotmail.com',
          fullName: 'Edwin Beatty',
          status: 'transactional',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Julia_Schaefer@gmail.com',
          fullName: 'Dorothea Jerde-Gulgowski',
          status: 'transactional',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Hoyt8@hotmail.com',
          fullName: 'Rolando Kirlin',
          status: 'transactional',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Ike_Hagenes@gmail.com',
          fullName: 'Asha Lakin',
          status: 'transactional',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Laila.Will66@gmail.com',
          fullName: 'Chaz Gerlach',
          status: 'transactional',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Hortense79@gmail.com',
          fullName: 'Dorothy Kling',
          status: 'transactional',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Charlotte.Swift@gmail.com',
          fullName: 'Jacey Shields',
          status: 'transactional',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Nikita.Heller7@gmail.com',
          fullName: 'Carolyn Schroeder',
          status: 'transactional',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Margarita15@yahoo.com',
          fullName: 'Beaulah Denesik',
          status: 'transactional',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Jed57@hotmail.com',
          fullName: 'Yoshiko Leuschke',
          status: 'transactional',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Rogelio.Weimann@yahoo.com',
          fullName: 'Tad Gottlieb',
          status: 'transactional',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Audrey.Haley55@yahoo.com',
          fullName: 'Adaline Bauch',
          status: 'transactional',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Blanche_Waters@hotmail.com',
          fullName: 'Emie Cartwright',
          status: 'transactional',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Briana.Ullrich@yahoo.com',
          fullName: 'Wendy Johns',
          status: 'transactional',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Lemuel.Corkery76@gmail.com',
          fullName: 'Cyril Blick-Deckow',
          status: 'transactional',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Brionna_Lueilwitz70@gmail.com',
          fullName: 'Hoyt Schamberger',
          status: 'transactional',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Jalon.Watsica24@gmail.com',
          fullName: 'Dusty Larson',
          status: 'transactional',
        },
        {
          __typename: 'MailchimpMember',
          email: 'King.Price@gmail.com',
          fullName: 'Antonetta Casper',
          status: 'transactional',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Donnell.Mertz68@hotmail.com',
          fullName: 'Darrell Franey',
          status: 'transactional',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Gavin72@gmail.com',
          fullName: 'Major Boehm-Thompson',
          status: 'transactional',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Imani_Ledner75@hotmail.com',
          fullName: 'Shanel Windler',
          status: 'transactional',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Frances61@yahoo.com',
          fullName: 'Toy Greenfelder',
          status: 'transactional',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Terrence.Cruickshank@yahoo.com',
          fullName: 'Renee Douglas',
          status: 'transactional',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Elijah.Reichel6@yahoo.com',
          fullName: 'Alexander Schiller-Durgan',
          status: 'transactional',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Richie_Mayer10@gmail.com',
          fullName: 'Donavon Davis',
          status: 'transactional',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Lia_Walsh@yahoo.com',
          fullName: 'Mike Zieme',
          status: 'transactional',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Eulalia88@gmail.com',
          fullName: 'Joel Denesik',
          status: 'transactional',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Lourdes_Prohaska@gmail.com',
          fullName: 'Jeanne Senger',
          status: 'transactional',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Arnulfo58@gmail.com',
          fullName: 'Mollie VonRueden',
          status: 'transactional',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Shaun_Lemke@yahoo.com',
          fullName: "Mae D'Amore",
          status: 'transactional',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Emmanuel.Price@gmail.com',
          fullName: 'Cecil Reilly',
          status: 'transactional',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Donato42@yahoo.com',
          fullName: 'Murray Corwin',
          status: 'transactional',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Linda_Medhurst41@gmail.com',
          fullName: 'Eden Kunze',
          status: 'transactional',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Mitchel_Senger39@hotmail.com',
          fullName: 'Ally Weissnat',
          status: 'transactional',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Reta92@yahoo.com',
          fullName: 'Elise Tremblay',
          status: 'transactional',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Marcus_Douglas@hotmail.com',
          fullName: 'Cydney Stokes',
          status: 'transactional',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Jamil44@yahoo.com',
          fullName: 'Janae Block',
          status: 'transactional',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Geo_McLaughlin64@gmail.com',
          fullName: 'Maye Luettgen',
          status: 'transactional',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Jay_Herman65@yahoo.com',
          fullName: 'Aileen Hills',
          status: 'transactional',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Quentin_Sawayn@gmail.com',
          fullName: 'Lisa Maggio',
          status: 'transactional',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Armando.Hickle9@yahoo.com',
          fullName: 'Ona Kuvalis',
          status: 'transactional',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Brennon.Mertz@hotmail.com',
          fullName: 'Ena Kautzer',
          status: 'transactional',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Deanna_Bradtke6@hotmail.com',
          fullName: 'Cyrus Erdman',
          status: 'transactional',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Heather.Volkman17@gmail.com',
          fullName: 'Aurelia Hagenes',
          status: 'transactional',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Reed56@gmail.com',
          fullName: 'Sammie Farrell',
          status: 'transactional',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Makayla_Goyette27@hotmail.com',
          fullName: 'Wiley Mertz',
          status: 'transactional',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Randy53@yahoo.com',
          fullName: 'Oswaldo Welch',
          status: 'transactional',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Jacynthe.Kozey17@yahoo.com',
          fullName: 'Libby Pfeffer',
          status: 'transactional',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Beryl_Rempel@yahoo.com',
          fullName: 'Foster Von',
          status: 'transactional',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Jodie_Christiansen61@yahoo.com',
          fullName: 'Blaise Emmerich',
          status: 'transactional',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Caitlyn68@yahoo.com',
          fullName: 'Ilene Kassulke',
          status: 'transactional',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Cassidy.Ward@yahoo.com',
          fullName: 'Kiara Bashirian',
          status: 'transactional',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Penelope_Flatley@yahoo.com',
          fullName: 'Amina Graham',
          status: 'transactional',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Mertie.Ledner@gmail.com',
          fullName: 'Felicity Windler',
          status: 'transactional',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Norberto62@gmail.com',
          fullName: 'Nathaniel Rodriguez',
          status: 'transactional',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Kendall.Wunsch@gmail.com',
          fullName: 'Maverick Hahn',
          status: 'transactional',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Sammie.Dare@gmail.com',
          fullName: 'Lelia Reichel',
          status: 'transactional',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Davin_Corkery@yahoo.com',
          fullName: 'Alexandra Dooley',
          status: 'transactional',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Leanna67@yahoo.com',
          fullName: 'Abraham Gulgowski',
          status: 'transactional',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Corine_Boehm69@hotmail.com',
          fullName: 'Roberta Connelly',
          status: 'transactional',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Doris_Homenick@hotmail.com',
          fullName: 'Arthur Brown',
          status: 'transactional',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Halle_Orn56@yahoo.com',
          fullName: 'Abby Gutmann-Block',
          status: 'transactional',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Colten_Armstrong@hotmail.com',
          fullName: 'Koby Labadie',
          status: 'transactional',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Winifred_Schmitt-Sanford89@yahoo.com',
          fullName: "Baby D'Amore",
          status: 'transactional',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Jaclyn.Berge25@hotmail.com',
          fullName: 'Reyna Koss',
          status: 'transactional',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Emelia.Hettinger@yahoo.com',
          fullName: 'Garret Hahn-Bashirian',
          status: 'transactional',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Jettie_Wolff@hotmail.com',
          fullName: 'Ora Cummerata',
          status: 'transactional',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Vickie_Zemlak@hotmail.com',
          fullName: 'Shana Wiegand',
          status: 'transactional',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Selina.Volkman@hotmail.com',
          fullName: 'Ebony Gibson',
          status: 'transactional',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Zella.Sawayn@yahoo.com',
          fullName: 'Drake Carter',
          status: 'transactional',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Neoma.Breitenberg@hotmail.com',
          fullName: 'Dee Schuppe',
          status: 'transactional',
        },
      ];

      result.forEach((item) => {
        const found = occupantMap.get(item.email);
        if (found) {
          inDB.push(found);
        } else {
          if (item.status !== 'cleaned') {
            notInDB.push({
              firstName: item.fullName,
              lastName: null,
              email: item.email,
              home: null,
              work: null,
              cell: null,
              optOut: item.status === 'unsubscribed',
            });
          }
        }
      });
      console.log({ inDB: inDB.length, notInDB: notInDB.length });
      // console.log({ notInDB });

      return [];
    },
  })
);
