export interface RevenueEntry {
  id: string;
  probability: number;
  stage: string;
  type: string;
  bd: string;
  dl: string;
  pm: string;
  accountName: string;
  projectName: string;
  projectType: 'Project' | 'Opportunity';
  updateDate: string;
  monthlyRevenues: {
    [key: string]: {
      estimated: number;
      actual: number;
    };
  };
}

export interface FilterOptions {
  stage: string;
  type: string;
  bd: string;
  dl: string;
  pm: string;
  accountName: string;
  projectType: string;
}

export const probabilityStages = [
  { value: 0, label: "Lost", probability: "0%", color: "bg-red-500" },
  { value: 0.05, label: "Non-Active", probability: "5%", color: "bg-red-300" },
  { value: 0.1, label: "Qualification", probability: "10%", color: "bg-orange-500" },
  { value: 0.25, label: "Estimation", probability: "25%", color: "bg-orange-300" },
  { value: 0.5, label: "Proposal", probability: "50%", color: "bg-yellow-500" },
  { value: 0.75, label: "Negotiation", probability: "75%", color: "bg-yellow-300" },
  { value: 0.9, label: "Legal", probability: "90%", color: "bg-green-300" },
  { value: 0.95, label: "Signed contract", probability: "95%", color: "bg-green-500" },
  { value: 1, label: "Won", probability: "100%", color: "bg-green-700" },
];

export const salesTypes = [
  { value: "NB", label: "New Business / Opportunity" },
  { value: "EB", label: "Existing Business" },
  { value: "EB PR", label: "EB Prolongation" },
  { value: "EB UP", label: "EB Upsell" },
  { value: "EB PT", label: "EB Potential" },
];

export const projectTypes = ['Project', 'Opportunity'] as const;