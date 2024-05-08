"use client"
import React, { useRef } from 'react';
import { useState, useEffect } from 'react';
import { DataTable } from '@/components/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import PageTitle from '@/components/PageTitle';
import axios from 'axios'; // Import Axios for making HTTP requests
import html2pdf from 'html2pdf.js';
import { cn } from '@/lib/utils';

type Props = {};

type MonitorLog = {
  method: string;
  path: string;
  prediction: string;
  ip: string;
  statusCode: number;
  createdAt: string;
};

const columns: ColumnDef<MonitorLog>[] = [
  {
    accessorKey: 'sNo',
    header: 'S.No',
  },
  {
    accessorKey: 'method',
    header: 'Method',
  },
  {
    accessorKey: 'path',
    header: 'Path',
  },
  {
    accessorKey: 'prediction',
    header: 'Prediction',
    cell: ({ row }) => {
        const prediction = row.getValue("prediction");
        const isGoodSequential = prediction.toLowerCase().includes("good");
    
        return (
          <div
            className={cn("font-medium w-fit px-4 py-2 rounded-lg", {
              "bg-green-200": isGoodSequential,
              "bg-red-200": !isGoodSequential
            })}
          >
            {prediction}
          </div>
        );
      }
  },
  {
    accessorKey: 'ip',
    header: 'IP Address',
  },
  {
    accessorKey: 'statusCode',
    header: 'Status Code',
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
  },
];

export default function UsersPage({}: Props) {
  const [monitorLogs, setMonitorLogs] = useState<MonitorLog[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const contentRef = useRef(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get('http://localhost:5000/api/monitor-logs');
        // Add serial numbers to each log
        const logsWithSNo = response.data.map((log: MonitorLog, index: number) => ({
          ...log,
          sNo: index + 1, // Serial number starts from 1
          prediction: log.prediction.split(' ').slice(1).join(' ').toUpperCase() // Extract prediction without leading 0 and in uppercase
        }));

        setMonitorLogs(logsWithSNo);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, []);

  const exportToPDF = () => {
    const opt = {
      margin:       1,
      filename:     'MonitorLogs.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    // Generate PDF
    html2pdf().from(contentRef.current).set(opt).save();
  };

  const filteredLogs = monitorLogs.filter(log => {
    const isMatchingSearch = Object.values(log).some(value =>
      typeof value === 'string' && value.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return isMatchingSearch;
  });

  return (
    <div ref={contentRef} className="flex flex-col gap-5 w-full">
      <PageTitle title="Monitor Logs" />
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="font">Filter and search the data.</h2>
          <div className="space-y-2 mt-4">
            <label htmlFor="search" className="font-bold">Search</label>
            <input
              id="search"
              type="text"
              className="border border-gray-300 rounded px-3 py-2 w-full"
              placeholder="Search data..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <button onClick={exportToPDF} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Export to PDF</button>
      </div>
      <DataTable columns={columns} data={filteredLogs} />
    </div>
  );
}
