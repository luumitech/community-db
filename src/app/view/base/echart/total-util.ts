import { type BarSeriesOption } from 'echarts';
import { type EChartTheme } from './use-echart-theme';

type DataTotalFn = (dataIndex: number) => number;

type BarLabelProps = NonNullable<BarSeriesOption['label']>;
type BarLabelPosition = BarLabelProps['position'];
interface TotalUtilOpt {
  categoryNum: number;
  totalFn: DataTotalFn;
}

export class TotalUtil {
  #theme: EChartTheme;
  #categoryNum: number;
  #totalFn: DataTotalFn;

  constructor(theme: EChartTheme, opt: TotalUtilOpt) {
    this.#theme = theme;
    this.#categoryNum = opt.categoryNum;
    this.#totalFn = opt.totalFn;
  }

  /**
   * Add a "ghost" bar segment to the bar chart to display the total count for
   * the given stack bar
   *
   * ```ts
   * {
   *   name: 'total',
   *   type: 'bar',
   *   stack: 'members',
   *   ...totalUtil.totalBar(),
   * },
   * ```
   *
   * NOTE: You will want to specify grid.top or grid.right to reserve enough
   * space to render the total label in the case that it goes beyond the
   * boundary of the graph
   */
  totalBar(position?: BarLabelPosition): BarSeriesOption {
    return {
      data: this.#totalBarData(),
      label: this.#totalBarLabel(position),
      // Override the default labelLayout logic, to always show the total value
      labelLayout: { fontSize: 10 },
      tooltip: {
        valueFormatter: (_value, dataIndex) => `${this.#totalFn(dataIndex)}`,
      },
    };
  }

  /**
   * Creates ghost bar with zero value, so it doesn't take up any space in the
   * chart
   */
  #totalBarData() {
    return Array(this.#categoryNum).fill({
      value: 0,
      itemStyle: {
        color: 'transparent',
      },
    }) satisfies BarSeriesOption['data'];
  }

  #totalBarLabel(position: BarLabelPosition = 'top') {
    return {
      show: true,
      position,
      color: this.#theme.valueAxis.axisLabel.color,
      fontWeight: 'bold',
      formatter: (params) => {
        const { dataIndex } = params;
        const total = this.#totalFn(dataIndex);
        return total === 0 ? 'n/a' : `${total}`;
      },
    } satisfies BarLabelProps;
  }
}
