import React, { useState, useEffect } from 'react'
import { BarChart3 } from 'lucide-react'
import { Account, RevenueData } from '../types'

interface RevenueChartProps {
  account: Account
}

const RevenueChart: React.FC<RevenueChartProps> = ({ account }) => {
  const [revenueData, setRevenueData] = useState<RevenueData[]>([])

  useEffect(() => {
    // Simulating API call to fetch revenue data
    const fetchRevenueData = () => {
      const mockData: RevenueData[] = [
        { month: 'Jan', estimated: 10000, actual: 9500 },
        { month: 'Feb', estimated: 12000, actual: 11800 },
        { month: 'Mar', estimated: 15000, actual: 15200 },
        { month: 'Apr', estimated: 13000, actual: 12900 },
        { month: 'May', estimated: 14000, actual: 14500 },
        { month: 'Jun', estimated: 16000, actual: 15800 },
      ]
      setRevenueData(mockData)
    }

    fetchRevenueData()
  }, [account])

  const maxRevenue = Math.max(...revenueData.flatMap(d => [d.estimated, d.actual]))

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Revenue Overview: {account.name}</h2>
      <div className="flex flex-col space-y-2">
        {revenueData.map((data) => (
          <div key={data.month} className="flex items-center">
            <span className="w-10 text-sm text-gray-500">{data.month}</span>
            <div className="flex-1 ml-4">
              <div className="h-6 flex items-center">
                <div
                  className="bg-blue-500 h-4"
                  style={{ width: `${(data.estimated / maxRevenue) * 100}%` }}
                ></div>
                <span className="ml-2 text-sm text-gray-600">${data.estimated.toLocaleString()}</span>
              </div>
              <div className="h-6 flex items-center mt-1">
                <div
                  className="bg-green-500 h-4"
                  style={{ width: `${(data.actual / maxRevenue) * 100}%` }}
                ></div>
                <span className="ml-2 text-sm text-gray-600">${data.actual.toLocaleString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center text-sm text-gray-500">
        <BarChart3 className="h-4 w-4 mr-1" />
        <span className="mr-4">Estimated</span>
        <div className="w-4 h-4 bg-blue-500 mr-1"></div>
        <span className="mr-4">Actual</span>
        <div className="w-4 h-4 bg-green-500 mr-1"></div>
      </div>
    </div>
  )
}

export default RevenueChart