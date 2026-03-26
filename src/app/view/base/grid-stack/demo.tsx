import { GridStack as GS, GridStackWidget as GSWidget } from 'gridstack';
import { useCallback, useState } from 'react';
import { GridStack, GridStackProvider } from '.';
import { type Widget } from './_type';

// ─── Demo widget components ───────────────────────────────────────────────────

function ChartWidget({ title, color }: { title: string; color: string }) {
  return (
    <div
      style={{
        height: '100%',
        padding: '12px',
        boxSizing: 'border-box',
        background: color,
        borderRadius: '8px',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}
    >
      <strong style={{ fontSize: 14 }}>{title}</strong>
      <div
        style={{
          flex: 1,
          background: 'rgba(255,255,255,0.35)',
          borderRadius: 4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 12,
          color: '#555',
        }}
      >
        Chart area
      </div>
    </div>
  );
}

function StatWidget({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        height: '100%',
        padding: '16px',
        boxSizing: 'border-box',
        background: '#f0f4ff',
        borderRadius: '8px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{ fontSize: 32, fontWeight: 700 }}>{value}</div>
      <div style={{ fontSize: 13, color: '#666', marginTop: 4 }}>{label}</div>
    </div>
  );
}

// ─── App ─────────────────────────────────────────────────────────────────────

const INITIAL_WIDGETS: Widget[] = [
  {
    id: 'w1',
    x: 0,
    y: 0,
    w: 4,
    h: 3,
    content: <ChartWidget title="Revenue" color="#dbeafe" />,
  },
  {
    id: 'w2',
    x: 4,
    y: 0,
    w: 4,
    h: 3,
    content: <ChartWidget title="Users" color="#dcfce7" />,
  },
  {
    id: 'w3',
    x: 8,
    y: 0,
    w: 4,
    h: 3,
    content: <ChartWidget title="Churn" color="#fef9c3" />,
  },
  {
    id: 'w4',
    x: 0,
    y: 3,
    w: 2,
    h: 2,
    content: <StatWidget label="Sessions" value="1,204" />,
  },
  {
    id: 'w5',
    x: 2,
    y: 3,
    w: 2,
    h: 2,
    content: <StatWidget label="Bounce" value="34%" />,
  },
];

let nextId = 6;

const btnStyle = (bg: string): React.CSSProperties => ({
  background: bg,
  color: '#fff',
  border: 'none',
  padding: '8px 14px',
  borderRadius: 6,
  cursor: 'pointer',
  fontSize: 13,
});

export function Demo() {
  const [widgets, setWidgets] = useState<Widget[]>(INITIAL_WIDGETS);
  const [log, setLog] = useState<string[]>([]);

  const handleChange = useCallback((grid: GS, items: GSWidget[]) => {
    setLog((prev) => [
      `change: [${items.map((i) => `${i.id}(${i.x},${i.y})`).join(', ')}]`,
      ...prev.slice(0, 4),
    ]);
  }, []);

  const addWidget = () => {
    const id = `w${nextId++}`;
    setWidgets((prev) => [
      ...prev,
      {
        id,
        w: 3,
        h: 2,
        content: <StatWidget label={`Widget ${id}`} value={id} />,
      },
    ]);
  };

  const removeFirst = () => setWidgets((prev) => prev.slice(1));

  const addWidgetWithId = (id: string) => {
    setWidgets((prev) => [
      ...prev,
      {
        id,
        w: 3,
        h: 2,
        content: <StatWidget label={`Widget ${id}`} value={id} />,
      },
    ]);
  };

  const removeWidgetWithId = (id: string) => {
    setWidgets((prev) => {
      const newWidget = prev.filter((entry) => entry.id !== id);
      return newWidget;
    });
  };

  return (
    <div style={{ padding: 16, fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <button onClick={addWidget} style={btnStyle('#3b82f6')}>
          + Add Widget
        </button>
        <button onClick={removeFirst} style={btnStyle('#ef4444')}>
          − Remove First
        </button>
        <button
          onClick={() => addWidgetWithId('10')}
          style={btnStyle('#3b82f6')}
        >
          + Add Widget 10
        </button>
        <button
          onClick={() => removeWidgetWithId('10')}
          style={btnStyle('#ef4444')}
        >
          − Remove Widget 10
        </button>
      </div>

      <GridStackProvider
        options={{ column: 12, cellHeight: 80 }}
        onChange={handleChange}
      >
        <GridStack widgets={widgets} />
      </GridStackProvider>

      {log.length > 0 && (
        <div style={{ marginTop: 16, fontSize: 12, color: '#555' }}>
          <strong>onChange log:</strong>
          {log.map((entry, i) => (
            <div key={i}>{entry}</div>
          ))}
        </div>
      )}
    </div>
  );
}
