import { Avatar } from '@heroui/react';
import React from 'react';
import { useAppContext } from '~/custom-hooks/app-context';
import { useSignOut } from '~/custom-hooks/auth';
import { useUserInfo } from '~/custom-hooks/user-info';
import { appLabel, appPath } from '~/lib/app-path';
import { Dropdown } from '~/view/base/dropdown';
import { Icon } from '~/view/base/icon';
import { BmcLabel, BmcLogo, BmcUrl } from '~/view/buy-me-a-coffee';
import { ThemeSelect } from './theme-select';

import styles from './styles.module.css';

interface Props {}

export const SignedIn: React.FC<Props> = () => {
  const { env } = useAppContext();
  const { fullName, email, image } = useUserInfo();
  const signOut = useSignOut();

  const subscriptionPlanEnable = env.NEXT_PUBLIC_PLAN_ENABLE;

  return (
    <Dropdown placement="bottom-end">
      <Dropdown.Trigger>
        <Avatar
          className="cursor-pointer bg-transparent transition-transform"
          data-testid="signed-in-user-avatar"
          isFocusable
          isBordered
          size="md"
          {...(fullName != null && { name: fullName })}
          {...(image != null && { src: image })}
        />
      </Dropdown.Trigger>
      <Dropdown.Menu
        className={styles['drop-down']}
        aria-label="Open system navigation menu"
        variant="flat"
        disabledKeys={[subscriptionPlanEnable ? 'buyMeACoffee' : 'pricingPlan']}
      >
        <Dropdown.Item
          key="profile"
          textValue={appLabel('userProfile')}
          href={appPath('userProfile')}
          startContent={<Icon icon="person" />}
          showDivider
        >
          <p className="font-semibold">{email}</p>
        </Dropdown.Item>
        <Dropdown.Item
          key="about"
          href={appPath('about')}
          startContent={<Icon icon="about" />}
        >
          {appLabel('about')}
        </Dropdown.Item>
        {/* <Dropdown.Item
          key="preference"
          href={appPath('preference')}
          startContent={<Icon icon="settings" />}
        >
          {appLabel('preference')}
        </Dropdown.Item> */}
        <Dropdown.Item
          key="theme"
          isReadOnly
          startContent={<Icon icon="sunMoon" />}
          endContent={<ThemeSelect />}
        >
          Theme
        </Dropdown.Item>
        <Dropdown.Item
          key="pricingPlan"
          href={appPath('pricingPlan')}
          startContent={
            <Icon className="text-yellow-600" icon="premium-plan" />
          }
          showDivider
        >
          {appLabel('pricingPlan')}
        </Dropdown.Item>
        <Dropdown.Item
          classNames={{
            base: 'bg-primary-200 data-[hover=true]:hover:bg-primary',
          }}
          key="buyMeACoffee"
          href={BmcUrl}
          target="_blank"
          rel="noopener noreferrer"
          startContent={<BmcLogo />}
          textValue="Buy me a coffee"
          showDivider
        >
          <BmcLabel />
        </Dropdown.Item>
        <Dropdown.Item
          key="tutorial"
          href={appPath('tutorial')}
          startContent={<Icon icon="helpbook" />}
        >
          {appLabel('tutorial')}
        </Dropdown.Item>
        <Dropdown.Item
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
        </Dropdown.Item>
        <Dropdown.Item
          key="logout"
          color="danger"
          onPress={signOut}
          startContent={<Icon icon="logout" />}
        >
          Log Out
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};
