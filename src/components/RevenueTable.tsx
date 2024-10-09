import React from 'react'
import { BudgetLine } from '../types'

interface RevenueTableProps {
  budgetLines: BudgetLine[]
}

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const RevenueTable: React.FC<RevenueTableProps> = ({ budgetLines }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="px-4 py-2 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Budget Line
            </th>
            {months.map((month) => (
              <th key={month} className="px-4 py-2 bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" colSpan={2}>
                {month}
              </th>
            ))}
          </tr>
          <tr>
            <th className="px-4 py-2 bg-gray-100"></th>
            {months.map((month) => (
              <React.Fragment key={month}>
                <th className="px-2 py-2 bg-gray-100 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Est</th>
                <th className="px-2 py-2 bg-gray-100 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Act</th>
              </React.Fragment>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {budgetLines.map((budgetLine) => (
            <tr key={budgetLine.id}>
              <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                {budgetLine.name}
              </td>
              {months.map((month) => {
                const revenue = budgetLine.revenues.find((r) => r.month === month) || { estimated: 0, actual: 0 }
                return (
                  <React.Fragment key={month}>
                    <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-500 text-right">
                      ${revenue.estimated.toLocaleString()}
                    </td>
                    <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-500 text-right">
                      ${revenue.actual.toLocaleString()}
                    </td>
                  </React.Fragment>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default RevenueTable