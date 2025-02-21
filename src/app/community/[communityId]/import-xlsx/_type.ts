import * as GQL from '~/graphql/generated/graphql';

interface ImportMethodSelectItem {
  label: string;
  value: GQL.ImportMethod;
}
export const importMethodSelectionList: ImportMethodSelectItem[] = [
  { label: 'Excel', value: GQL.ImportMethod.Xlsx },
  {
    label: 'Randomly generate sample data',
    value: GQL.ImportMethod.Random,
  },
];
