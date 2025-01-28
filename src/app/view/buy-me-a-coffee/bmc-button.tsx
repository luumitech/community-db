import { Link } from '@nextui-org/react';
import clsx from 'clsx';
import Image from 'next/image';
import React from 'react';
import { BmcUrl } from './_type';
import buyMeACoffeeButtonImg from './buy-me-a-coffee-button.png';

interface Props {
  className?: string;
}

export const BmcButton: React.FC<Props> = ({ className }) => {
  return (
    <Link className={clsx(className)} href={BmcUrl} target="_blank">
      <Image
        src={buyMeACoffeeButtonImg}
        alt="Buy Me A Coffee"
        // Original dimension is 217px x 60px
        width={122}
      />
    </Link>
  );
};
