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
} from '@heroui/react';
import React from 'react';
import { useSession } from '~/custom-hooks/auth';
import { appPath } from '~/lib/app-path';
import { appTitle } from '~/lib/env-var';
import { AppLogo } from '~/view/app-logo';
import { NotSignedIn } from './not-signed-in';
import { SignedIn } from './signed-in';
import { useNavMenu } from './use-nav-menu';
import { useTopMenu } from './use-top-menu';

export * from './header-menu';

interface Props {}

export const Header: React.FC<Props> = ({}) => {
  const { data, isPending } = useSession();
  const breadcrumbItems = useTopMenu();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const menuItems = useNavMenu();

  return (
    <header className="sticky top-0 z-50 h-header-height">
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
        {/** Hamburger menu */}
        {/* {menuItems.length > 0 && (
          <NavbarMenuToggle
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          />
        )} */}
        <NavbarBrand className="flex-grow-0 items-center">
          <Link className="gap-1" href={appPath('home')} color="foreground">
            <div className="w-[36px]">
              <AppLogo priority size={36} />
            </div>
            {/* Hide appTitle in small layout */}
            <span className="max-w-min whitespace-normal text-balance text-center font-bold leading-5 max-sm:hidden">
              {appTitle}
            </span>
          </Link>
        </NavbarBrand>
        {/** Top breadcrumb menu */}
        <Breadcrumbs
          classNames={{
            // Hide overflow, so items within breadcrumbs can truncate correctly
            base: 'overflow-hidden',
          }}
        >
          {breadcrumbItems.map(({ id, ...entry }) => (
            <BreadcrumbItem
              classNames={{
                // Inherit the max-width from parent
                base: 'max-w-full',
              }}
              key={id}
              {...entry}
            />
          ))}
        </Breadcrumbs>
        <NavbarContent justify="end">
          {/* placeholder for calculating position of more menu */}
          <div id="nav-bar-avatar" />
          {data != null ? <SignedIn /> : <NotSignedIn isLoading={isPending} />}
        </NavbarContent>
        {/** Menu items for burger menu */}
        <NavbarMenu>
          {menuItems.map(({ id, isActive, ...entry }) => (
            <NavbarMenuItem key={id} className="flex" isActive={isActive}>
              <Link
                className="w-full"
                size="lg"
                color={isActive ? 'primary' : 'foreground'}
                onPress={() => setIsMenuOpen(false)}
                {...entry}
              />
            </NavbarMenuItem>
          ))}
        </NavbarMenu>
      </Navbar>
    </header>
  );
};
