import clsx from 'clsx';
import React from 'react';
import { type IconBaseProps, type IconType } from 'react-icons';
import { BiEditAlt } from 'react-icons/bi';
import {
  FaAward,
  FaFolderOpen,
  FaList,
  FaRegCopy,
  FaSearch,
  FaTrashAlt,
} from 'react-icons/fa';
import { FaDownload } from 'react-icons/fa6';
import { FcDonate } from 'react-icons/fc';
import { GrUndo } from 'react-icons/gr';
import { HiOutlineTicket } from 'react-icons/hi2';
import {
  IoIosSettings,
  IoMdAddCircleOutline,
  IoMdLink,
  IoMdMore,
} from 'react-icons/io';
import {
  IoArrowBack,
  IoBarChart,
  IoCheckmark,
  IoFilter,
  IoInformation,
  IoPersonAdd,
  IoTicket,
} from 'react-icons/io5';
import {
  MdDragIndicator,
  MdIosShare,
  MdLogout,
  MdOutlineClear,
  MdOutlineMail,
  MdOutlineThumbDown,
  MdOutlineThumbUp,
  MdQuestionMark,
} from 'react-icons/md';
import { RxCross2 } from 'react-icons/rx';

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
  | 'list'
  | 'logout'
  | 'settings'
  | 'about'
  | 'pricing'
  | 'premium-plan'
  | 'back'
  | 'filter'
  | 'ticket';

export interface IconProps extends IconBaseProps {
  className?: string;
  icon: SupportedIcon;
}

export const Icon: React.FC<IconProps> = ({ className, icon, ...props }) => {
  let IconElement: IconType;
  switch (icon) {
    case 'trash':
      IconElement = FaTrashAlt;
      break;
    case 'folder-open':
      IconElement = FaFolderOpen;
      break;
    case 'clear':
      IconElement = MdOutlineClear;
      break;
    case 'add':
      IconElement = IoMdAddCircleOutline;
      break;
    case 'drag-handle':
      IconElement = MdDragIndicator;
      break;
    case 'cross':
      IconElement = RxCross2;
      break;
    case 'undo':
      IconElement = GrUndo;
      break;
    case 'edit':
      IconElement = BiEditAlt;
      break;
    case 'email':
      IconElement = MdOutlineMail;
      break;
    case 'thumb-up':
      IconElement = MdOutlineThumbUp;
      break;
    case 'thumb-down':
      IconElement = MdOutlineThumbDown;
      break;
    case 'checkmark':
      IconElement = IoCheckmark;
      break;
    case 'person-add':
      IconElement = IoPersonAdd;
      break;
    case 'more':
      IconElement = IoMdMore;
      break;
    case 'search':
      IconElement = FaSearch;
      break;
    case 'share':
      IconElement = MdIosShare;
      break;
    case 'link':
      IconElement = IoMdLink;
      break;
    case 'download':
      IconElement = FaDownload;
      break;
    case 'dashboard':
      IconElement = IoBarChart;
      break;
    case 'copy':
      IconElement = FaRegCopy;
      break;
    case 'list':
      IconElement = FaList;
      break;
    case 'logout':
      IconElement = MdLogout;
      break;
    case 'settings':
      IconElement = IoIosSettings;
      break;
    case 'about':
      IconElement = IoInformation;
      break;
    case 'pricing':
      IconElement = FcDonate;
      break;
    case 'premium-plan':
      IconElement = FaAward;
      break;
    case 'back':
      IconElement = IoArrowBack;
      break;
    case 'filter':
      IconElement = IoFilter;
      break;
    case 'ticket':
      IconElement = HiOutlineTicket;
      break;
    default:
      IconElement = MdQuestionMark;
  }

  return <IconElement className={clsx(className)} {...props} />;
};
