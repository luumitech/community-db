import {
  CardBody,
  CardFooter,
  CardHeader,
  Card as NextUICard,
  type CardProps as NextUICardProps,
} from '@heroui/react';
import React from 'react';

export type { CardFooterProps } from '@heroui/react';

type Card = typeof CardImpl & {
  Header: typeof CardHeader;
  Body: typeof CardBody;
  Footer: typeof CardFooter;
};

type PolymorphicProps<T extends React.ElementType> = {
  as?: T;
} & React.ComponentPropsWithRef<T>;

export interface CardProps extends NextUICardProps {}

const CardImpl = React.forwardRef(
  <T extends React.ElementType>(
    { as, ...props }: PolymorphicProps<T> & CardProps,
    ref: React.ComponentPropsWithRef<T>['ref']
  ) => {
    return <NextUICard as={as} {...props} ref={ref} />;
  }
);
CardImpl.displayName = 'Card';

export const Card = CardImpl as Card;
Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;
