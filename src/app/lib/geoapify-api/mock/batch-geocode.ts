import { BatchGeocode } from '../resource';

const searchFreeForm = jest.spyOn(BatchGeocode.prototype, 'searchFreeForm');

export const MockBatchGeocode = {
  searchFreeForm,
};
