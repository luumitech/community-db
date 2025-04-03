import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  User,
} from '@heroui/react';
import { signOut } from 'next-auth/react';
import { env } from 'next-runtime-env';
import React from 'react';
import { useUserInfo } from '~/custom-hooks/user-info';
import { appLabel, appPath } from '~/lib/app-path';
import { Icon } from '~/view/base/icon';
import { BmcLabel, BmcLogo, BmcUrl } from '~/view/buy-me-a-coffee';
import styles from './styles.module.css';
import { ThemeSelect } from './theme-select';

interface Props {}

export const SignedIn: React.FC<Props> = ({}) => {
  const { initial, email, image } = useUserInfo();

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
            name: initial || 'n/a',
            className: 'bg-transparent',
            ...(!!image && { src: image }),
          }}
        />
      </DropdownTrigger>
      <DropdownMenu
        className={styles['drop-down']}
        aria-label="Profile Actions"
        variant="flat"
        disabledKeys={[subscriptionPlanEnable ? 'buyMeACoffee' : 'pricingPlan']}
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
        {/* <DropdownItem
          key="preference"
          href={appPath('preference')}
          startContent={<Icon icon="settings" />}
        >
          {appLabel('preference')}
        </DropdownItem> */}
        <DropdownItem
          key="theme"
          isReadOnly
          startContent={<Icon icon="sunMoon" />}
          endContent={<ThemeSelect />}
        >
          Theme
        </DropdownItem>
        <DropdownItem
          key="pricingPlan"
          href={appPath('pricingPlan')}
          startContent={
            <Icon className="text-yellow-600" icon="premium-plan" />
          }
          showDivider
        >
          {appLabel('pricingPlan')}
        </DropdownItem>
        <DropdownItem
          classNames={{
            base: 'bg-primary-200 data-[hover=true]:hover:bg-primary',
          }}
          key="buyMeACoffee"
          href={BmcUrl}
          target="_blank"
          startContent={<BmcLogo />}
          textValue="Buy me a coffee"
          showDivider
        >
          <BmcLabel />
        </DropdownItem>
        <DropdownItem
          key="tutorial"
          href={appPath('tutorial')}
          startContent={<Icon icon="helpbook" />}
        >
          {appLabel('tutorial')}
        </DropdownItem>
        <DropdownItem
          key="reportIssue"
          href={appPath('contactUs', {
            query: {
              title: 'Report An Issue',
              subject: '',
              messageDescription: `Describe the issue in detail:
              - What were you trying to do?
              - Please include detail steps leading you to the error
              - Include the error message you received`,
              log: 'true',
            },
          })}
          startContent={<Icon icon="bug" />}
        >
          Report An Issue
        </DropdownItem>
        <DropdownItem
          key="logout"
          color="danger"
          onPress={() => signOut()}
          startContent={<Icon icon="logout" />}
        >
          Log Out
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};
