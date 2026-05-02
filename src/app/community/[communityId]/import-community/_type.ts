import * as GQL from '~/graphql/generated/graphql';
import { type SelectItem } from '~/view/base/select';

export const importMethodSelectionList: SelectItem[] = [
  { key: GQL.ImportMethod.Xlsx, textValue: 'Excel' },
  {
    key: GQL.ImportMethod.Map,
    textValue: 'Draw map boundary',
  },
  {
    textValue: 'Randomly generate sample data',
    key: GQL.ImportMethod.Random,
  },
];
