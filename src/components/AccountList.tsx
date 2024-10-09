import React from 'react'
import { Account } from '../types'

interface AccountListProps {
  accounts: Account[]
  selectedAccount: Account | null
  onSelectAccount: (account: Account) => void
}

const AccountList: React.FC<AccountListProps> = ({ accounts, selectedAccount, onSelectAccount }) => {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <h2 className="text-lg font-semibold p-4 bg-gray-50 border-b">Accounts</h2>
      <ul className="divide-y divide-gray-200">
        {accounts.map((account) => (
          <li
            key={account.id}
            className={`cursor-pointer hover:bg-gray-50 ${
              selectedAccount?.id === account.id ? 'bg-blue-50' : ''
            }`}
            onClick={() => onSelectAccount(account)}
          >
            <div className="px-4 py-3">
              <p className="text-sm font-medium text-gray-900">{account.name}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default AccountList