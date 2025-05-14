import { GraphQLError } from 'graphql';
import { builder } from '~/graphql/builder';
import { MailchimpApi } from '~/lib/mailchimp';
import { parseAsNumber } from '~/lib/number-util';
import { getCommunityEntry } from '../community/util';
import { mailchimpMemberRef } from './object';

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
      const { communityId, listId } = args.input;
      const shortId = communityId;
      // const entry = await getCommunityEntry(user, shortId, {
      //   select: {
      //     mailchimpSetting: true,
      //   },
      // });
      // if (!entry.mailchimpSetting?.apiKey) {
      //   throw new GraphQLError(`Mailchimp API key not provided`);
      // }
      // const api = MailchimpApi.fromEncryptedApiKey(
      //   entry.mailchimpSetting.apiKey
      // );
      // const memberList = await api.audience.memberLists('9e1f03ec3e');

      // const result = memberList.map((entry) => ({
      //   email: entry.email_address,
      //   fullName: entry.full_name,
      // }));
      // return result;

      return [
        {
          __typename: 'MailchimpMember',
          email: 'kendrickw@luumitech.com',
          fullName: 'Kendrick Wong',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Keara_Kautzer@yahoo.com',
          fullName: 'Carmella Maggio',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Shawn_Schmidt@hotmail.com',
          fullName: 'Orie Langosh',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Gussie60@hotmail.com',
          fullName: 'Retha Kihn',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Valentine13@yahoo.com',
          fullName: 'Emmet Block',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Elmira81@hotmail.com',
          fullName: 'Pierce Mayert',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Kaylin.Nader87@gmail.com',
          fullName: 'Javonte Monahan',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Rey_Gottlieb97@hotmail.com',
          fullName: 'Arvid Buckridge',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Lafayette_Kutch34@hotmail.com',
          fullName: 'Amy Corwin',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Judy.Mante47@hotmail.com',
          fullName: 'Jena Pouros',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Percy72@gmail.com',
          fullName: 'Randy Ebert',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Porter.Schiller9@hotmail.com',
          fullName: 'Viva Nienow',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Jessyca.OKeefe@gmail.com',
          fullName: 'Elian Pollich',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Roy_Runte@hotmail.com',
          fullName: 'Mariah Huel',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Eugenia_Brekke12@gmail.com',
          fullName: 'Rene Raynor',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Kobe0@gmail.com',
          fullName: 'Jerrell Kub',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Therese.Kutch78@yahoo.com',
          fullName: 'Tony Baumbach',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Emelia.Herzog@hotmail.com',
          fullName: 'Sandra Wolf',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Stefanie94@gmail.com',
          fullName: 'Tremaine Bogisich',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Hyman_Jenkins53@yahoo.com',
          fullName: 'Elbert Metz',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Godfrey_Boyle@yahoo.com',
          fullName: 'Demetris Walter',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Mariana.West@yahoo.com',
          fullName: 'Juston Hackett',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Glennie.Bashirian89@hotmail.com',
          fullName: 'Geoffrey Batz',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Thea_Zemlak@yahoo.com',
          fullName: 'Newell Ankunding',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Ivah_Franecki@hotmail.com',
          fullName: 'Veda Becker',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Heath_Bednar@gmail.com',
          fullName: 'Lou Lockman',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Jaeden.Rempel@hotmail.com',
          fullName: 'Fanny Schiller',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Jazmin30@yahoo.com',
          fullName: 'Birdie Weissnat',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Toney13@gmail.com',
          fullName: 'Lonny Turcotte',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Una.Parisian@yahoo.com',
          fullName: 'Mathilde Donnelly',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Judge_McCullough@yahoo.com',
          fullName: 'Marcos Wolf',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Margaretta_Bartell@gmail.com',
          fullName: 'Dallin Cronin',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Jeramie_Volkman@yahoo.com',
          fullName: 'Hector Hoppe',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Fred_Deckow71@hotmail.com',
          fullName: 'Alysa Gerlach',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Karlie26@yahoo.com',
          fullName: 'Jovanny Dibbert',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Pierce.Adams50@gmail.com',
          fullName: 'Lilyan Brakus-Corwin',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Allan_Collier@gmail.com',
          fullName: 'Dax Simonis',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Hettie.Heathcote@hotmail.com',
          fullName: 'Fatima Beahan',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Stephania17@yahoo.com',
          fullName: 'Lenny Cremin',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Tamara75@hotmail.com',
          fullName: 'Rosalee Wyman',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Bailey_Sipes51@gmail.com',
          fullName: 'Kadin Thompson',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Tina.Langosh@yahoo.com',
          fullName: 'Marley Schroeder',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Asia.Veum@gmail.com',
          fullName: 'Rebeca Reichel',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Kelton_Miller@yahoo.com',
          fullName: 'Luther Davis',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Merle.Halvorson79@yahoo.com',
          fullName: 'Viola Toy-Williamson',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Jerrold.Fadel33@yahoo.com',
          fullName: 'Ashlee Turcotte',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Ward40@hotmail.com',
          fullName: 'Juanita Hansen',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Koby70@gmail.com',
          fullName: 'Cullen Green',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Cornelius.Crooks53@yahoo.com',
          fullName: 'Kellie Weissnat',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Bryce_Windler88@gmail.com',
          fullName: 'Rosalee Johnston',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Vella58@hotmail.com',
          fullName: 'Kelley Hackett',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Ewell_Treutel47@gmail.com',
          fullName: 'Otho Reinger',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Zula_Bradtke@hotmail.com',
          fullName: 'Chelsie Boehm',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Tanner65@yahoo.com',
          fullName: 'Christian Dach',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Eloy_Grant86@hotmail.com',
          fullName: 'Bettie Batz',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Margret.Johnston99@yahoo.com',
          fullName: 'Cassandra Brakus',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Sophia.Kerluke89@hotmail.com',
          fullName: 'Karli Tillman',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Brennon.Moen89@gmail.com',
          fullName: 'Alexanne Waters',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Bridgette_Kessler8@gmail.com',
          fullName: 'Rafaela Reichert',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Okey_Skiles44@yahoo.com',
          fullName: 'Bernita Ryan',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Diana_Larson11@gmail.com',
          fullName: 'Addie Upton',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Karlee.Grant4@hotmail.com',
          fullName: 'Sabina Ernser',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Angelina_DuBuque@hotmail.com',
          fullName: 'Irving Nader',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Tremaine.Cummerata@hotmail.com',
          fullName: 'Roselyn Paucek',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Bethany_Jast73@yahoo.com',
          fullName: 'Golda Zboncak',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Fabian.Orn@hotmail.com',
          fullName: 'Zackary Gerlach',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Helmer17@gmail.com',
          fullName: 'Charlie Batz',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Mekhi.Kunze@gmail.com',
          fullName: 'Sasha Mraz',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Pearl31@yahoo.com',
          fullName: 'Cheyenne Jacobs',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Tatum.Hudson@hotmail.com',
          fullName: 'Clotilde Kub',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Velda.Gutmann@gmail.com',
          fullName: 'Bianka Bashirian',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Arch_Rippin-Schuppe@gmail.com',
          fullName: 'Krystel Reilly',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Angelo.Gutkowski@hotmail.com',
          fullName: 'Michael Grant',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Shayna.Rogahn@gmail.com',
          fullName: "Margarita O'Kon",
        },
        {
          __typename: 'MailchimpMember',
          email: 'Finn89@yahoo.com',
          fullName: 'Porter Batz',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Bertrand32@yahoo.com',
          fullName: 'Colton Kerluke',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Carroll86@gmail.com',
          fullName: 'Cooper Ortiz',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Rhea89@hotmail.com',
          fullName: 'Shaniya Auer',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Verna50@yahoo.com',
          fullName: 'Alta Macejkovic',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Rhoda.Schumm56@gmail.com',
          fullName: 'Chloe Hoeger',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Jermain11@yahoo.com',
          fullName: 'Cleora Gutmann',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Charlotte88@hotmail.com',
          fullName: 'Chet Crona',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Claude_Renner-Schimmel89@yahoo.com',
          fullName: 'Thad Luettgen',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Mabelle18@hotmail.com',
          fullName: 'Kian Halvorson',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Gordon.Leuschke@gmail.com',
          fullName: 'Connie Koelpin',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Jessy_Braun9@hotmail.com',
          fullName: 'Thad Purdy',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Elda.Hettinger@gmail.com',
          fullName: 'Eula Hackett',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Cooper_Keebler51@yahoo.com',
          fullName: 'Alexa Mertz',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Hardy_Mueller57@hotmail.com',
          fullName: 'Korbin Parisian',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Sheldon_Fahey55@yahoo.com',
          fullName: 'Ruben Ritchie',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Kayleigh.Schulist50@yahoo.com',
          fullName: 'Estel Reichert',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Pearlie.Stokes@yahoo.com',
          fullName: 'Jamar Klein',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Celestino.Lowe12@gmail.com',
          fullName: 'Edward Lemke',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Bridie6@hotmail.com',
          fullName: 'Paul Mertz',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Karelle3@gmail.com',
          fullName: 'Alek Kohler',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Heath25@hotmail.com',
          fullName: 'Dejon Beer',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Clemens_Kertzmann@hotmail.com',
          fullName: 'Cecile Bosco',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Aaron57@yahoo.com',
          fullName: 'Declan Fadel',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Everette55@hotmail.com',
          fullName: 'Julius Green',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Rubye85@yahoo.com',
          fullName: 'Chet Roob',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Polly.Torphy@gmail.com',
          fullName: 'Ivy Stamm',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Tyra.Kiehn34@yahoo.com',
          fullName: 'Zoila Green',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Guillermo10@yahoo.com',
          fullName: 'Janessa Johnston',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Joyce.White@yahoo.com',
          fullName: 'Jerome Cassin',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Madison12@gmail.com',
          fullName: 'Ellie Gerhold',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Keon.Kilback99@gmail.com',
          fullName: 'Otho Buckridge',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Evalyn.Boyer@hotmail.com',
          fullName: 'Margot Littel',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Sheridan.Gulgowski21@hotmail.com',
          fullName: 'Monica Rau',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Bertrand_Zboncak@gmail.com',
          fullName: 'Stella Davis',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Otis_Terry@yahoo.com',
          fullName: 'Pansy Champlin',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Jerel.Daniel47@yahoo.com',
          fullName: 'Madisyn Hand',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Hassie.Nader@hotmail.com',
          fullName: 'Lori Beahan',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Dorthy_Nicolas@gmail.com',
          fullName: 'Savanna Terry',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Zoey58@yahoo.com',
          fullName: 'Kyra Block',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Marietta.Hayes@gmail.com',
          fullName: 'Virgie Konopelski',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Cleo_Orn85@yahoo.com',
          fullName: 'Kelsie Cassin',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Ethyl_Lemke26@yahoo.com',
          fullName: 'Lon Abshire',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Austin_Wunsch31@hotmail.com',
          fullName: 'Hudson Kuphal',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Madonna_Kemmer50@hotmail.com',
          fullName: 'Don Cummerata',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Hallie_Fadel@yahoo.com',
          fullName: 'Lou Graham-Keeling',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Judah_Windler@gmail.com',
          fullName: 'Shyann Considine',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Emilie_Yost64@yahoo.com',
          fullName: 'Kavon Muller',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Verlie_Gutkowski-Gutkowski26@yahoo.com',
          fullName: 'Walter Botsford',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Kyleigh51@yahoo.com',
          fullName: 'Mohamed Wehner',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Jayde.Satterfield@hotmail.com',
          fullName: 'Gia Ortiz',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Baylee.Collier26@hotmail.com',
          fullName: 'Cheyenne Koch',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Omari24@gmail.com',
          fullName: 'Macey Carroll',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Eva.Predovic46@gmail.com',
          fullName: 'Kiara Lynch',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Ansley30@hotmail.com',
          fullName: 'Dax Konopelski',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Alejandrin.Boyer0@gmail.com',
          fullName: 'Christian Shanahan',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Curt31@gmail.com',
          fullName: 'Wellington Abbott-Bashirian',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Dayna.Dickinson52@yahoo.com',
          fullName: 'Finn Gorczany',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Verner33@hotmail.com',
          fullName: 'Prudence Bode',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Alvina.Will97@yahoo.com',
          fullName: 'Casey Waters',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Julianne99@hotmail.com',
          fullName: 'Deborah Champlin',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Dorris94@gmail.com',
          fullName: 'Aaron Nitzsche',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Arvid_Stroman29@gmail.com',
          fullName: 'Lavon Botsford',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Chelsie93@gmail.com',
          fullName: 'Janick Abbott',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Sage33@hotmail.com',
          fullName: 'Edwin Beatty',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Julia_Schaefer@gmail.com',
          fullName: 'Dorothea Jerde-Gulgowski',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Hoyt8@hotmail.com',
          fullName: 'Rolando Kirlin',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Ike_Hagenes@gmail.com',
          fullName: 'Asha Lakin',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Laila.Will66@gmail.com',
          fullName: 'Chaz Gerlach',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Hortense79@gmail.com',
          fullName: 'Dorothy Kling',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Charlotte.Swift@gmail.com',
          fullName: 'Jacey Shields',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Nikita.Heller7@gmail.com',
          fullName: 'Carolyn Schroeder',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Margarita15@yahoo.com',
          fullName: 'Beaulah Denesik',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Jed57@hotmail.com',
          fullName: 'Yoshiko Leuschke',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Rogelio.Weimann@yahoo.com',
          fullName: 'Tad Gottlieb',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Audrey.Haley55@yahoo.com',
          fullName: 'Adaline Bauch',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Blanche_Waters@hotmail.com',
          fullName: 'Emie Cartwright',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Briana.Ullrich@yahoo.com',
          fullName: 'Wendy Johns',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Lemuel.Corkery76@gmail.com',
          fullName: 'Cyril Blick-Deckow',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Brionna_Lueilwitz70@gmail.com',
          fullName: 'Hoyt Schamberger',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Jalon.Watsica24@gmail.com',
          fullName: 'Dusty Larson',
        },
        {
          __typename: 'MailchimpMember',
          email: 'King.Price@gmail.com',
          fullName: 'Antonetta Casper',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Donnell.Mertz68@hotmail.com',
          fullName: 'Darrell Franey',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Gavin72@gmail.com',
          fullName: 'Major Boehm-Thompson',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Imani_Ledner75@hotmail.com',
          fullName: 'Shanel Windler',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Frances61@yahoo.com',
          fullName: 'Toy Greenfelder',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Terrence.Cruickshank@yahoo.com',
          fullName: 'Renee Douglas',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Elijah.Reichel6@yahoo.com',
          fullName: 'Alexander Schiller-Durgan',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Richie_Mayer10@gmail.com',
          fullName: 'Donavon Davis',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Lia_Walsh@yahoo.com',
          fullName: 'Mike Zieme',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Eulalia88@gmail.com',
          fullName: 'Joel Denesik',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Lourdes_Prohaska@gmail.com',
          fullName: 'Jeanne Senger',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Arnulfo58@gmail.com',
          fullName: 'Mollie VonRueden',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Shaun_Lemke@yahoo.com',
          fullName: "Mae D'Amore",
        },
        {
          __typename: 'MailchimpMember',
          email: 'Emmanuel.Price@gmail.com',
          fullName: 'Cecil Reilly',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Donato42@yahoo.com',
          fullName: 'Murray Corwin',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Linda_Medhurst41@gmail.com',
          fullName: 'Eden Kunze',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Mitchel_Senger39@hotmail.com',
          fullName: 'Ally Weissnat',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Reta92@yahoo.com',
          fullName: 'Elise Tremblay',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Marcus_Douglas@hotmail.com',
          fullName: 'Cydney Stokes',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Jamil44@yahoo.com',
          fullName: 'Janae Block',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Geo_McLaughlin64@gmail.com',
          fullName: 'Maye Luettgen',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Jay_Herman65@yahoo.com',
          fullName: 'Aileen Hills',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Quentin_Sawayn@gmail.com',
          fullName: 'Lisa Maggio',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Armando.Hickle9@yahoo.com',
          fullName: 'Ona Kuvalis',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Brennon.Mertz@hotmail.com',
          fullName: 'Ena Kautzer',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Deanna_Bradtke6@hotmail.com',
          fullName: 'Cyrus Erdman',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Heather.Volkman17@gmail.com',
          fullName: 'Aurelia Hagenes',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Reed56@gmail.com',
          fullName: 'Sammie Farrell',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Makayla_Goyette27@hotmail.com',
          fullName: 'Wiley Mertz',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Randy53@yahoo.com',
          fullName: 'Oswaldo Welch',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Jacynthe.Kozey17@yahoo.com',
          fullName: 'Libby Pfeffer',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Beryl_Rempel@yahoo.com',
          fullName: 'Foster Von',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Jodie_Christiansen61@yahoo.com',
          fullName: 'Blaise Emmerich',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Caitlyn68@yahoo.com',
          fullName: 'Ilene Kassulke',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Cassidy.Ward@yahoo.com',
          fullName: 'Kiara Bashirian',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Penelope_Flatley@yahoo.com',
          fullName: 'Amina Graham',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Mertie.Ledner@gmail.com',
          fullName: 'Felicity Windler',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Norberto62@gmail.com',
          fullName: 'Nathaniel Rodriguez',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Kendall.Wunsch@gmail.com',
          fullName: 'Maverick Hahn',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Sammie.Dare@gmail.com',
          fullName: 'Lelia Reichel',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Davin_Corkery@yahoo.com',
          fullName: 'Alexandra Dooley',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Leanna67@yahoo.com',
          fullName: 'Abraham Gulgowski',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Corine_Boehm69@hotmail.com',
          fullName: 'Roberta Connelly',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Doris_Homenick@hotmail.com',
          fullName: 'Arthur Brown',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Halle_Orn56@yahoo.com',
          fullName: 'Abby Gutmann-Block',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Colten_Armstrong@hotmail.com',
          fullName: 'Koby Labadie',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Winifred_Schmitt-Sanford89@yahoo.com',
          fullName: "Baby D'Amore",
        },
        {
          __typename: 'MailchimpMember',
          email: 'Jaclyn.Berge25@hotmail.com',
          fullName: 'Reyna Koss',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Emelia.Hettinger@yahoo.com',
          fullName: 'Garret Hahn-Bashirian',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Jettie_Wolff@hotmail.com',
          fullName: 'Ora Cummerata',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Vickie_Zemlak@hotmail.com',
          fullName: 'Shana Wiegand',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Selina.Volkman@hotmail.com',
          fullName: 'Ebony Gibson',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Zella.Sawayn@yahoo.com',
          fullName: 'Drake Carter',
        },
        {
          __typename: 'MailchimpMember',
          email: 'Neoma.Breitenberg@hotmail.com',
          fullName: 'Dee Schuppe',
        },
      ];
    },
  })
);
