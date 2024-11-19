import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  User,
} from '@nextui-org/react';
import { signOut, useSession } from 'next-auth/react';
import { env } from 'next-runtime-env';
import React from 'react';
import { appLabel, appPath } from '~/lib/app-path';
import { insertIf } from '~/lib/insert-if';
import { Icon } from '~/view/base/icon';
import styles from './styles.module.css';

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

  if (status === 'loading') {
    return null;
  }

  // useSession guarantees user to be authenticated
  const { name, email, image } = data!.user!;

  const subscriptionPlanEnable = env('NEXT_PUBLIC_PLAN_ENABLE') === 'true';

  return (
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
      <DropdownMenu
        className={styles['drop-down']}
        aria-label="Profile Actions"
        variant="flat"
        disabledKeys={[...insertIf(!subscriptionPlanEnable, 'pricing')]}
      >
        <DropdownItem
          key="profile"
          textValue="user email"
          isReadOnly
          showDivider
        >
          <p className="font-semibold">{email}</p>
        </DropdownItem>
        <DropdownItem
          key="about"
          href={appPath('about')}
          startContent={<Icon icon="about" />}
        >
          {appLabel('about')}
        </DropdownItem>
        <DropdownItem
          key="preference"
          href={appPath('preference')}
          startContent={<Icon icon="settings" />}
        >
          {appLabel('preference')}
        </DropdownItem>
        <DropdownItem
          key="pricing"
          href={appPath('pricing')}
          startContent={
            <Icon className="text-yellow-600" icon="premium-plan" />
          }
          showDivider
        >
          {appLabel('pricing')}
        </DropdownItem>
        <DropdownItem
          key="logout"
          color="danger"
          onClick={() => signOut()}
          startContent={<Icon icon="logout" />}
        >
          Log Out
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};
