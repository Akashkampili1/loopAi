"use client"
import { useState, useEffect } from 'react';
import PageTitle from "@/components/PageTitle";
import Image from "next/image";
import { SquareKanban,DollarSign, Users, ShieldCheck, Activity } from "lucide-react";
import Card, { CardContent, CardProps } from "@/components/Card";
import BarChart from "@/components/BarChart";
import RecentVisitsCard, { RecentVisitsProps } from "@/components/RecentVisitsCard";

interface LogData {
  referenceID: string;
  query: string;
  attackType: string;
}

const Home = () => {
  const [cardData, setCardData] = useState<CardProps[]>([
    {
      label: "Total Requests",
      amount: "Loading...",
      discription: "Overall Requests made to the application",
      icon: SquareKanban
    },
    {
      label: "Legitimate Requests",
      amount: "Loading...",
      discription: "Safe Requests made to the application",
      icon: Users
    },
    {
      label: "Total Attacks Blocked",
      amount: "Loading...",
      discription: "Bad Request Blocked by the application",
      icon: ShieldCheck
    },
    {
      label: "Unique IPs",
      amount: "Loading...",
      discription: "Overall Unique IP visits",
      icon: Activity
    }
  ]);

  const [recentVisitsData, setrecentVisitsData] = useState([]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetching data for Total Requests
        const totalRequestsResponse = await fetch('http://localhost:5000/api/total-requests');
        const totalRequestsData = await totalRequestsResponse.json();
        setCardData(prevState => prevState.map(item => item.label === 'Total Requests' ? { ...item, amount: totalRequestsData.totalCount } : item));

        // Fetching data for Total Attacks Blocked
        const totalAttacksBlockedResponse = await fetch('http://localhost:5000/api/total-blocked-requests');
        const totalAttacksBlockedData = await totalAttacksBlockedResponse.json();
        setCardData(prevState => prevState.map(item => item.label === 'Total Attacks Blocked' ? { ...item, amount: totalAttacksBlockedData.totalCount } : item));

        // Fetching data for Safe visits
        const totalSafeVisits = await fetch('http://localhost:5000/api/safe-visits');
        const totalSafeVisitsData = await totalSafeVisits.json();
        setCardData(prevState => prevState.map(item => item.label === 'Legitimate Requests' ? { ...item, amount: totalSafeVisitsData.count } : item));

         // Fetching data for Safe visits
        const uniqueIps = await fetch('http://localhost:5000/api/total-unique-ips');
        const uniqueIpsData = await uniqueIps.json();
        setCardData(prevState => prevState.map(item => item.label === 'Unique IPs' ? { ...item, amount: uniqueIpsData.totalUniqueIPs } : item));
        

        const last5LogsResponse = await fetch('http://localhost:5000/api/last-5-logs');
        const apiData = await last5LogsResponse.json();
        console.log('apiData:', apiData); // Log apiData to see its contents and structure
        const mappedData = apiData.map((item: LogData) => ({
          referenceId: item.referenceID, // Changed from referenceID to referenceId
          Ip: item.query,
          AttackType: item.attackType
        }));
        
        setrecentVisitsData(mappedData);
        
        

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col gap-5 w-full">
      <PageTitle title="Dashboard" />
      <section className="grid w-full grid-cols-1 gap-4 gap-x-8 transition-all sm:grid-cols-2 xl:grid-cols-4">
        {cardData.map((d, i) => (
          <Card
            key={i}
            amount={d.amount}
            discription={d.discription}
            icon={d.icon}
            label={d.label}
          />
        ))}
      </section>
      <section className="grid grid-cols-1  gap-4 transition-all lg:grid-cols-2">
        <CardContent>
          <p className="p-4 font-semibold">Geographic Distribution of Attack</p>
          <BarChart />
        </CardContent>
        <CardContent className="flex justify-between gap-4">
          <section>
            <p>Recently Blocked Requests</p>
            <p className="text-sm text-gray-400">
              Last 5 Blocked Requests .
            </p>
          </section>
          {recentVisitsData.map((d, i) => (
            <RecentVisitsCard
            key={i}
            referenceId={d.referenceId} // Changed from referenceID to referenceId
            Ip={d.Ip}
            AttackType={d.AttackType}
            />

          ))}
        </CardContent>
      </section>
    </div>
  );
};

export default Home;
