import { Button, cn } from '@heroui/react';
import { GridStack as GS, GridStackWidget as GSWidget } from 'gridstack';
import React from 'react';
import { GridStack, type Widget } from '~/view/base/grid-stack';
import { ChartWidget } from './chart-widget';
import { StatWidget } from './stat-widget';

const INITIAL_WIDGETS: Widget[] = [
  {
    id: 'w1',
    x: 0,
    y: 0,
    w: 4,
    h: 3,
    content: <ChartWidget title="Revenue (w1)" color="#dbeafe" />,
  },
  {
    id: 'w2',
    x: 4,
    y: 0,
    w: 4,
    h: 3,
    content: <ChartWidget title="Users (w2)" color="#dcfce7" />,
  },
  {
    id: 'w3',
    x: 8,
    y: 0,
    w: 4,
    h: 3,
    content: <ChartWidget title="Churn (w3)" color="#fef9c3" />,
  },
  {
    id: 'w4',
    x: 0,
    y: 3,
    w: 2,
    h: 2,
    content: <StatWidget label="Sessions (w4)" value="1,204" />,
  },
  {
    id: 'w5',
    x: 2,
    y: 3,
    w: 2,
    h: 2,
    content: <StatWidget label="Bounce (w5)" value="34%" />,
  },
];

/**
 * Parse out the number within the widget ID
 *
 * - Widget Id is in the form of 'w{number}'
 */
function parseWidgetId(value: string): number | null {
  const match = /^w(\d+)$/.exec(value);
  if (!match) {
    return null;
  }
  return parseInt(match[1], 10);
}

interface Props {
  className?: string;
}

export const Demo: React.FC<Props> = ({ className }) => {
  const [widgets, setWidgets] = React.useState<Widget[]>(INITIAL_WIDGETS);
  const [gap, setGap] = React.useState(10);
  const [log, setLog] = React.useState<string[]>([]);
  const nextId = React.useMemo(() => {
    const maxId = Math.max(...widgets.map(({ id }) => parseWidgetId(id) ?? 0));
    if (!Number.isFinite(maxId)) {
      return 1;
    }
    return maxId + 1;
  }, [widgets]);

  const handleChange = React.useCallback((grid: GS, items: GSWidget[]) => {
    setLog((prev) => [
      `change: [${items.map((i) => `${i.id}(${i.x},${i.y})`).join(', ')}]`,
      ...prev.slice(0, 4),
    ]);
  }, []);

  const addStat = React.useCallback(() => {
    const id = `w${nextId}`;
    setWidgets((prev) => [
      ...prev,
      {
        id,
        w: 2,
        h: 2,
        content: <StatWidget label={`Stat ${id}`} value={id} />,
      },
    ]);
  }, [nextId]);

  const addChart = React.useCallback(() => {
    const id = `w${nextId}`;
    setWidgets((prev) => [
      ...prev,
      {
        id,
        w: 4,
        h: 2,
        content: <ChartWidget title={`Chart ${id}`} color="#dcfce7" />,
      },
    ]);
  }, [nextId]);

  const removeFirst = () => setWidgets((prev) => prev.slice(1));
  const removeLast = () => setWidgets((prev) => prev.slice(0, -1));

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex gap-2">
        <Button color="primary" onPress={addStat}>
          + Add Stat
        </Button>
        <Button color="primary" onPress={addChart}>
          + Add Chart
        </Button>
        <Button color="danger" onPress={removeFirst}>
          − Remove First
        </Button>
        <Button color="danger" onPress={removeLast}>
          − Remove Last
        </Button>
        <Button onPress={() => setGap(4)}>Set padding to 4</Button>
        <Button onPress={() => setGap(10)}>Set padding to 10</Button>
      </div>

      <GridStack
        options={{ column: 12, cellHeight: 80, margin: gap }}
        onChange={handleChange}
      >
        <GridStack.Widgets widgets={widgets} />
      </GridStack>

      {log.length > 0 && (
        <div className="text-xs text-default-500">
          <strong>onChange log:</strong>
          {log.map((entry, i) => (
            <div key={i}>{entry}</div>
          ))}
        </div>
      )}
    </div>
  );
};
