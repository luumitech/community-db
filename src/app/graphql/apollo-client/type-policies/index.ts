import { relayStylePagination } from '@apollo/client/utilities';
import * as R from 'remeda';
import {
  TypedTypePolicies,
  UserKeySpecifier,
} from '~/graphql/generated/type-policies';

export const typePolicies: TypedTypePolicies = {
  Community: {
    fields: {
      propertyList: relayStylePagination(['filter']),
      // When modifying partial settings within defaultSetting, merge the resulting object
      defaultSetting: { merge: true },
    },
  },
  Property: {
    fields: {
      occupantList: { merge: false },
      membershipList: { merge: false },
    },
  },
};
