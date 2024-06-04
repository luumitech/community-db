import { Tooltip } from '@nextui-org/react';
import clsx from 'clsx';
import React from 'react';
import { FaFolderOpen, FaTrashAlt } from 'react-icons/fa';
import { IoMdAddCircleOutline } from 'react-icons/io';
import { MdOutlineClear, MdQuestionMark } from 'react-icons/md';

interface Props
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLSpanElement>,
    HTMLSpanElement
  > {
  className?: string;
  icon: 'trash' | 'folder-open' | 'clear' | 'add';
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
    let iconImg = null;
    switch (props.icon) {
      case 'trash':
        iconImg = <FaTrashAlt />;
        break;
      case 'folder-open':
        iconImg = <FaFolderOpen />;
        break;
      case 'clear':
        iconImg = <MdOutlineClear />;
        break;
      case 'add':
        iconImg = <IoMdAddCircleOutline />;
        break;
      default:
        iconImg = <MdQuestionMark />;
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
        {iconImg}
      </span>
    );
  }, [className, props]);

  return tooltip ? (
    <Tooltip content={tooltip}>{renderButton}</Tooltip>
  ) : (
    renderButton
  );
};
