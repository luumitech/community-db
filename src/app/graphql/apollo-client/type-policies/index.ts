import { relayStylePagination } from '@apollo/client/utilities';
import * as R from 'remeda';
import {
  TypedTypePolicies,
  UserKeySpecifier,
} from '~/graphql/generated/type-policies';

export const typePolicies: TypedTypePolicies = {
  Community: {
    fields: {
      propertyList: relayStylePagination(['query']),
    },
  },
  Property: {
    fields: {
      occupantList: { merge: false },
      membershipList: { merge: false },
    },
  },
};
