import { cn } from '@heroui/react';
import { Icon as Iconify, IconProps as IconifyProps } from '@iconify/react';
import React from 'react';

type SupportedIcon =
  | 'trash'
  | 'folder-open'
  | 'clear'
  | 'add'
  | 'drag-handle'
  | 'cross'
  | 'undo'
  | 'edit'
  | 'email'
  | 'thumb-up'
  | 'thumb-down'
  | 'checkmark'
  | 'person-add'
  | 'more'
  | 'search'
  | 'share'
  | 'link'
  | 'download'
  | 'dashboard'
  | 'copy'
  | 'property-list'
  | 'logout'
  | 'settings'
  | 'about'
  | 'pricing'
  | 'premium-plan'
  | 'back'
  | 'filter'
  | 'ticket'
  | 'mailchimp'
  | 'chevron-forward'
  | 'add-ticket'
  | 'calculator'
  | 'helpbook'
  | 'bug'
  | 'hamburgerMenu'
  | 'sunMoon';

type CustomIconifyIconProps = Omit<IconifyProps, 'icon'>;

export interface IconProps extends Partial<CustomIconifyIconProps> {
  className?: string;
  icon: SupportedIcon;
}

export const Icon: React.FC<IconProps> = ({ className, icon, ...props }) => {
  let iconName: IconifyProps['icon'];
  switch (icon) {
    case 'trash':
      iconName = 'fa6-regular:trash-can';
      break;
    case 'folder-open':
      iconName = 'material-symbols-light:folder-open-outline';
      break;
    case 'clear':
      iconName = 'ic:round-clear';
      break;
    case 'add':
      iconName = 'material-symbols:add-circle-outline';
      break;
    case 'drag-handle':
      iconName = 'ic:outline-drag-indicator';
      break;
    case 'cross':
      iconName = 'ic:round-clear';
      break;
    case 'undo':
      iconName = 'grommet-icons:undo';
      break;
    case 'edit':
      iconName = 'carbon:edit';
      break;
    case 'email':
      iconName = 'mdi:email-outline';
      break;
    case 'thumb-up':
      iconName = 'mdi:thumbs-up-outline';
      break;
    case 'thumb-down':
      iconName = 'mdi:thumbs-down-outline';
      break;
    case 'checkmark':
      iconName = 'ion:checkmark-outline';
      break;
    case 'person-add':
      iconName = 'ion:person-add-outline';
      break;
    case 'more':
      iconName = 'mdi:more-vert';
      break;
    case 'search':
      iconName = 'akar-icons:search';
      break;
    case 'share':
      iconName = 'material-symbols:share-outline';
      break;
    case 'link':
      iconName = 'material-symbols:link';
      break;
    case 'download':
      iconName = 'ph:download-bold';
      break;
    case 'dashboard':
      iconName = 'ion:bar-chart-outline';
      break;
    case 'copy':
      iconName = 'fa-regular:copy';
      break;
    case 'property-list':
      iconName = 'ri:home-6-line';
      break;
    case 'logout':
      iconName = 'material-symbols:logout';
      break;
    case 'settings':
      iconName = 'gravity-ui:gear';
      break;
    case 'about':
      iconName = 'ion:information-outline';
      break;
    case 'pricing':
      iconName = 'la:donate';
      break;
    case 'premium-plan':
      iconName = 'fa6-solid:award';
      break;
    case 'back':
      iconName = 'ion:arrow-back';
      break;
    case 'filter':
      iconName = 'iconoir:filter';
      break;
    case 'ticket':
      iconName = 'heroicons:ticket';
      break;
    case 'mailchimp':
      iconName = 'cib:mailchimp';
      break;
    case 'chevron-forward':
      iconName = 'ion:chevron-forward';
      break;
    case 'add-ticket':
      iconName = 'lucide:ticket-plus';
      break;
    case 'calculator':
      iconName = 'hugeicons:calculator';
      break;
    case 'helpbook':
      iconName = 'grommet-icons:help-book';
      break;
    case 'bug':
      iconName = 'famicons:bug-outline';
      break;
    case 'hamburgerMenu':
      iconName = 'radix-icons:hamburger-menu';
      break;
    case 'sunMoon':
      iconName = 'lucide:sun-moon';
      break;
    default:
      iconName = 'pixel:question-solid';
  }

  return <Iconify className={cn(className)} icon={iconName} {...props} />;
};
