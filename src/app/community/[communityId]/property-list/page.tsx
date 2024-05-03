'use client';
import { useQuery } from '@apollo/client';
import {
  Button,
  Pagination,
  Spacer,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import { useGraphqlErrorHandler } from '~/custom-hooks/graphql-error-handler';
import { graphql } from '~/graphql/generated';
import * as GQL from '~/graphql/generated/graphql';
import { PropertyAddress } from './property-address';

interface Params {
  communityId: string;
}

interface RouteArgs {
  params: Params;
}

const CommunityFromIdQuery = graphql(/* GraphQL */ `
  query communityFromId($id: ID!, $offset: Int, $limit: Int) {
    communityFromId(id: $id) {
      id
      name
      propertyCount
      propertyList(offset: $offset, limit: $limit) {
        ...PropertyList_Address
      }
    }
  }
`);

type PropertyFragmentList =
  GQL.CommunityFromIdQuery['communityFromId']['propertyList'];

export default function PropertyList({ params }: RouteArgs) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(0);
  const [entries, setEntries] = React.useState<PropertyFragmentList>([]);
  const [limit, setLimit] = React.useState(10);
  const offset = (page - 1) * limit;
  const result = useQuery(CommunityFromIdQuery, {
    variables: {
      id: params.communityId,
      offset,
      limit,
    },
    onCompleted: (data) => {
      const { propertyCount, propertyList } = data.communityFromId;
      setTotalPages(Math.ceil(propertyCount / limit));
      setEntries(propertyList);
    },
  });
  useGraphqlErrorHandler(result);
  const { data, loading } = result;

  const onPageChange = async (page: number) => {
    setPage(page);
  };

  if (!session) {
    return null;
  }

  return (
    <div>
      <Table aria-label="Property Table">
        <TableHeader>
          <TableColumn>Address</TableColumn>
        </TableHeader>
        <TableBody emptyContent={'No data to display.'}>
          {Array.from({ length: entries.length ? limit : 0 }, (_, idx) => (
            <TableRow key={offset + idx}>
              <TableCell>
                <PropertyAddress entry={entries[idx]} loading={loading} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Spacer y={4} />
      {totalPages > 0 && (
        <Pagination
          className="mx-0"
          total={totalPages}
          page={page}
          onChange={onPageChange}
        />
      )}
      {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
      {/* <Button>
        <Link href={`${pathname}/import`}>Import</Link>
      </Button> */}
    </div>
  );
}
