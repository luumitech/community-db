import {
  commonColors,
  semanticColors,
  type ColorScale,
} from '@nextui-org/theme';
import { useTheme } from 'next-themes';

function getColor(cs: ColorScale, key?: keyof ColorScale) {
  if (typeof cs === 'string') {
    return cs;
  } else {
    return cs[key ?? 'DEFAULT'];
  }
}

export function useNivoTheme() {
  const { resolvedTheme } = useTheme();
  if (!resolvedTheme) {
    return undefined;
  }
  let theme: 'light' | 'dark' = 'light';
  switch (resolvedTheme) {
    case 'dark':
      theme = 'dark';
  }
  const color = semanticColors[theme];

  return {
    background: getColor(color.background),
    text: {
      fontSize: 11,
      fill: getColor(color.foreground),
      outlineWidth: 0,
      outlineColor: 'transparent',
    },
    axis: {
      domain: {
        line: {
          stroke: getColor(color.foreground, 500),
          strokeWidth: 1,
        },
      },
      legend: {
        text: {
          fontSize: 12,
          fill: getColor(color.foreground),
          outlineWidth: 0,
          outlineColor: 'transparent',
        },
      },
      ticks: {
        line: {
          stroke: getColor(color.foreground, 500),
          strokeWidth: 1,
        },
        text: {
          fontSize: 11,
          fill: getColor(color.foreground, 500),
          outlineWidth: 0,
          outlineColor: 'transparent',
        },
      },
    },
    grid: {
      line: {
        stroke: getColor(color.foreground, 300),
        strokeWidth: 1,
      },
    },
    legends: {
      title: {
        text: {
          fontSize: 11,
          fill: getColor(color.foreground),
          outlineWidth: 0,
          outlineColor: 'transparent',
        },
      },
      text: {
        fontSize: 11,
        fill: getColor(color.foreground),
        outlineWidth: 0,
        outlineColor: 'transparent',
      },
      ticks: {
        line: {},
        text: {
          fontSize: 10,
          fill: getColor(color.foreground),
          outlineWidth: 0,
          outlineColor: 'transparent',
        },
      },
    },
    annotations: {
      text: {
        fontSize: 13,
        fill: getColor(color.foreground),
        outlineWidth: 2,
        outlineColor: getColor(color.background),
        outlineOpacity: 1,
      },
      link: {
        stroke: getColor(color.foreground),
        strokeWidth: 1,
        outlineWidth: 2,
        outlineColor: getColor(color.background),
        outlineOpacity: 1,
      },
      outline: {
        stroke: getColor(color.foreground),
        strokeWidth: 2,
        outlineWidth: 2,
        outlineColor: getColor(color.background),
        outlineOpacity: 1,
      },
      symbol: {
        fill: getColor(color.foreground),
        outlineWidth: 2,
        outlineColor: getColor(color.background),
        outlineOpacity: 1,
      },
    },
    tooltip: {
      wrapper: {},
      container: {
        background: getColor(color.background),
        color: getColor(color.foreground),
        fontSize: 12,
      },
      basic: {},
      chip: {},
      table: {},
      tableCell: {},
      tableCellValue: {},
    },
  };
}
