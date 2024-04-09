'use client';
import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@nextui-org/react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React from 'react';

/**
 * Extract the first letter of each word
 */
function acronym(input?: string | null) {
  if (!input) {
    return 'n/a';
  }
  return input
    .split(/\s/)
    .reduce((response, word) => (response += word.slice(0, 1)), '');
}

interface Props {}

export const SignedIn: React.FC<Props> = ({}) => {
  const { data: session } = useSession();
  const router = useRouter();
  const user = session?.user;
  if (!user) {
    return null;
  }
  const { name, email, image } = user;
  if (!email) {
    return null;
  }

  return (
    <Dropdown placement="bottom-end">
      {/**
       * This is creating a warning:
       * React does not recognize the `originalProps` prop on a DOM element.
       * https://github.com/nextui-org/nextui/issues/2593
       */}
      <DropdownTrigger>
        <Avatar
          isBordered
          as="button"
          className="transition-transform"
          color="secondary"
          name={acronym(name) ?? 'n/a'}
          size="sm"
          {...(!!image && { src: image })}
        />
      </DropdownTrigger>
      <DropdownMenu aria-label="Profile Actions" variant="flat">
        <DropdownItem key="profile" className="h-14 gap-2">
          <p className="font-semibold">Signed in as</p>
          <p className="font-semibold">{email}</p>
        </DropdownItem>
        <DropdownItem key="settings">My Settings</DropdownItem>
        <DropdownItem
          key="logout"
          color="danger"
          onClick={() => router.push('/sign-out')}
        >
          Log Out
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};
