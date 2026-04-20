export const commonTheme = {
  grid: {
    left: '5%',
    right: '5%',
    top: 0,
    bottom: 70,
  },
  color: [
    '#fbb4ae',
    '#b3cde3',
    '#ccebc5',
    '#decbe4',
    '#fed9a6',
    '#ffffcc',
    '#e5d8bd',
    '#fddaec',
    '#f2f2f2',
  ],
  backgroundColor: 'rgba(0, 0, 0, 0)',
  textStyle: {},
  title: {
    textStyle: {
      color: '#464646',
    },
    subtextStyle: {
      color: '#6E7079',
    },
  },
  // Styling of labels within bar or pie slice
  label: {
    color: 'rgb(79,109,140)',
    fontSize: 11,
    fontFamily: 'sans-serif',
  },
  /**
   * This is not supported natively by EChart, but is used in the app to high
   * light a bar or pie slice when it is selected
   */
  selectedItemStyle: {
    decal: {
      symbol: 'rect',
      color: 'rgba(255,255,255,0.8)',
      dashArrayX: [1, 0],
      dashArrayY: [2, 12],
      rotation: 40,
    },
  },
  legend: {
    left: 'center',
    right: 'auto',
    top: 0,
    bottom: 10,
  },
  tooltip: {
    confine: true,
    axisPointer: {
      lineStyle: {
        color: '#ccc',
        width: 1,
      },
      crossStyle: {
        color: '#ccc',
        width: 1,
      },
    },
  },
  categoryAxis: {
    axisLine: {
      show: true,
      lineStyle: {
        color: '#6E7079',
      },
    },
    axisTick: {
      show: true,
      lineStyle: {
        color: '#6E7079',
      },
    },
    axisLabel: {
      show: true,
    },
    splitLine: {
      show: false,
      lineStyle: {
        color: ['#E0E6F1'],
      },
    },
    splitArea: {
      show: false,
      areaStyle: {
        color: ['rgba(250,250,250,0.2)', 'rgba(210,219,238,0.2)'],
      },
    },
  },
  valueAxis: {
    axisLine: {
      show: false,
      lineStyle: {
        color: '#6E7079',
      },
    },
    axisTick: {
      show: false,
      lineStyle: {
        color: '#6E7079',
      },
    },
    axisLabel: {
      show: true,
    },
    splitLine: {
      show: true,
      lineStyle: {
        color: ['#E0E6F1'],
      },
    },
    splitArea: {
      show: false,
      areaStyle: {
        color: ['rgba(250,250,250,0.2)', 'rgba(210,219,238,0.2)'],
      },
    },
  },
  // line: {
  //   itemStyle: {
  //     borderWidth: 1,
  //   },
  //   lineStyle: {
  //     width: 2,
  //   },
  //   symbolSize: 4,
  //   symbol: 'emptyCircle',
  //   smooth: false,
  // },
  // radar: {
  //   itemStyle: {
  //     borderWidth: 1,
  //   },
  //   lineStyle: {
  //     width: 2,
  //   },
  //   symbolSize: 4,
  //   symbol: 'emptyCircle',
  //   smooth: false,
  // },
  // bar: {
  //   itemStyle: {
  //     barBorderWidth: 0,
  //     barBorderColor: '#ccc',
  //   },
  //   label: {
  //     show: true,
  //     color: 'rgb(79,109,140)',
  //     fontSize: 11,
  //     fontFamily: 'sans-serif',
  //   },
  // },
  // pie: {
  //   itemStyle: {
  //     borderWidth: 0,
  //     borderColor: '#ccc',
  //   },
  //   label: {
  //     show: true,
  //     color: 'rgb(79,109,140)',
  //     fontSize: 11,
  //     fontFamily: 'sans-serif',
  //   },
  // },
  // scatter: {
  //   itemStyle: {
  //     borderWidth: 0,
  //     borderColor: '#ccc',
  //   },
  // },
  // boxplot: {
  //   itemStyle: {
  //     borderWidth: 0,
  //     borderColor: '#ccc',
  //   },
  // },
  // parallel: {
  //   itemStyle: {
  //     borderWidth: 0,
  //     borderColor: '#ccc',
  //   },
  // },
  // sankey: {
  //   itemStyle: {
  //     borderWidth: 0,
  //     borderColor: '#ccc',
  //   },
  // },
  // funnel: {
  //   itemStyle: {
  //     borderWidth: 0,
  //     borderColor: '#ccc',
  //   },
  // },
  // gauge: {
  //   itemStyle: {
  //     borderWidth: 0,
  //     borderColor: '#ccc',
  //   },
  // },
  // candlestick: {
  //   itemStyle: {
  //     color: '#eb5454',
  //     color0: '#47b262',
  //     borderColor: '#eb5454',
  //     borderColor0: '#47b262',
  //     borderWidth: 1,
  //   },
  // },
  // graph: {
  //   itemStyle: {
  //     borderWidth: 0,
  //     borderColor: '#ccc',
  //   },

  //   lineStyle: {
  //     width: 1,
  //     color: '#aaa',
  //   },
  //   symbolSize: 4,
  //   symbol: 'emptyCircle',
  //   smooth: false,
  //   color: [
  //     '#fbb4ae',
  //     '#b3cde3',
  //     '#ccebc5',
  //     '#decbe4',
  //     '#fed9a6',
  //     '#ffffcc',
  //     '#e5d8bd',
  //     '#fddaec',
  //     '#f2f2f2',
  //   ],
  //   label: {
  //     color: '#eee',
  //   },
  // },
  // map: {
  //   itemStyle: {
  //     areaColor: '#eee',
  //     borderColor: '#444',
  //     borderWidth: 0.5,
  //   },
  //   label: {
  //     color: '#000',
  //   },
  //   emphasis: {
  //     itemStyle: {
  //       areaColor: 'rgba(255,215,0,0.8)',
  //       borderColor: '#444',
  //       borderWidth: 1,
  //     },
  //     label: {
  //       color: 'rgb(100,0,0)',
  //     },
  //   },
  // },
  // geo: {
  //   itemStyle: {
  //     areaColor: '#eee',
  //     borderColor: '#444',
  //     borderWidth: 0.5,
  //   },
  //   label: {
  //     color: '#000',
  //   },
  //   emphasis: {
  //     itemStyle: {
  //       areaColor: 'rgba(255,215,0,0.8)',
  //       borderColor: '#444',
  //       borderWidth: 1,
  //     },
  //     label: {
  //       color: 'rgb(100,0,0)',
  //     },
  //   },
  // },
  // logAxis: {
  //   axisLine: {
  //     show: false,
  //     lineStyle: {
  //       color: '#6E7079',
  //     },
  //   },
  //   axisTick: {
  //     show: false,
  //     lineStyle: {
  //       color: '#6E7079',
  //     },
  //   },
  //   axisLabel: {
  //     show: true,
  //     color: '#6E7079',
  //   },
  //   splitLine: {
  //     show: true,
  //     lineStyle: {
  //       color: ['#E0E6F1'],
  //     },
  //   },
  //   splitArea: {
  //     show: false,
  //     areaStyle: {
  //       color: ['rgba(250,250,250,0.2)', 'rgba(210,219,238,0.2)'],
  //     },
  //   },
  // },
  // timeAxis: {
  //   axisLine: {
  //     show: true,
  //     lineStyle: {
  //       color: '#6E7079',
  //     },
  //   },
  //   axisTick: {
  //     show: true,
  //     lineStyle: {
  //       color: '#6E7079',
  //     },
  //   },
  //   axisLabel: {
  //     show: true,
  //     color: '#6E7079',
  //   },
  //   splitLine: {
  //     show: false,
  //     lineStyle: {
  //       color: ['#E0E6F1'],
  //     },
  //   },
  //   splitArea: {
  //     show: false,
  //     areaStyle: {
  //       color: ['rgba(250,250,250,0.2)', 'rgba(210,219,238,0.2)'],
  //     },
  //   },
  // },
  // toolbox: {
  //   iconStyle: {
  //     borderColor: '#999',
  //   },
  //   emphasis: {
  //     iconStyle: {
  //       borderColor: '#666',
  //     },
  //   },
  // },
  // timeline: {
  //   lineStyle: {
  //     color: '#DAE1F5',
  //     width: 2,
  //   },
  //   itemStyle: {
  //     color: '#A4B1D7',
  //     borderWidth: 1,
  //   },
  //   controlStyle: {
  //     color: '#A4B1D7',
  //     borderColor: '#A4B1D7',
  //     borderWidth: 1,
  //   },
  //   checkpointStyle: {
  //     color: '#316bf3',
  //     borderColor: '#fff',
  //   },
  //   label: {
  //     color: '#A4B1D7',
  //   },
  //   emphasis: {
  //     itemStyle: {
  //       color: '#FFF',
  //     },
  //     controlStyle: {
  //       color: '#A4B1D7',
  //       borderColor: '#A4B1D7',
  //       borderWidth: 1,
  //     },
  //     label: {
  //       color: '#A4B1D7',
  //     },
  //   },
  // },
  // visualMap: {
  //   color: ['#bf444c', '#d88273', '#f6efa6'],
  // },
  // markPoint: {
  //   label: {
  //     color: '#eee',
  //   },
  //   emphasis: {
  //     label: {
  //       color: '#eee',
  //     },
  //   },
  // },
};
