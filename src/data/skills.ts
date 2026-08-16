export interface SkillCluster {
  id: string;
  label: string;
  number: string;
  skills: string[];
  color: string;
}

export const skillClusters: SkillCluster[] = [
  {
    id: 'frameworks',
    label: 'Security Frameworks',
    number: '01',
    skills: [
      'NIST Cybersecurity Framework',
      'NIST SP 800-53',
      'OWASP Principles',
      'CIA Triad',
    ],
    color: '#5EFFD8',
  },
  {
    id: 'compliance',
    label: 'Compliance & Risk',
    number: '02',
    skills: [
      'PCI DSS',
      'GDPR',
      'Risk Assessment',
      'Security Controls',
    ],
    color: '#3B82F6',
  },
  {
    id: 'incident',
    label: 'Incident & Network Security',
    number: '03',
    skills: [
      'Incident Response',
      'Phishing Analysis',
      'Ransomware Analysis',
      'Network Security',
      'Firewall',
      'IDS/IPS',
      'Protocol Analysis',
    ],
    color: '#F97316',
  },
  {
    id: 'management',
    label: 'Management & Delivery',
    number: '04',
    skills: [
      'Agile Project Management',
      'Project Leadership',
      'Technical Documentation',
    ],
    color: '#A78BFA',
  },
];
