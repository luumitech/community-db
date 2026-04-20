import { commonTheme } from './common';

const herouiDefault500 = 'hsl(240 5.03% 64.9% / 1)';
const herouiDefault600 = 'hsl(240 4.88% 83.92% / 1)';

export const darkTheme = {
  ...commonTheme,
  darkMode: true,
  nameTextStyle: {
    color: herouiDefault500,
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
