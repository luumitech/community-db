'use client';
import {
  Link,
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
import { useRouter } from 'next/navigation';
import React from 'react';
import { NotSignedIn } from './not-signed-in';
import { SignedIn } from './signed-in';

interface Props {}

export const Header: React.FC<Props> = ({}) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  React.useEffect(() => {
    // once logged out, navigate to landing page
    if (!session) {
      router.push('/');
    }
  }, [session, router]);

  const menuItems = ['Tab1', 'Tab2'];

  return (
    <header className="sticky z-10 top-0">
      <Navbar
        maxWidth="full"
        isMenuOpen={isMenuOpen}
        onMenuOpenChange={setIsMenuOpen}
      >
        {/* <NavbarContent className="sm:hidden" justify="start">
          <NavbarMenuToggle
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          />
        </NavbarContent> */}
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
            <div className="pl-2 flex-col text-center font-bold leading-5">
              <div>Community</div>
              <div>Database</div>
            </div>
          </NavbarBrand>
        </NavbarContent>
        {/* <NavbarContent className="hidden sm:flex gap-4" justify="center">
          {menuItems.map((item, index) => (
            <NavbarItem key={`${item}-${index}`}>
              <Link color="foreground" href="#">
                {item}
              </Link>
            </NavbarItem>
          ))}
        </NavbarContent> */}
        <NavbarContent justify="end">
          {session ? <SignedIn /> : <NotSignedIn />}
        </NavbarContent>
        {/**
         * Menu items for burger menu
         * only shows in small screen
         */}
        {/* <NavbarMenu>
          {menuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                className="w-full"
                color={
                  index === 2
                    ? 'warning'
                    : index === menuItems.length - 1
                      ? 'danger'
                      : 'foreground'
                }
                href="#"
                size="lg"
              >
                {item}
              </Link>
            </NavbarMenuItem>
          ))}
        </NavbarMenu> */}
      </Navbar>
    </header>
  );
};
