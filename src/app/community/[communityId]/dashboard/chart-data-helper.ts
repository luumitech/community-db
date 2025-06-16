export class ChartDataHelperUtil<DataT> {
  public chartData: Readonly<DataT>[];

  constructor() {
    this.chartData = [];
  }

  /** Find the next number that is divisible by 5 */
  private static nextDivisibleBy5(n: number) {
    if (n === 1) {
      return 1;
    }
    return n + ((5 - (n % 5)) % 5) || n + 5;
  }

  /**
   * In order to avoid ticks from landing on non-integer numbers, we will
   * generate our own ticks
   *
   * @param maxTicks Maximum number of ticks to show on axis
   * @param valFn Callback function to return value given a chart data point
   * @returns
   */
  getIntegerTicks(maxTicks: number, valFn: (entry: DataT) => number) {
    if (this.chartData.length === 0) {
      return undefined;
    }
    const values = this.chartData.map(valFn);
    const maxValue = Math.max(...values);
    const step = ChartDataHelperUtil.nextDivisibleBy5(
      Math.ceil(maxValue / maxTicks)
    );
    const ticks = [];
    for (let i = 0; i <= maxValue; i += step) {
      ticks.push(i);
    }

    return ticks;
  }
}
