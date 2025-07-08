'use client';
import { useQuery } from '@apollo/client';
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@heroui/react';
import React from 'react';
import { useGraphqlErrorHandler } from '~/custom-hooks/graphql-error-handler';
import { graphql } from '~/graphql/generated';
import * as GQL from '~/graphql/generated/graphql';
import { Loading } from '~/view/base/loading';
import { MoreMenu } from '../common/more-menu';
import { CopyShareLink } from './copy-share-link';
import { NewAccessButton } from './new-access-button';
import { RoleDescription } from './role-description';
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
      name
      owner {
        id
      }
      access {
        id
        role
        user {
          id
        }
        ...AccessList_User
        ...AccessList_Role
        ...AccessList_Modify
        ...AccessList_Delete
      }
      otherAccessList {
        id
        user {
          id
        }
        ...AccessList_User
        ...AccessList_Role
        ...AccessList_Modify
        ...AccessList_Delete
      }
    }
  }
`);

export default function Share({ params }: RouteArgs) {
  const { communityId } = params;
  const result = useQuery(CommunityAccessListQuery, {
    variables: { id: communityId },
  });
  useGraphqlErrorHandler(result);
  const { data, loading } = result;
  const community = React.useMemo(() => data?.communityFromId, [data]);

  const isAdmin = React.useMemo(() => {
    return community?.access.role === GQL.Role.Admin;
  }, [community]);

  const { columns, renderCell } = useTableData(isAdmin);

  /** Generate access list for all users (including self) */
  const accessList = React.useMemo(() => {
    if (!community) {
      return [];
    }
    const { otherAccessList, access, owner } = community;
    return [
      // Add isSelf flag for your own access entry
      { isSelf: true, ...access },
      // Other user's access list
      ...otherAccessList,
    ].map((entry) => ({
      ...entry,
      isOwner: entry.user.id === owner?.id,
    }));
  }, [community]);

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
    if (!community) {
      return null;
    }
    return (
      <div className="flex gap-2 items-center justify-end">
        <CopyShareLink communityId={community.id} />
        {isAdmin && (
          <NewAccessButton communityId={community.id} accessList={accessList} />
        )}
      </div>
    );
  }, [community, isAdmin, accessList]);

  return (
    <>
      <MoreMenu omitKeys={['communityShare']} />
      <Table
        aria-label="Community Access List"
        classNames={{
          base: ['max-h-main-height'],
          // Don't use array here
          // See: https://github.com/nextui-org/nextui/issues/2304
          // replaces the removeWrapper attribute
          // use this to keep scroll bar within table
          wrapper: 'p-0',
        }}
        // removeWrapper
        isHeaderSticky
        topContent={topContent}
        topContentPlacement="outside"
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
          loadingContent={<Loading />}
          items={accessList}
        >
          {renderRows()}
        </TableBody>
      </Table>
      <RoleDescription className="mt-3" />
    </>
  );
}
