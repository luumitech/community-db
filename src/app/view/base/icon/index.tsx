import clsx from 'clsx';
import React from 'react';
import { type IconBaseProps, type IconType } from 'react-icons';
import { BiEditAlt } from 'react-icons/bi';
import { FaFolderOpen, FaSearch, FaTrashAlt } from 'react-icons/fa';
import { GrUndo } from 'react-icons/gr';
import { IoMdAdd, IoMdLink, IoMdMore } from 'react-icons/io';
import { IoCheckmark, IoPersonAdd } from 'react-icons/io5';
import {
  MdDragIndicator,
  MdEmail,
  MdIosShare,
  MdOutlineClear,
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
  | 'link';

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
      IconElement = IoMdAdd;
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
      IconElement = MdEmail;
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
    default:
      IconElement = MdQuestionMark;
  }

  return <IconElement className={clsx(className)} {...props} />;
};
