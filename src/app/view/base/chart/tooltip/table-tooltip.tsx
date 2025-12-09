import React from 'react';
import { twMerge } from 'tailwind-merge';

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
      className={twMerge(
        'rounded-xs p-2 text-xs shadow-md',
        'bg-white dark:bg-gray-800',
        className
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
                  className="text-nowrap px-[5px] py-[3px] align-middle"
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
