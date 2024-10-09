import React, { useState, useMemo } from 'react';
import { RevenueEntry, probabilityStages, salesTypes } from '../types';
import { Edit2, ChevronDown, Trash2 } from 'lucide-react';

interface AggregatedRevenueTableProps {
  entries: RevenueEntry[];
  onUpdateEntry: (updatedEntry: RevenueEntry) => void;
  onDeleteEntry: (id: string) => void;
}

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const AggregatedRevenueTable: React.FC<AggregatedRevenueTableProps> = ({ entries, onUpdateEntry, onDeleteEntry }) => {
  const [editingCell, setEditingCell] = useState<{ id: string; field: string } | null>(null);

  const calculateTotals = (entry: RevenueEntry) => {
    let totalEst = 0;
    let totalAct = 0;
    let totalWeighted = 0;

    months.forEach((month, index) => {
      const { estimated, actual } = entry.monthlyRevenues[month] || { estimated: 0, actual: 0 };
      totalEst += estimated;
      totalAct += actual;

      // Calculate weighted value based on the current month and available data
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      
      if (index <= currentMonth) {
        // For past and current months, use actual if available, otherwise use estimated
        totalWeighted += (actual || estimated) * entry.probability;
      } else {
        // For future months, always use estimated
        totalWeighted += estimated * entry.probability;
      }
    });

    return { totalEst, totalAct, totalWeighted };
  };

  const grandTotals = useMemo(() => {
    return entries.reduce((acc, entry) => {
      const { totalEst, totalAct, totalWeighted } = calculateTotals(entry);
      acc.grandTotalEst += totalEst;
      acc.grandTotalAct += totalAct;
      acc.grandTotalWeighted += totalWeighted;
      return acc;
    }, { grandTotalEst: 0, grandTotalAct: 0, grandTotalWeighted: 0 });
  }, [entries]);

  const handleCellEdit = (entry: RevenueEntry, field: string, value: string) => {
    const updatedEntry = { ...entry };
    if (field.includes('monthlyRevenues')) {
      const [, month, type] = field.split('.');
      updatedEntry.monthlyRevenues[month] = {
        ...updatedEntry.monthlyRevenues[month],
        [type]: parseFloat(value) || 0
      };
    } else if (field === 'probability') {
      const newProbability = parseFloat(value);
      updatedEntry.probability = newProbability;
      const newStage = probabilityStages.find(stage => stage.value === newProbability);
      if (newStage) {
        updatedEntry.stage = newStage.label;
      }
    } else if (field === 'type') {
      updatedEntry.type = value;
    } else {
      (updatedEntry as any)[field] = value;
    }
    onUpdateEntry(updatedEntry);
    setEditingCell(null);
  };

  const getProbabilityColor = (probability: number) => {
    const stage = probabilityStages.find(s => s.value === probability);
    return stage ? stage.color : 'bg-gray-200';
  };

  return (
    <div className="overflow-x-auto shadow-md rounded-lg">
      <table className="min-w-full bg-white text-sm">
        <thead className="bg-gray-100 text-gray-600 uppercase">
          <tr>
            <th className="sticky top-0 left-0 z-10 px-3 py-3 text-left font-semibold">Probability</th>
            <th className="sticky top-0 left-0 z-10 px-3 py-3 text-left font-semibold">Stage</th>
            <th className="sticky top-0 left-0 z-10 px-3 py-3 text-left font-semibold">Type</th>
            <th className="sticky top-0 left-0 z-10 px-3 py-3 text-left font-semibold">BD</th>
            <th className="sticky top-0 left-0 z-10 px-3 py-3 text-left font-semibold">DL</th>
            <th className="sticky top-0 left-0 z-10 px-3 py-3 text-left font-semibold">PM</th>
            <th className="sticky top-0 left-0 z-10 px-3 py-3 text-left font-semibold">Account Name</th>
            <th className="sticky top-0 left-0 z-10 px-3 py-3 text-left font-semibold">Project / Op Name</th>
            <th className="sticky top-0 left-0 z-10 px-3 py-3 text-left font-semibold">Project Type</th>
            <th className="sticky top-0 left-0 z-10 px-3 py-3 text-left font-semibold">Update Date</th>
            {months.map(month => (
              <th key={month} className="px-3 py-3 text-center font-semibold" colSpan={2}>
                {month}
                <ChevronDown className="inline-block ml-1 h-4 w-4" />
              </th>
            ))}
            <th className="px-3 py-3 text-center font-semibold" colSpan={3}>TOTAL</th>
            <th className="px-3 py-3 text-center font-semibold">Actions</th>
          </tr>
          <tr className="bg-gray-50">
            <th colSpan={10}></th>
            {months.map(month => (
              <React.Fragment key={month}>
                <th className="px-3 py-2 text-center font-medium text-gray-500">Est</th>
                <th className="px-3 py-2 text-center font-medium text-gray-500">Act</th>
              </React.Fragment>
            ))}
            <th className="px-3 py-2 text-center font-medium text-gray-500">EST</th>
            <th className="px-3 py-2 text-center font-medium text-gray-500">ACT</th>
            <th className="px-3 py-2 text-center font-medium text-gray-500">WEIGHTED</th>
            <th></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {entries.map((entry) => {
            const { totalEst, totalAct, totalWeighted } = calculateTotals(entry);
            const probabilityColor = getProbabilityColor(entry.probability);
            return (
              <tr key={entry.id} className="hover:bg-gray-50 transition-colors duration-150">
                <td className="px-3 py-2 whitespace-nowrap">
                  {editingCell?.id === entry.id && editingCell?.field === 'probability' ? (
                    <select
                      value={entry.probability}
                      onChange={(e) => handleCellEdit(entry, 'probability', e.target.value)}
                      onBlur={() => setEditingCell(null)}
                      autoFocus
                      className="w-full border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {probabilityStages.map((stage) => (
                        <option key={stage.value} value={stage.value}>
                          {stage.probability} - {stage.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span
                      onClick={() => setEditingCell({ id: entry.id, field: 'probability' })}
                      className={`cursor-pointer flex items-center justify-center rounded-full w-10 h-10 ${probabilityColor} text-white font-bold`}title={`${(entry.probability * 100).toFixed(0)}% - ${entry.stage}`}
                    >
                      {(entry.probability * 100).toFixed(0)}%
                    </span>
                  )}
                </td>
                <td className={`px-3 py-2 whitespace-nowrap ${probabilityColor} text-white font-semibold`}>{entry.stage}</td>
                <td className="px-3 py-2 whitespace-nowrap">
                  {editingCell?.id === entry.id && editingCell?.field === 'type' ? (
                    <select
                      value={entry.type}
                      onChange={(e) => handleCellEdit(entry, 'type', e.target.value)}
                      onBlur={() => setEditingCell(null)}
                      autoFocus
                      className="w-full border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {salesTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.value}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span
                      onClick={() => setEditingCell({ id: entry.id, field: 'type' })}
                      className="cursor-pointer flex items-center"
                      title={salesTypes.find(t => t.value === entry.type)?.label}
                    >
                      {entry.type}
                      <Edit2 className="ml-1 h-4 w-4 text-gray-400" />
                    </span>
                  )}
                </td>
                <td className="px-3 py-2 whitespace-nowrap">{entry.bd}</td>
                <td className="px-3 py-2 whitespace-nowrap">{entry.dl}</td>
                <td className="px-3 py-2 whitespace-nowrap">{entry.pm}</td>
                <td className="px-3 py-2 whitespace-nowrap">{entry.accountName}</td>
                <td className="px-3 py-2 whitespace-nowrap">{entry.projectName}</td>
                <td className="px-3 py-2 whitespace-nowrap">{entry.projectType}</td>
                <td className="px-3 py-2 whitespace-nowrap">{entry.updateDate}</td>
                {months.map(month => (
                  <React.Fragment key={month}>
                    {['estimated', 'actual'].map((type) => (
                      <td key={`${month}-${type}`} className="px-3 py-2 text-right whitespace-nowrap">
                        {editingCell?.id === entry.id && editingCell?.field === `monthlyRevenues.${month}.${type}` ? (
                          <input
                            type="number"
                            defaultValue={entry.monthlyRevenues[month]?.[type as 'estimated' | 'actual']}
                            onBlur={(e) => handleCellEdit(entry, `monthlyRevenues.${month}.${type}`, e.target.value)}
                            autoFocus
                            className="w-full text-right border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        ) : (
                          <span
                            onClick={() => setEditingCell({ id: entry.id, field: `monthlyRevenues.${month}.${type}` })}
                            className="cursor-pointer flex items-center justify-end"
                          >
                            {(entry.monthlyRevenues[month]?.[type as 'estimated' | 'actual'] || 0).toLocaleString('pl-PL', { style: 'currency', currency: 'PLN' })}
                            <Edit2 className="ml-1 h-4 w-4 text-gray-400" />
                          </span>
                        )}
                      </td>
                    ))}
                  </React.Fragment>
                ))}
                <td className="px-3 py-2 text-right font-medium whitespace-nowrap">{totalEst.toLocaleString('pl-PL', { style: 'currency', currency: 'PLN' })}</td>
                <td className="px-3 py-2 text-right font-medium whitespace-nowrap">{totalAct.toLocaleString('pl-PL', { style: 'currency', currency: 'PLN' })}</td>
                <td className="px-3 py-2 text-right font-medium whitespace-nowrap">{totalWeighted.toLocaleString('pl-PL', { style: 'currency', currency: 'PLN' })}</td>
                <td className="px-3 py-2 whitespace-nowrap">
                  <button
                    onClick={() => onDeleteEntry(entry.id)}
                    className="text-red-600 hover:text-red-900"
                    title="Delete entry"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot className="bg-gray-100 font-semibold">
          <tr>
            <td colSpan={10} className="px-3 py-2 text-right">Grand Total:</td>
            {months.map(month => (
              <React.Fragment key={month}>
                <td className="px-3 py-2 text-right whitespace-nowrap">
                  {entries.reduce((sum, entry) => sum + (entry.monthlyRevenues[month]?.estimated || 0), 0).toLocaleString('pl-PL', { style: 'currency', currency: 'PLN' })}
                </td>
                <td className="px-3 py-2 text-right whitespace-nowrap">
                  {entries.reduce((sum, entry) => sum + (entry.monthlyRevenues[month]?.actual || 0), 0).toLocaleString('pl-PL', { style: 'currency', currency: 'PLN' })}
                </td>
              </React.Fragment>
            ))}
            <td className="px-3 py-2 text-right whitespace-nowrap">{grandTotals.grandTotalEst.toLocaleString('pl-PL', { style: 'currency', currency: 'PLN' })}</td>
            <td className="px-3 py-2 text-right whitespace-nowrap">{grandTotals.grandTotalAct.toLocaleString('pl-PL', { style: 'currency', currency: 'PLN' })}</td>
            <td className="px-3 py-2 text-right whitespace-nowrap">{grandTotals.grandTotalWeighted.toLocaleString('pl-PL', { style: 'currency', currency: 'PLN' })}</td>
            <td></td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default AggregatedRevenueTable;