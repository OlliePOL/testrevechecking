import React from 'react';
import { RevenueEntry } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface PMViewProps {
  entries: RevenueEntry[];
}

const PMView: React.FC<PMViewProps> = ({ entries }) => {
  const pmData = entries.reduce((acc, entry) => {
    const totalRevenue = Object.values(entry.monthlyRevenues).reduce(
      (sum, { estimated }) => sum + estimated,
      0
    );
    if (acc[entry.pm]) {
      acc[entry.pm] += totalRevenue;
    } else {
      acc[entry.pm] = totalRevenue;
    }
    return acc;
  }, {} as { [key: string]: number });

  const chartData = Object.entries(pmData).map(([name, value]) => ({ name, value }));

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Revenue by Project Manager</h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip formatter={(value: number) => `${value.toLocaleString('pl-PL', { style: 'currency', currency: 'PLN' })}`} />
          <Legend />
          <Bar dataKey="value" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PMView;