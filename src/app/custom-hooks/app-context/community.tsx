'use client';
import { ApolloError, useQuery } from '@apollo/client';
import { Button, Link } from '@nextui-org/react';
import { useParams } from 'next/navigation';
import React from 'react';
import { useGraphqlErrorHandler } from '~/custom-hooks/graphql-error-handler';
import { graphql } from '~/graphql/generated';
import * as GQL from '~/graphql/generated/graphql';
import { appLabel, appPath } from '~/lib/app-path';
import { getCurrentYear } from '~/lib/date-util';
import { insertIf } from '~/lib/insert-if';
import { toast } from '~/view/base/toastify';
import { useCommunityUi, type UseCommunityUiReturn } from './community-ui';

const CommunityLayoutQuery = graphql(/* GraphQL */ `
  query communityLayout($communityId: String!) {
    communityFromId(id: $communityId) {
      id
      name
      minYear
      maxYear
      eventList {
        name
        hidden
      }
      paymentMethodList {
        name
        hidden
      }
      access {
        role
      }
    }
  }
`);

interface SelectItem {
  label: string;
  value: string;
}
interface SelectSection {
  title: string;
  items: SelectItem[];
  showDivider?: boolean;
}

export type CommunityState = Readonly<{
  /** Community short ID */
  communityId?: string;
  /** Community name */
  communityName?: string;
  /**
   * UI states like:
   *
   * - Property search bar text
   */
  communityUi: UseCommunityUiReturn;
  /** Access role items */
  roleItems: SelectItem[];
  /** Minimum membership year recorded within membership */
  minYear: number;
  /** Maximum membership year recorded within membership */
  maxYear: number;
  /** Visible event items (suitable for 'Add new event') */
  visibleEventItems: SelectItem[];
  /** All event items (including hidden, suitable for event selection) */
  selectEventSections: SelectSection[];
  /** All payment method items (including hidden) */
  selectPaymentMethodSections: SelectSection[];
  /** Current user's role in this community */
  role: GQL.Role;
  /** Base on current user's role, can user modify content within this community? */
  canEdit: boolean;
  /** Is user an admin? */
  isAdmin: boolean;
}>;

/**
 * Given a list of SupportedSelectItem, group all visible items into
 * `visibleItems`, and create selection sections that contains all visible and
 * hidden items
 *
 * @param list List of SupportedSelectItem
 * @returns
 */
function createSelectionItems(list: GQL.SupportedSelectItem[]) {
  const visibleItems: SelectItem[] = [];
  const hiddenItems: SelectItem[] = [];
  list.forEach((entry) => {
    if (entry.hidden) {
      hiddenItems.push({ label: entry.name, value: entry.name });
    } else {
      visibleItems.push({ label: entry.name, value: entry.name });
    }
  });
  const selectSections = [
    {
      title: '',
      items: visibleItems,
      showDivider: hiddenItems.length > 0,
    },
    ...insertIf(hiddenItems.length > 0, {
      title: 'Deprecated Items',
      items: hiddenItems,
    }),
  ];
  return {
    visibleItems,
    selectSections,
  };
}

function communityLayoutOnError(err: ApolloError) {
  const { extensions } = err.graphQLErrors[0];
  // prisma error code are defined in
  // See: https://www.prisma.io/docs/orm/reference/error-reference
  switch (extensions?.errCode) {
    case 'P2025':
      // This means community is not found
      toast.error(({ closeToast }) => (
        <div className="flex items-center gap-2">
          <div>Community Not Found</div>
          <Button
            className="flex-shrink-0"
            size="sm"
            as={Link}
            color="primary"
            href={appPath('communitySelect')}
            onClick={() => closeToast()}
          >
            {appLabel('communitySelect')}
          </Button>
        </div>
      ));
      return;
  }

  // Let default error handler handle the error
  return err;
}

export function useCommunityContext() {
  const params = useParams<{ communityId?: string }>();
  const communityId = params.communityId;
  const result = useQuery(CommunityLayoutQuery, {
    skip: communityId == null,
    variables: {
      communityId: params.communityId!,
    },
  });
  useGraphqlErrorHandler(result, {
    onError: communityLayoutOnError,
  });
  const communityUi = useCommunityUi();

  const community = result.data?.communityFromId;

  React.useEffect(() => {
    // Reset ui state whenever community changes
    communityUi.actions.reset();
  }, [communityUi.actions, community?.id]);

  const contextValue = React.useMemo<CommunityState>(() => {
    const eventList = community?.eventList ?? [];
    const paymentMethodList = community?.paymentMethodList ?? [];
    const role = community?.access.role ?? GQL.Role.Viewer;

    const roleItems: SelectItem[] = [
      { label: 'Admin', value: GQL.Role.Admin },
      { label: 'Editor', value: GQL.Role.Editor },
      { label: 'Viewer', value: GQL.Role.Viewer },
    ];
    const eventSelect = createSelectionItems(eventList);
    const paymentMethodSelect = createSelectionItems(paymentMethodList);

    return {
      communityId: community?.id,
      communityName: community?.name,
      communityUi,
      roleItems,
      minYear: community?.minYear ?? getCurrentYear(),
      maxYear: community?.maxYear ?? getCurrentYear(),
      visibleEventItems: eventSelect.visibleItems,
      selectEventSections: eventSelect.selectSections,
      selectPaymentMethodSections: paymentMethodSelect.selectSections,
      role,
      canEdit: role === GQL.Role.Admin || role === GQL.Role.Editor,
      isAdmin: role === GQL.Role.Admin,
    };
  }, [community, communityUi]);

  return contextValue;
}
