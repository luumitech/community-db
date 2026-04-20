import { commonTheme } from './common';

const herouiDefault500 = 'hsl(240 3.83% 46.08% / 1)';
const herouiDefault600 = 'hsl(240 5.2% 33.92% / 1)';

export const lightTheme = {
  ...commonTheme,
  legend: {
    ...commonTheme.legend,
    textStyle: {
      color: herouiDefault600,
    },
  },
  categoryAxis: {
    ...commonTheme.categoryAxis,
    axisLabel: {
      show: true,
      color: herouiDefault500,
    },
  },
  valueAxis: {
    ...commonTheme.valueAxis,
    axisLabel: {
      show: true,
      color: herouiDefault500,
    },
  },
};
