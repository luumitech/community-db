import { Tooltip } from '@nextui-org/react';
import clsx from 'clsx';
import React from 'react';
import { type IconType } from 'react-icons';
import { FaFolderOpen, FaTrashAlt } from 'react-icons/fa';
import { GrUndo } from 'react-icons/gr';
import { IoMdAddCircleOutline } from 'react-icons/io';
import {
  MdDragIndicator,
  MdOutlineClear,
  MdQuestionMark,
} from 'react-icons/md';
import { RxCross2 } from 'react-icons/rx';

interface Props
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLSpanElement>,
    HTMLSpanElement
  > {
  className?: string;
  icon:
    | 'trash'
    | 'folder-open'
    | 'clear'
    | 'add'
    | 'drag-handle'
    | 'cross'
    | 'undo';
  /**
   * Tooltip description
   */
  tooltip?: string;
}

export const FlatButton: React.FC<Props> = ({
  className,
  tooltip,
  ...props
}) => {
  const renderButton = React.useMemo(() => {
    const { icon, ...other } = props;
    let Icon: IconType;
    switch (props.icon) {
      case 'trash':
        Icon = FaTrashAlt;
        break;
      case 'folder-open':
        Icon = FaFolderOpen;
        break;
      case 'clear':
        Icon = MdOutlineClear;
        break;
      case 'add':
        Icon = IoMdAddCircleOutline;
        break;
      case 'drag-handle':
        Icon = MdDragIndicator;
        break;
      case 'cross':
        Icon = RxCross2;
        break;
      case 'undo':
        Icon = GrUndo;
        break;
      default:
        Icon = MdQuestionMark;
    }

    return (
      <span
        role="button"
        className={clsx(
          className,
          'opacity-80 hover:opacity-100 active:opacity-50'
        )}
        {...other}
      >
        <Icon size={16} />
      </span>
    );
  }, [className, props]);

  return tooltip ? (
    <Tooltip content={tooltip}>{renderButton}</Tooltip>
  ) : (
    renderButton
  );
};
