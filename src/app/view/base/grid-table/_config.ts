import { cn } from '@heroui/react';
import type { ClassNameConfig } from './_type';

interface ClassDefault extends ClassNameConfig {
  /** Define a set of attributes that are not overridable by user */

  /** Inherit column configuration from parent container */
  inheritContainer: string;

  /** Classes defined on virtualized container */
  virtualizedContainer: string;
}

export const CLASS_DEFAULT: ClassDefault = {
  inheritContainer: cn(
    /** Repeat parent's grid layout, to this element */
    'col-span-full grid grid-cols-subgrid'
  ),
  virtualizedContainer: cn(
    /** Tanstack virtualizer requires container to have defined height */
    'h-full overflow-auto',
    /**
     * If there are not enough rows to fill the height, we need to make sure
     * each row don't grow vertically
     */
    'grid-rows-[min-content]'
  ),
  gridContainer: cn(
    /** Default grid layout, 6 equal columns */
    'grid-cols-6'
  ),
  commonContainer: cn(
    /** Default gap between each column cells */
    'gap-1'
  ),
  headerSticky: cn(
    /**
     * Default sticky to top of container
     *
     * - The highest z-index in the app is z-50 (same as dialog z-index)
     * - The property autocomplete blurred background is z-40
     * - So the default for the sticky header is next level lower, so it go behind
     *   the blurred background
     */
    'sticky top-0 z-30',
    /** Matches the default background color */
    'bg-background'
  ),
  headerContainer: cn(
    /** Background color */
    'bg-default-200',
    'rounded-small',
    /** Default header text */
    'text-xs font-semibold text-default-400'
  ),
  bodyContainer: cn(''),
};

/** Properties in HeaderProps */
export const HEADER_PROPS = [
  'isHeaderSticky',
  'sortDescriptor',
  'onSortChange',
  'topContent',
  'renderHeader',
] as const;

/** Properties in BodyProps */
export const BODY_PROPS = [
  'virtualConfig',
  'items',
  'renderItemContainer',
  'renderItem',
] as const;

/** Properties in CommonProps */
export const COMMON_PROPS = [
  'config',
  'columnKeys',
  'columnConfig',
  'sortableColumnKeys',
] as const;
