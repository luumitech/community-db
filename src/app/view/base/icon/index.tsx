import { cn } from '@heroui/react';
import { Icon as Iconify, IconProps as IconifyProps } from '@iconify/react';
import React from 'react';

const supportedIcon = {
  trash: 'fa6-regular:trash-can',
  'folder-open': 'material-symbols-light:folder-open-outline',
  clear: 'ic:round-clear',
  add: 'material-symbols:add-circle-outline',
  'drag-handle': 'ic:outline-drag-indicator',
  cross: 'ic:round-clear',
  undo: 'grommet-icons:undo',
  edit: 'carbon:edit',
  email: 'mdi:email-outline',
  'export-contact': 'ri:contacts-book-upload-line',
  'export-xlsx': 'tdesign:file-export',
  'thumb-up': 'mdi:thumbs-up-outline',
  'thumb-down': 'mdi:thumbs-down-outline',
  checkmark: 'ion:checkmark-outline',
  'person-add': 'ion:person-add-outline',
  more: 'mdi:more-vert',
  search: 'akar-icons:search',
  share: 'material-symbols:share-outline',
  link: 'material-symbols:link',
  download: 'ph:download-bold',
  dashboard: 'ion:bar-chart-outline',
  copy: 'fa-regular:copy',
  'property-list': 'tabler:home',
  'property-editor': 'tabler:home-edit',
  logout: 'material-symbols:logout',
  settings: 'gravity-ui:gear',
  about: 'ion:information-outline',
  pricing: 'la:donate',
  'premium-plan': 'fa6-solid:award',
  back: 'ion:arrow-back',
  forward: 'ion:arrow-forward',
  filter: 'iconoir:filter',
  ticket: 'heroicons:ticket',
  mailchimp: 'cib:mailchimp',
  'chevron-forward': 'ion:chevron-forward',
  'add-ticket': 'lucide:ticket-plus',
  calculator: 'hugeicons:calculator',
  helpbook: 'grommet-icons:help-book',
  bug: 'famicons:bug-outline',
  hamburgerMenu: 'radix-icons:hamburger-menu',
  sunMoon: 'lucide:sun-moon',
  sun: 'lucide:sun',
  moon: 'lucide:moon',
  google: 'flat-color-icons:google',
  'modify-community': 'gravity-ui:gear',
  integration: 'eos-icons:api-outlined',
  warning: 'cuida:warning-outline',
  refresh: 'mdi:refresh',
  circle: 'material-symbols:circle',
  map: 'lucide:map-pin',
  noMap: 'lucide:map-pin-off',
  externalLink: 'mi:external-link',
  mapCenter: 'lsicon:map-location-filled',
} as const;

type CustomIconifyIconProps = Omit<IconifyProps, 'icon'>;

export interface IconProps extends Partial<CustomIconifyIconProps> {
  className?: string;
  icon: keyof typeof supportedIcon;
  size?: number;
}

export const Icon: React.FC<IconProps> = ({
  className,
  icon,
  size,
  ...props
}) => {
  const iconName = supportedIcon[icon];

  return (
    <Iconify
      className={cn(className)}
      icon={iconName ?? 'pixel:question-solid'}
      {...(size != null && { width: size, height: size })}
      {...props}
    />
  );
};
