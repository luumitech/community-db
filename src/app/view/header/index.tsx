'use client';
import { useQuery } from '@apollo/client';
import {
  Link,
  LinkProps,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  Spacer,
} from '@nextui-org/react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import React from 'react';
import { graphql } from '~/graphql/generated';
import { NotSignedIn } from './not-signed-in';
import { SignedIn } from './signed-in';
import { useNavMenu } from './use-nav-menu';

const CommunityNameFromIdQuery = graphql(/* GraphQL */ `
  query communityNameFromId($id: ID!) {
    communityFromId(id: $id) {
      id
      name
    }
  }
`);

export interface MenuItemEntry extends LinkProps {
  id: string;
  isActive?: boolean;
}

interface Props {}

export const Header: React.FC<Props> = ({}) => {
  const { data: session } = useSession();
  const params = useParams<{ communityId?: string }>();
  const result = useQuery(CommunityNameFromIdQuery, {
    variables: { id: params.communityId! },
    skip: params.communityId == null,
  });
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const menuItems = useNavMenu();

  const communityName = result.data?.communityFromId.name;

  return (
    <header className="sticky z-50 top-0">
      <Navbar
        maxWidth="full"
        isMenuOpen={isMenuOpen}
        onMenuOpenChange={setIsMenuOpen}
        classNames={{
          // Add underline to active item
          item: [
            'flex',
            'relative',
            'h-full',
            'items-center',
            "data-[active=true]:after:content-['']",
            'data-[active=true]:after:absolute',
            'data-[active=true]:after:bottom-4',
            'data-[active=true]:after:left-0',
            'data-[active=true]:after:right-0',
            'data-[active=true]:after:h-[3px]',
            'data-[active=true]:after:bg-primary',
          ],
        }}
      >
        {menuItems.length > 0 && (
          <NavbarMenuToggle
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          />
        )}
        <NavbarContent className="pr-3" justify="center">
          <NavbarBrand>
            <Image
              className="object-fit"
              src="/luumitech-logo.png"
              alt="LummiTech Logo"
              priority
              width={36}
              height={36}
            />
            <Link
              href="/"
              color="foreground"
              className="pl-2 flex-col text-center font-bold leading-5"
            >
              <div>Community</div>
              <div>Database</div>
            </Link>
          </NavbarBrand>
        </NavbarContent>
        {communityName}
        <NavbarContent justify="end">
          {session ? <SignedIn /> : <NotSignedIn />}
        </NavbarContent>
        {/**
         * Menu items for burger menu
         */}
        <NavbarMenu>
          {menuItems.map(({ id, isActive, ...entry }) => (
            <NavbarMenuItem key={id} className="flex" isActive={isActive}>
              <Link
                className="w-full"
                size="lg"
                color={isActive ? 'primary' : 'foreground'}
                {...entry}
              />
            </NavbarMenuItem>
          ))}
        </NavbarMenu>
      </Navbar>
    </header>
  );
};
