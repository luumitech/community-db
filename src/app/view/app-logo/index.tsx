import { cn } from '@heroui/react';
import Image, { ImageProps } from 'next/image';
import React from 'react';
import styles from './styles.module.css';

type CustomImageProps = Omit<ImageProps, 'src' | 'alt'>;

interface Props extends CustomImageProps {
  className?: string;
}

export const AppLogo: React.FC<Props> = ({ className, ...props }) => {
  return (
    <Image
      className={cn(
        className,
        styles.logo,
        'object-fit rounded-md bg-success-300'
      )}
      src="/image/community-db-logo.png"
      alt="LummiTech Logo"
      width={36}
      height={36}
      {...props}
    />
  );
};
