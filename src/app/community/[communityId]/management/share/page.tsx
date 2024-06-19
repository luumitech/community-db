'use client';
import { useMutation, useQuery } from '@apollo/client';
import {
  Button,
  Input,
  Link,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  getKeyValue,
} from '@nextui-org/react';
import { type RowElement } from '@react-types/table';
import React from 'react';
import { useGraphqlErrorHandler } from '~/custom-hooks/graphql-error-handler';

import { evictCache } from '~/graphql/apollo-client/cache-util/evict';
import { graphql } from '~/graphql/generated';
import * as GQL from '~/graphql/generated/graphql';
import { appPath } from '~/lib/app-path';
import { toast } from '~/view/base/toastify';
import { CopyShareLink } from './copy-share-link';
import { NewAccessButton } from './new-access-button';
import { useTableData } from './use-table-data';

interface Params {
  communityId: string;
}

interface RouteArgs {
  params: Params;
}

const CommunityAccessListQuery = graphql(/* GraphQL */ `
  query communityAccessList($id: String!) {
    communityFromId(id: $id) {
      id
      ownAccess {
        role
      }
      accessList {
        id
        ...AccessList_User
        ...AccessList_Role
        ...AccessList_Action
        ...Share_NewAccessModal
      }
    }
  }
`);

export default function Share({ params }: RouteArgs) {
  const { communityId } = params;
  const result = useQuery(CommunityAccessListQuery, {
    variables: {
      id: communityId,
    },
  });
  useGraphqlErrorHandler(result);
  const { columns, renderCell } = useTableData();
  const { data, loading } = result;

  const accessList = React.useMemo(
    () => data?.communityFromId.accessList ?? [],
    [data]
  );

  const userRole = React.useMemo(() => {
    return data?.communityFromId.ownAccess.role;
  }, [data]);

  const renderRows = React.useCallback(() => {
    return accessList.map((entry) => (
      <TableRow key={entry.id}>
        {columns.map((col) => (
          <TableCell key={col.key}>
            <div className="h-6 flex items-center">
              {renderCell(entry, col.key)}
            </div>
          </TableCell>
        ))}
      </TableRow>
    ));
  }, [accessList, renderCell, columns]);

  const topContent = React.useMemo(() => {
    return <CopyShareLink className="p-2" communityId={communityId} />;
  }, [communityId]);

  const bottomContent = React.useMemo(() => {
    if (userRole !== GQL.Role.Admin) {
      return null;
    }
    return <NewAccessButton className="p-2" communityId={communityId} />;
  }, [communityId, userRole]);

  return (
    <Table
      aria-label="Community Access List"
      classNames={{
        // 64px is the height of header
        // 0.5rem is the top margin of the main div
        base: [`max-h-[calc(100vh-64px-0.5rem)]`],
        // Don't use array here
        // See: https://github.com/nextui-org/nextui/issues/2304
        // replaces the removeWrapper attribute
        // use this to keep scroll bar within table
        wrapper: 'p-0',
      }}
      // removeWrapper
      isHeaderSticky
      topContent={topContent}
      bottomContent={bottomContent}
    >
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn key={column.key} className={column.className}>
            {column.label}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody
        isLoading={loading}
        loadingContent={<Spinner />}
        items={accessList}
      >
        {renderRows()}
      </TableBody>
    </Table>
  );
}
