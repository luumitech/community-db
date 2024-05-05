import * as R from 'remeda';
import {
  TypedTypePolicies,
  UserKeySpecifier,
} from '~/graphql/generated/type-policies';
import { customOffsetLimitPagination } from './offset-limit-pagination';

export const typePolicies: TypedTypePolicies = {
  /**
   * If using fetchMore to implement infinite list, then we
   * would want to use this.  But probably using relay cursor
   * pagination would be more appropriate for this
   */
  //   Community: {
  //     fields: {
  //       propertyList: customOffsetLimitPagination(),
  //     },
  //   },
};
