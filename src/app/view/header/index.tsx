'use client';
import {
  BreadcrumbItem,
  Breadcrumbs,
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  Spinner,
} from '@nextui-org/react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import React from 'react';
import { NotSignedIn } from './not-signed-in';
import { SignedIn } from './signed-in';
import { useNavMenu } from './use-nav-menu';
import { useTopMenu } from './use-top-menu';

interface Props {}

export const Header: React.FC<Props> = ({}) => {
  const { status } = useSession();
  const breadcrumbItems = useTopMenu();
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
         * Top breadcrumb menu
         */}
        <Breadcrumbs>
          {breadcrumbItems.map(({ id, ...entry }) => (
            <BreadcrumbItem key={id} {...entry} />
          ))}
        </Breadcrumbs>
        <NavbarContent justify="end">
          {status === 'loading' ? (
            <Spinner />
          ) : status === 'authenticated' ? (
            <SignedIn />
          ) : (
            <NotSignedIn />
          )}
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
