import { commonTheme } from './common';

const herouiDefault100 = 'hsl(240 3.7% 15.88% / 1)';
const herouiDefault500 = 'hsl(240 5.03% 64.9% / 1)';
const herouiDefault600 = 'hsl(240 4.88% 83.92% / 1)';
const herouiForeground = 'hsl(210 5.56% 92.94% /1)';

export const darkTheme = {
  ...commonTheme,
  darkMode: true,
  nameTextStyle: {
    color: herouiDefault500,
  },
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
