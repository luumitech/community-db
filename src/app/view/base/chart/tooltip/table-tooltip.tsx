import { cn } from '@heroui/react';
import React from 'react';

interface Props {
  className?: string;
  title?: React.ReactNode;
  rows?: React.ReactNode[][];
}

export const TableTooltip: React.FC<Props> = ({ className, title, rows }) => {
  if (!rows?.length) {
    return null;
  }
  const numCol = Math.max(...rows.map((row) => row.length));

  return (
    <div
      className={cn(
        className,
        'bg-white dark:bg-gray-800 text-xs rounded-sm p-2 shadow-md'
      )}
    >
      {!!title && title}
      <table>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((column, j) => (
                <td
                  key={j}
                  className="align-middle py-[3px] px-[5px] text-nowrap"
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
