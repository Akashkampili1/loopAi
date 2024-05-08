"use client"
import React, { useRef } from 'react';
import { useState, useEffect } from 'react';
import { DataTable } from '@/components/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import PageTitle from '@/components/PageTitle';
import axios from 'axios'; // Import Axios for making HTTP requests
import html2pdf from 'html2pdf.js';

type Props = {};

type BlockedLog = {
  _id: string;
  referenceID: string;
  query: string; // Include the query field (IP address)
  country: string;
  regionName: string;
  city: string;
  lat: number;
  lon: number;
  attackType: string;
  org: string;
};

const columns: ColumnDef<BlockedLog>[] = [
  {
    accessorKey: 'referenceID',
    header: 'Reference ID',
  },
  {
    accessorKey: 'query', // Display the query field (IP address)
    header: 'IP Address',
  },
  {
    accessorKey: 'country',
    header: 'Country',
  },
  {
    accessorKey: 'regionName',
    header: 'Region',
  },
  {
    accessorKey: 'city',
    header: 'City',
  },
  {
    accessorKey: 'lat',
    header: 'Latitude',
  },
  {
    accessorKey: 'lon',
    header: 'Longitude',
  },
  {
    accessorKey: 'org',
    header: 'Organization',
  },
  {
    accessorKey: 'attackType',
    header: 'Attack Type',
  },
];

export default function UsersPage({}: Props) {
  const [blockedLogs, setBlockedLogs] = useState<BlockedLog[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterValue, setFilterValue] = useState('');
  const contentRef = useRef(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get('http://localhost:5000/api/blocked-logs');
        setBlockedLogs(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, []); // Empty dependency array means this effect will only run once, equivalent to componentDidMount

  const filteredLogs = blockedLogs.filter(log => {
    const isMatchingSearch = Object.values(log).some(value =>
      typeof value === 'string' && value.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const isMatchingFilter = !filterValue || log.org.toLowerCase() === filterValue.toLowerCase() || log.country.toLowerCase() === filterValue.toLowerCase();

    return isMatchingSearch && isMatchingFilter;
  });

  const exportToPDF = () => {
    const opt = {
      margin:       1,
      filename:     'BlockedLogs.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    // Generate PDF
    html2pdf().from(contentRef.current).set(opt).save();
  };

  return (
    <div ref={contentRef} className="flex flex-col gap-5 w-full">
      <PageTitle title="Blocked Logs" />
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="font">Filter, sort, and search the data.</h2>
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
