import { useTheme } from '@nivo/core';
import React from 'react';

interface Props {
  className?: string;
  title?: React.ReactNode;
  rows?: React.ReactNode[][];
}

export const TableTooltip: React.FC<Props> = ({ className, title, rows }) => {
  const theme = useTheme();

  if (!rows?.length) {
    return null;
  }
  const numCol = Math.max(...rows.map((row) => row.length));

  return (
    <div className={className} style={theme.tooltip.container}>
      {!!title && title}
      <table style={theme.tooltip.table}>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((column, j) => (
                <td
                  key={j}
                  className="align-middle"
                  style={theme.tooltip.tableCell}
                  colSpan={j === row.length - 1 ? numCol - j : 1}
                >
                  {column}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
