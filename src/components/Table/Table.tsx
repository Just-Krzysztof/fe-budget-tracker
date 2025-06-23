import React from 'react';
import type { Goal as ApiGoal } from '../../api/goals.api';

type Goal = ApiGoal & Record<string, unknown>;

// Interfejs dla definicji kolumny
export interface TableColumn<T> {
  key: keyof T; // Klucz, który odpowiada właściwości w obiekcie danych
  header: string; // Nagłówek wyświetlany w tabeli
  className?: string; // Dodatkowe klasy CSS dla nagłówka i komórek tej kolumny
  renderCell?: (item: T) => React.ReactNode; // Opcjonalna funkcja do niestandardowego renderowania komórki
}
interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  idKey?: keyof T;
}

// Komponent Table
function Table<T extends Record<string, unknown>>({
  columns,
  data,
  idKey,
}: TableProps<T>) {
  return (
    <div className="mt-10">
      <div className="overflow-auto">
        <div className="min-w-full shadow rounded-lg overflow">
          <table className="min-w-full leading-normal">
            <thead>
              <tr>
                {columns.map((column) => (
                  <th
                    key={String(column.key)}
                    className={`px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider ${column.className || ''}`}
                  >
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((item, rowIndex) => (
                <tr key={idKey ? String(item[idKey]) : rowIndex}>
                  {columns.map((column) => (
                    <td
                      key={String(column.key)}
                      className={`px-5 py-5 border-b border-gray-200 bg-white text-sm ${column.className || ''}`}
                    >
                      {column.renderCell
                        ? column.renderCell(item)
                        : (item[column.key] as React.ReactNode)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Table;
