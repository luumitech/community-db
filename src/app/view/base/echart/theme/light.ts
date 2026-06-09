import { commonTheme } from './common';

const herouiDefault100 = 'hsl(240 4.76% 95.88% / 1)';
const herouiDefault500 = 'hsl(240 3.83% 46.08% / 1)';
const herouiDefault600 = 'hsl(240 5.2% 33.92% / 1)';
const herouiForeground = 'hsl(201.82 24.44% 8.82% /1)';

export const lightTheme = {
  ...commonTheme,
  tooltip: {
    backgroundColor: herouiDefault100,
    textStyle: {
      color: herouiForeground,
    },
  },
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
