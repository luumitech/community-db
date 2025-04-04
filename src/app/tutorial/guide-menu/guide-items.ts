import { appPath } from '~/lib/app-path';

function item(path: string, label: string) {
  return {
    key: path,
    path: appPath('tutorial', { path: { guide: path } }),
    label,
  };
}

export const GUIDE_ITEMS = [
  item('introduction', 'Introduction'),
  item('create-community', 'Create community'),
  item('batch-modify-property', 'Batch Modify Property'),
];

export type GuideItem = (typeof GUIDE_ITEMS)[0];
