export interface Certification {
  id: string;
  title: string;
  issuer: string;
  issuerShort: string;
  issued: string;
  credentialUrl?: string;
  color: string;
  icon: 'google' | 'ibm' | 'generic';
}

export const certifications: Certification[] = [
  {
    id: 'google-cybersecurity',
    title: 'Google Cybersecurity Professional Certificate',
    issuer: 'Google',
    issuerShort: 'Google',
    issued: 'July 2026',
    credentialUrl: undefined, // Add real Credly URL when available
    color: '#5EFFD8',
    icon: 'google',
  },
  {
    id: 'ibm-fundamentals',
    title: 'Cybersecurity Fundamentals',
    issuer: 'IBM',
    issuerShort: 'IBM',
    issued: 'March 2026',
    credentialUrl: undefined, // Add real Credly URL when available
    color: '#3B82F6',
    icon: 'ibm',
  },
];
