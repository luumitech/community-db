'use client';
import { BreadcrumbItem, Breadcrumbs, Link, cn } from '@heroui/react';
import React from 'react';
import { useAppContext } from '~/custom-hooks/app-context';
import { useSession } from '~/custom-hooks/auth';
import { appPath } from '~/lib/app-path';
import { appTitle } from '~/lib/env';
import { AppLogo } from '~/view/app-logo';
import { NotSignedIn } from './not-signed-in';
import { SignedIn } from './signed-in';
import { useTopMenu } from './use-top-menu';

export * from './header-menu';

interface Props {}

export const Header: React.FC<Props> = ({}) => {
  const { data, isPending } = useSession();
  const moreMenuAnchorDiv = React.useRef<HTMLDivElement>(null);
  const { setMoreMenuAnchor } = useAppContext();
  const breadcrumbItems = useTopMenu();

  React.useEffect(() => {
    const elem = moreMenuAnchorDiv.current;
    if (elem) {
      setMoreMenuAnchor(elem);
    }
  }, [setMoreMenuAnchor]);

  return (
    <header
      className={cn(
        /**
         * Makes sure header has the highest z-index in the app, but lower or
         * equal to dialog z-index (which is set to z-50)
         */
        'sticky top-0 z-50 h-header-height',
        'bg-background/70 backdrop-blur-lg',
        'flex items-center gap-4 px-6'
      )}
    >
      {/** App Logo */}
      <div className="items-center">
        <Link className="gap-1 text-foreground" href={appPath('home')}>
          <div className="w-9">
            <AppLogo priority size={36} />
          </div>
          {/* Hide appTitle in small layout */}
          <span
            className={cn(
              'max-w-min max-sm:hidden',
              'text-center leading-5',
              'font-bold text-balance whitespace-normal'
            )}
          >
            {appTitle}
          </span>
        </Link>
      </div>
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
      <div className="ml-auto flex items-center gap-2">
        {/* placeholder for inserting more menu */}
        <div ref={moreMenuAnchorDiv} id="header-more-menu" />
        {data != null ? <SignedIn /> : <NotSignedIn isLoading={isPending} />}
      </div>
    </header>
  );
};
