import { cn } from '@heroui/react';
import {
  BeautifulMentionsMenuItemProps,
  BeautifulMentionsMenuProps,
} from 'lexical-beautiful-mentions';
import React from 'react';

export const CustomMenu: React.FC<BeautifulMentionsMenuProps> = ({
  loading,
  ...props
}) => {
  const ul = React.createRef<HTMLUListElement>();

  React.useLayoutEffect(() => {
    // This should be an element with `aria-label="Typeahead menu"`
    const menuContainer = ul.current?.parentElement;
    // Raise the z-index level so it can appear in front of nextui Modal
    menuContainer?.classList.add('z-50');
  }, [ul]);

  return (
    <ul
      ref={ul}
      className={cn(
        'w-[max-content] border-small',
        'rounded-small border-default-200 dark:border-default-100',
        'bg-background',
        'flex flex-col px-1 py-2'
      )}
      {...props}
    />
  );
};

export const CustomMenuItem = React.forwardRef<
  HTMLLIElement,
  BeautifulMentionsMenuItemProps
>(
  (
    {
      selected,
      item,
      // remove deprecated keys from props, so it doesn't trigger react warning about unsupported attributes
      itemValue,
      children,
      ...props
    },
    ref
  ) => {
    const { varname } = item.data ?? {};

    return (
      <li
        ref={ref}
        className={cn('px-2 py-1 text-sm', 'rounded-small cursor-pointer', {
          'text-default-foreground bg-default': selected,
        })}
        {...props}
      >
        {varname ?? children}
      </li>
    );
  }
);

CustomMenuItem.displayName = 'CustomMenuItem';
