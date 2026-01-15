import { cn } from '@heroui/react';
import type { ClassNameConfig } from './_type';

interface ClassDefault extends ClassNameConfig {
  /** Define a set of attributes that are not overridable by user */

  /** Inherit column configuration from parent container */
  inheritContainer: string;
}

export const CLASS_DEFAULT: ClassDefault = {
  inheritContainer: cn('col-span-full grid grid-cols-subgrid'),
  gridContainer: cn(
    /** Default grid layout, 6 equal columns */
    'gap-2',
    'grid-cols-6'
  ),
  commonContainer: cn(
    /** Define gap within cells */
    'gap-1'
  ),
  headerContainer: cn(
    /** Default header text */
    'text-xs font-semibold text-default-400'
  ),
  bodyContainer: cn(''),
};
