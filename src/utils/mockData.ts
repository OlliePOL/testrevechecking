import { RevenueEntry, probabilityStages, salesTypes, projectTypes } from '../types';

const DLs = ['Alice Johnson', 'Bob Smith', 'Charlie Brown', 'Diana Martinez', 'Ethan Lee'];

const generateRandomRevenue = () => {
  return Math.floor(Math.random() * 1000000) + 100000; // Random number between 100,000 and 1,100,000
};

const generateMonthlyRevenues = () => {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const revenues: { [key: string]: { estimated: number; actual: number } } = {};

  months.forEach(month => {
    revenues[month] = {
      estimated: generateRandomRevenue(),
      actual: generateRandomRevenue()
    };
  });

  return revenues;
};

const generateMockEntry = (dl: string, accountName: string, projectName: string): RevenueEntry => {
  const randomProbabilityStage = probabilityStages[Math.floor(Math.random() * probabilityStages.length)];
  const randomSalesType = salesTypes[Math.floor(Math.random() * salesTypes.length)];
  const randomProjectType = projectTypes[Math.floor(Math.random() * projectTypes.length)];

  return {
    id: Math.random().toString(36).substr(2, 9),
    probability: randomProbabilityStage.value,
    stage: randomProbabilityStage.label,
    type: randomSalesType.value,
    bd: `BD_${Math.floor(Math.random() * 5) + 1}`,
    dl: dl,
    pm: `PM_${Math.floor(Math.random() * 5) + 1}`,
    accountName: accountName,
    projectName: projectName,
    projectType: randomProjectType,
    updateDate: new Date().toISOString().split('T')[0],
    monthlyRevenues: generateMonthlyRevenues()
  };
};

export const generateMockData = (): RevenueEntry[] => {
  const mockData: RevenueEntry[] = [];

  DLs.forEach(dl => {
    for (let i = 1; i <= 10; i++) {
      const accountName = `Account_${dl.split(' ')[0]}_${i}`;
      const projectName = `Project_${dl.split(' ')[0]}_${i}`;
      mockData.push(generateMockEntry(dl, accountName, projectName));
    }
  });

  return mockData;
};

export const createMockUsers = () => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  
  if (!users.some((u: any) => u.username === 'admin')) {
    users.push({
      username: 'admin',
      password: 'admin123',
      role: 'admin'
    });
  }

  DLs.forEach(dl => {
    const username = dl.toLowerCase().replace(' ', '');
    if (!users.some((u: any) => u.username === username)) {
      users.push({
        username: username,
        password: 'password123',
        role: 'user'
      });
    }
  });

  localStorage.setItem('users', JSON.stringify(users));
};

export const getAccountsForUser = (username: string, role: string, entries: RevenueEntry[]): string[] => {
  if (role === 'admin') {
    return [...new Set(entries.map(entry => entry.accountName))];
  }
  return [...new Set(entries.filter(entry => entry.dl.toLowerCase().replace(' ', '') === username).map(entry => entry.accountName))];
};