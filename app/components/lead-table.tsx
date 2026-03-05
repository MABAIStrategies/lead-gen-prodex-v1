'use client';

import { useMemo, useState } from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable
} from '@tanstack/react-table';

type Row = {
  company: string;
  decisionMaker: string;
  title: string;
  email: string;
  confidence: string;
  source: string;
  industry?: string;
  status?: string;
};

const columnHelper = createColumnHelper<Row>();

export function LeadTable({ rows }: { rows: Row[] }) {
  const [globalFilter, setGlobalFilter] = useState('');

  const columns = useMemo(
    () => [
      columnHelper.accessor('company', { header: 'Company' }),
      columnHelper.accessor('decisionMaker', { header: 'Decision Maker' }),
      columnHelper.accessor('title', { header: 'Title' }),
      columnHelper.accessor('email', { header: 'Email' }),
      columnHelper.accessor('confidence', {
        header: 'Confidence',
        cell: (info) => (
          <span className="rounded-full bg-mab-gold/20 px-3 py-1 text-xs text-mab-gold">{info.getValue()}</span>
        )
      }),
      columnHelper.accessor('source', { header: 'Source' })
    ],
    []
  );

  const table = useReactTable({
    data: rows,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel()
  });

  return (
    <div className="glass rounded-xl p-4">
      <input
        value={globalFilter}
        onChange={(e) => setGlobalFilter(e.target.value)}
        placeholder="Filter by company, contact, title..."
        className="mb-4 w-full rounded border border-mab-gold/30 bg-transparent px-3 py-2"
      />
      <div className="max-h-[420px] overflow-auto">
        <table className="w-full text-left text-sm">
          <thead className="sticky top-0 bg-mab-slate">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-3 py-2 text-mab-offWhite/80">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-b border-mab-gold/10 hover:bg-mab-slate/40">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-3 py-3">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
