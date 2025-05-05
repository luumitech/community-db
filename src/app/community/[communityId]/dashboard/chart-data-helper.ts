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

  /** Get the y value given a chart data point */
  yVal(entry: DataT): number {
    throw new Error('This needs to be implemented');
  }

  /**
   * In order to avoid Y ticks from landing on non-integer numbers, we will
   * generate our own ticks
   *
   * @param numTicks Maximum number of ticks to show on axis
   * @returns
   */
  getYTicks(numTicks: number) {
    if (this.chartData.length === 0) {
      return undefined;
    }
    const yValues = this.chartData.map(this.yVal);
    const maxY = Math.max(...yValues);
    const step = ChartDataHelperUtil.nextDivisibleBy5(
      Math.ceil(maxY / numTicks)
    );
    const ticks = [];
    for (let i = 0; i <= maxY; i += step) {
      ticks.push(i);
    }

    return ticks;
  }
}
