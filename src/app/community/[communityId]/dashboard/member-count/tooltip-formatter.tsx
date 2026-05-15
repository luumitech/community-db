import { Divider } from '@heroui/react';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import type {
  CallbackDataParams,
  TopLevelFormatterParams,
} from '~/view/base/echart';

/**
 * Custom tooltip renderer:
 *
 * What we want is to get:
 *
 *     Title
 *     new     xx
 *     renew   xx
 *     total   xx
 *
 *     Renewal xx
 */
export function tooltipFormatter(params: TopLevelFormatterParams) {
  // We know there should be 4 series
  if (!Array.isArray(params)) {
    return '';
  }

  /**
   * Assume the available series are:
   *
   *     chartHelper.lineSeries('noRenewal', 'no renewal'),
   *     chartHelper.barSeries('renew', 'renewed', selectedYear),
   *     chartHelper.barSeries('new', 'new', selectedYear),
   *     chartHelper.totalBarSeries(),
   */
  const seriesNorenewal = params[0];
  const seriesRenew = params[1];
  const seriesNew = params[2];
  const seriesTotal = {
    ...params[3],
    // @ts-expect-error value is a complex type, but we assume it is number here
    value: (seriesNew.value ?? 0) + (seriesRenew.value ?? 0),
  };

  const Tooltip = (
    <>
      <TooltipTitle item={params[0]} />
      <TooltipItem item={seriesNew} />
      <TooltipItem item={seriesRenew} />
      <TooltipItem item={seriesTotal} />
      <Divider className="my-2" />
      <TooltipItem item={seriesNorenewal} />
    </>
  );

  return renderToStaticMarkup(Tooltip);
}

interface Props {
  item: CallbackDataParams;
}

const TooltipTitle: React.FC<Props> = ({ item }) => {
  // @ts-expect-error typescript missing the label property, but it should exists
  const title = item.axisValueLabel;
  return <div>{title}</div>;
};

const TooltipItem: React.FC<Props> = ({ item }) => {
  return (
    <div className="flex min-w-[120px] items-center">
      <div className="flex items-center gap-1">
        <TooltipMarker item={item} />
        <span>{item.seriesName}</span>
      </div>
      {item.value != null && (
        <span className="ml-auto font-semibold">{item.value.toString()}</span>
      )}
    </div>
  );
};

const TooltipMarker: React.FC<Props> = ({ item }) => {
  // Create a horizontal line element matching the series color
  if (item.seriesType === 'line') {
    return (
      <span
        className="mr-0.5 h-[3px] w-3 align-middle"
        {...(typeof item.color === 'string' && {
          style: { backgroundColor: item.color },
        })}
      />
    );
  }

  // Default marker, if available
  if (!item.marker) {
    return null;
  }
  return <div dangerouslySetInnerHTML={{ __html: item.marker }} />;
};
