import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  User,
  useDisclosure,
} from '@nextui-org/react';
import { signOut, useSession } from 'next-auth/react';
import React from 'react';
import { appLabel, appPath } from '~/lib/app-path';
import { AboutModal } from './about-modal';

/** Extract the first letter of each word */
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
  const { status, data } = useSession({ required: true });
  const aboutDisclosure = useDisclosure();

  if (status === 'loading') {
    return null;
  }

  // useSession guarantees user to be authenticated
  const { name, email, image } = data!.user!;

  return (
    <>
      <Dropdown placement="bottom-end">
        <DropdownTrigger>
          <User
            className="transition-transform"
            name=""
            isFocusable
            avatarProps={{
              isBordered: true,
              name: acronym(name) ?? 'n/a',
              color: 'secondary',
              ...(!!image && { src: image }),
            }}
          />
        </DropdownTrigger>
        <DropdownMenu aria-label="Profile Actions" variant="flat">
          <DropdownItem
            key="profile"
            textValue="user email"
            isReadOnly
            showDivider
          >
            <p className="font-semibold">{email}</p>
          </DropdownItem>
          <DropdownItem key="about" {...aboutDisclosure.getButtonProps()}>
            About
          </DropdownItem>
          <DropdownItem key="preference" href={appPath('preference')}>
            {appLabel('preference')}
          </DropdownItem>
          <DropdownItem key="logout" color="danger" onClick={() => signOut()}>
            Log Out
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <AboutModal disclosureProps={aboutDisclosure} />
    </>
  );
};
