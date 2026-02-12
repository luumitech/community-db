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
    /**
     * - Default gap between header row and 1st body row
     *
     * If `isVirtualized`:
     *
     * - Is false, this gap is applicable between each row
     * - Is true, the gap needs to be controlled by the `gap` property in
     *   `virtualConfig` for each row
     */
    'gap-2',
    /** Default grid layout, 6 equal columns */
    'grid-cols-6'
  ),
  commonContainer: cn(
    /** Default gap between each column cells */
    'gap-1'
  ),
  headerSticky: cn(
    /**
     * Default sticky to just below the app header
     *
     * It's done this way, because this app let the entire page scroll, and
     * there is already a sticky header (The app header). In order for the inner
     * GridTable to be sticky as well, it needs to know the height of the app
     * header.
     */
    'sticky top-header-height z-50 bg-background'
  ),
  headerContainer: cn(
    /** Background color */
    'bg-default-200/50',
    /** Default header text */
    'text-xs font-semibold text-default-400'
  ),
  bodyContainer: cn(''),
};

/** Properties in HeaderWrapperProps */
export const HEADER_PROPS = [
  'isHeaderSticky',
  'sortDescriptor',
  'onSortChange',
  'topContent',
  'renderHeader',
] as const;

/** Properties in BodyWrapperProps */
export const BODY_PROPS = ['virtualConfig', 'items'] as const;

/** Properties in CommonProps */
export const COMMON_PROPS = [
  'config',
  'columnKeys',
  'columnConfig',
  'sortableColumnKeys',
] as const;
