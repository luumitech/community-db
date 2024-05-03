import { offsetLimitPagination } from '@apollo/client/utilities';
import {
  TypedTypePolicies,
  UserKeySpecifier,
} from '~/graphql/generated/type-policies';

export const typePolicies: TypedTypePolicies = {
  // Community: {
  //   fields: {
  //     propertyList: offsetLimitPagination(),
  //   },
  // },
};
