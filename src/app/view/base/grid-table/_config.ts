import { cn } from '@heroui/react';
import type { ClassNameConfig } from './_type';

interface ClassDefault extends ClassNameConfig {
  /** Define a set of attributes that are not overridable by user */

  /** Inherit column configuration from parent container */
  inheritContainer: string;
}

export const CLASS_DEFAULT: ClassDefault = {
  inheritContainer: cn(
    /** Repeat parent's grid layout, to this element */
    'col-span-full grid grid-cols-subgrid'
  ),
  gridContainer: cn(
    /**
     * Default gap between each row
     *
     * - As well as between header row and 1st body row
     */
    'gap-2',
    /** Default grid layout, 6 equal columns */
    'grid-cols-6'
  ),
  commonContainer: cn(
    /** Default gap between each column cells */
    'gap-1'
  ),
  headerContainer: cn(
    /** Background color */
    'bg-default-200/50',
    /** Default header text */
    'text-xs font-semibold text-default-400'
  ),
  bodyContainer: cn(''),
};
