"use client";
import React, { useState, useEffect } from "react";
import {
  BarChart as BarGraph,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Bar,
  Tooltip
} from "recharts";

type Props = {};

export default function BarChart({}: Props) {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/documents-per-country")
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => console.error("Error fetching data:", error));
  }, []);

  return (
    <ResponsiveContainer width={"100%"} height={350}>
      <BarGraph data={data}>
        <XAxis
          dataKey={"_id"}
          tickLine={false}
          axisLine={false}
          stroke="#888888"
          fontSize={12}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          stroke="#888888"
          fontSize={12}
          ticks={[0, 3, 9,12, 18]}
        />
        <Tooltip />
        <Bar dataKey={"count"} fill="#000000" radius={[4, 4, 0, 0]} />
      </BarGraph>
    </ResponsiveContainer>
  );
}
