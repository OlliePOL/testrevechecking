import React from 'react';
import { RevenueEntry } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface AccountViewProps {
  entries: RevenueEntry[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const AccountView: React.FC<AccountViewProps> = ({ entries }) => {
  const accountData = entries.reduce((acc, entry) => {
    const totalRevenue = Object.values(entry.monthlyRevenues).reduce(
      (sum, { estimated }) => sum + estimated,
      0
    );
    if (acc[entry.clientName]) {
      acc[entry.clientName] += totalRevenue;
    } else {
      acc[entry.clientName] = totalRevenue;
    }
    return acc;
  }, {} as { [key: string]: number });

  const chartData = Object.entries(accountData).map(([name, value]) => ({ name, value }));

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Revenue by Account</h2>
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={150}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `${value.toLocaleString('pl-PL', { style: 'currency', currency: 'PLN' })}`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AccountView;