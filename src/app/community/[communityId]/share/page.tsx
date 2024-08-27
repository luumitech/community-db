'use client';
import { useQuery } from '@apollo/client';
import {
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/react';
import { Role } from '@prisma/client';
import React from 'react';
import { useGraphqlErrorHandler } from '~/custom-hooks/graphql-error-handler';
import { graphql } from '~/graphql/generated';
import * as GQL from '~/graphql/generated/graphql';
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
      access {
        id
        role
        ...AccessList_User
        ...AccessList_Role
        ...AccessList_Modify
        ...AccessList_Delete
      }
      otherAccessList {
        id
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
    variables: {
      id: communityId,
    },
  });
  useGraphqlErrorHandler(result);
  const { data, loading } = result;
  const community = React.useMemo(() => data?.communityFromId, [data]);

  const isAdmin = React.useMemo(() => {
    return community?.access.role === GQL.Role.Admin;
  }, [community]);

  const { columns, renderCell } = useTableData(isAdmin);

  /**
   * Generate access list for all users (including self)
   */
  const accessList = React.useMemo(() => {
    const others = community?.otherAccessList;
    const self = community?.access;

    if (self && others) {
      return [{ isSelf: true, ...self }, ...others];
    }
    return [];
  }, [community?.otherAccessList, community?.access]);

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
      <div className="flex gap-2 items-center">
        <span className="text-lg grow">Share {community.name} with:</span>
        {isAdmin && (
          <NewAccessButton communityId={community.id} accessList={accessList} />
        )}
      </div>
    );
  }, [community, isAdmin, accessList]);

  const bottomContent = React.useMemo(() => {
    if (!community) {
      return null;
    }
    return <CopyShareLink communityId={community.id} />;
  }, [community]);

  return (
    <>
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
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
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
      <RoleDescription className="mt-3" />
    </>
  );
}
