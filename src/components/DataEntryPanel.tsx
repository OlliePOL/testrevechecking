import React, { useState, useEffect } from 'react';
import { RevenueEntry, probabilityStages, salesTypes, projectTypes } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { getAccountsForUser } from '../utils/mockData';

interface DataEntryPanelProps {
  entries: RevenueEntry[];
  onAddEntry: (entry: RevenueEntry) => void;
  onUpdateEntry: (entry: RevenueEntry) => void;
  onDeleteEntry: (id: string) => void;
}

const DataEntryPanel: React.FC<DataEntryPanelProps> = ({ entries, onAddEntry, onUpdateEntry, onDeleteEntry }) => {
  const { user } = useAuth();
  const [selectedAccount, setSelectedAccount] = useState<string>('');
  const [accountEntries, setAccountEntries] = useState<RevenueEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<RevenueEntry | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [formData, setFormData] = useState<Partial<RevenueEntry>>({
    probability: 0.1,
    stage: 'Qualification',
    type: 'NB',
    bd: '',
    dl: '',
    pm: '',
    accountName: '',
    projectName: '',
    projectType: 'Opportunity',
    updateDate: new Date().toISOString().split('T')[0],
    monthlyRevenues: {},
  });

  const userAccounts = user ? getAccountsForUser(user.username, user.role, entries) : [];

  useEffect(() => {
    if (user?.role === 'admin') {
      setAccountEntries(entries);
    } else if (selectedAccount) {
      const filteredEntries = entries.filter(entry => entry.accountName === selectedAccount);
      setAccountEntries(filteredEntries);
    } else {
      setAccountEntries([]);
    }
  }, [selectedAccount, entries, user]);

  useEffect(() => {
    if (user && user.role !== 'admin') {
      setFormData(prev => ({ ...prev, dl: user.username }));
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'probability') {
      const stage = probabilityStages.find(s => s.value === parseFloat(value))?.label || '';
      setFormData(prev => ({ ...prev, [name]: parseFloat(value), stage }));
    } else if (name === 'accountName') {
      setSelectedAccount(value);
      setFormData(prev => ({ ...prev, [name]: value }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleMonthlyRevenueChange = (month: string, type: 'estimated' | 'actual', value: string) => {
    setFormData(prev => ({
      ...prev,
      monthlyRevenues: {
        ...prev.monthlyRevenues,
        [month]: {
          ...prev.monthlyRevenues?.[month],
          [type]: parseFloat(value) || 0
        }
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedEntry) {
      onUpdateEntry({ ...selectedEntry, ...formData } as RevenueEntry);
    } else {
      onAddEntry({
        id: Date.now().toString(),
        ...formData,
        accountName: selectedAccount || formData.accountName || '',
        monthlyRevenues: formData.monthlyRevenues || {},
      } as RevenueEntry);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      probability: 0.1,
      stage: 'Qualification',
      type: 'NB',
      bd: '',
      dl: user?.role === 'admin' ? '' : user?.username || '',
      pm: '',
      accountName: selectedAccount || '',
      projectName: '',
      projectType: 'Opportunity',
      updateDate: new Date().toISOString().split('T')[0],
      monthlyRevenues: {},
    });
    setSelectedEntry(null);
  };

  const handleSelectEntry = (entry: RevenueEntry) => {
    setSelectedEntry(entry);
    setFormData(entry);
    setSelectedAccount(entry.accountName);
  };

  const handleDeleteEntry = (id: string) => {
    onDeleteEntry(id);
    resetForm();
  };

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  if (!user) {
    return <div>Please log in to access the Data Entry Panel.</div>;
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Data Entry Panel</h2>
      
      {/* Account Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Account</label>
        <select
          value={selectedAccount}
          onChange={(e) => setSelectedAccount(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
          <option value="">All Accounts</option>
          {userAccounts.map(account => (
            <option key={account} value={account}>{account}</option>
          ))}
        </select>
      </div>

      {/* Entry List */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-700 mb-2">
          Entries for {selectedAccount || 'All Accounts'}
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project/Opportunity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stage</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Updated</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {accountEntries.map(entry => (
                <tr key={entry.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{entry.accountName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.projectName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.projectType}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.stage}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.updateDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleSelectEntry(entry)}
                      className="text-indigo-600 hover:text-indigo-900 mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteEntry(entry.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Entry Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Account Name</label>
            <input
              type="text"
              name="accountName"
              value={formData.accountName || ''}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Project/Opportunity Name</label>
            <input
              type="text"
              name="projectName"
              value={formData.projectName || ''}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Project Type</label>
            <select
              name="projectType"
              value={formData.projectType || ''}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              {projectTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Year</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              <option key="2024" value={2024}>2024</option>
              <option key="2025" value={2025}>2025</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Probability</label>
            <select
              name="probability"
              value={formData.probability || ''}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              {probabilityStages.map(stage => (
                <option key={stage.value} value={stage.value}>
                  {stage.probability} - {stage.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Type</label>
            <select
              name="type"
              value={formData.type || ''}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              {salesTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">BD</label>
            <input
              type="text"
              name="bd"
              value={formData.bd || ''}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">DL</label>
            <input
              type="text"
              name="dl"
              value={formData.dl || ''}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              readOnly={user.role !== 'admin'}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">PM</label>
            <input
              type="text"
              name="pm"
              value={formData.pm || ''}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Update Date</label>
            <input
              type="date"
              name="updateDate"
              value={formData.updateDate || ''}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">Monthly Revenues for {selectedYear}</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {months.map(month => (
              <div key={month} className="border p-2 rounded">
                <label className="block text-sm font-medium text-gray-700">{month}</label>
                <input
                  type="number"
                  placeholder="Estimated"
                  value={formData.monthlyRevenues?.[month]?.estimated || ''}
                  onChange={(e) => handleMonthlyRevenueChange(month, 'estimated', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
                <input
                  type="number"
                  placeholder="Actual"
                  value={formData.monthlyRevenues?.[month]?.actual || ''}
                  onChange={(e) => handleMonthlyRevenueChange(month, 'actual', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex justify-between">
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {selectedEntry ? 'Update Entry' : 'Add Entry'}
          </button>
          <button
            type="button"
            onClick={resetForm}
            className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Reset Form
          </button>
        </div>
      </form>
    </div>
  );
};

export default DataEntryPanel;