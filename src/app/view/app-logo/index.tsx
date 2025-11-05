import { cn } from '@heroui/react';
import Image, { ImageProps } from 'next/image';
import React from 'react';
import { twMerge } from 'tailwind-merge';
import styles from './styles.module.css';

type CustomImageProps = Omit<ImageProps, 'src' | 'alt'>;

interface Props extends CustomImageProps {
  className?: string;
  size?: number;
  /** Use transparent background? */
  transparentBg?: boolean;
}

export const AppLogo: React.FC<Props> = ({
  className,
  size,
  transparentBg,
  ...props
}) => {
  return (
    <Image
      className={twMerge(
        styles.logo,
        'object-fit rounded-md',
        cn({
          'bg-success-300': !transparentBg,
        }),
        className
      )}
      src="/image/community-db-logo.png"
      alt="LummiTech Logo"
      width={size ?? 36}
      height={size ?? 36}
      {...props}
    />
  );
};
