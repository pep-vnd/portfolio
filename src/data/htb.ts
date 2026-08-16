export type HTBDifficulty = 'Easy' | 'Medium' | 'Hard' | 'Insane';
export type HTBStatus = 'Owned' | 'Completed' | 'In Progress';
export type HTBCategory =
  | 'Web'
  | 'Linux'
  | 'Windows'
  | 'Active Directory'
  | 'Network'
  | 'Forensics'
  | 'Reverse Engineering'
  | 'Crypto'
  | 'Misc';

export interface HTBMachine {
  id: string;
  name: string;
  difficulty: HTBDifficulty;
  os: 'Linux' | 'Windows' | 'Other';
  category: HTBCategory;
  skills: string[];
  date: string;
  writeupUrl?: string;
  status: HTBStatus;
}

// Empty array — add machines as you complete them
export const htbMachines: HTBMachine[] = [];
