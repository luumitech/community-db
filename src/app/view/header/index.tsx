'use client';
import {
  Link,
  LinkProps,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from '@nextui-org/react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import React from 'react';
import { NotSignedIn } from './not-signed-in';
import { SignedIn } from './signed-in';
import { useNavMenu } from './use-nav-menu';

export interface MenuItemEntry extends LinkProps {
  id: string;
  isActive?: boolean;
}

interface Props {}

export const Header: React.FC<Props> = ({}) => {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const menuItems = useNavMenu();

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
        {/**
         * Easy access menu on top (hide in small view)
         */}
        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          {menuItems.map(({ id, isActive, ...entry }) => (
            <NavbarItem key={id} isActive={isActive}>
              <Link color={isActive ? 'primary' : 'foreground'} {...entry} />
            </NavbarItem>
          ))}
        </NavbarContent>
        <NavbarContent justify="end">
          {session ? <SignedIn /> : <NotSignedIn />}
        </NavbarContent>
        {/**
         * Menu items for burger menu
         */}
        <NavbarMenu>
          {menuItems.map(({ id, isActive, ...entry }) => (
            <NavbarMenuItem key={id} isActive={isActive}>
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
