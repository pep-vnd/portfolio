export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  longDescription: string;
  tags: string[];
  highlights: string[];
  githubUrl: string;
  accentColor: string;
  icon: 'shield' | 'network' | 'database' | 'lock' | 'alert' | 'activity';
  metrics?: { label: string; value: string }[];
}

export const projects: Project[] = [
  {
    id: 'botium-toys',
    title: 'Botium Toys',
    category: 'Internal Security Audit',
    description:
      'Internal security audit for a fictional international toy company — risk scoring, control assessment and compliance mapping.',
    longDescription:
      'Comprehensive security audit covering administrative, technical and physical controls. Identified critical security gaps and evaluated compliance against international standards including NIST CSF, PCI DSS and GDPR. Delivered actionable mitigation recommendations.',
    tags: ['NIST CSF', 'PCI DSS', 'GDPR', 'Risk Assessment', 'Security Controls'],
    highlights: [
      'Administrative, technical & physical control assessment',
      'Security gap identification across all domains',
      'NIST Cybersecurity Framework evaluation',
      'PCI DSS & GDPR compliance analysis',
      'Recommendations: encryption, DR, access control',
    ],
    githubUrl: 'https://github.com/pep-vnd/Security-Audits',
    accentColor: '#5EFFD8',
    icon: 'shield',
    metrics: [
      { label: 'Risk Score', value: '8/10' },
      { label: 'Frameworks', value: '3' },
      { label: 'Controls', value: 'Full' },
    ],
  },
  {
    id: 'multimedia-dos',
    title: 'Multimedia Co.',
    category: 'DoS Incident Analysis',
    description:
      'Incident response and mitigation analysis for an ICMP Flood denial-of-service attack targeting a multimedia company.',
    longDescription:
      'Deep dive into a live DoS event using the NIST Incident Response lifecycle. Analyzed ICMP flood behavior, recommended firewall rule changes, IDS/IPS integration and drafted a structured recovery and mitigation plan.',
    tags: ['Incident Response', 'ICMP Flood', 'Firewall', 'IDS/IPS', 'NIST CSF'],
    highlights: [
      'Network protocol-level attack analysis',
      'ICMP flood behavior identification',
      'Firewall configuration hardening',
      'IDS/IPS implementation roadmap',
      'Recovery & mitigation planning',
    ],
    githubUrl: 'https://github.com/pep-vnd/Security-Audits',
    accentColor: '#3B82F6',
    icon: 'network',
    metrics: [
      { label: 'Attack Type', value: 'ICMP' },
      { label: 'Phase', value: 'IR' },
      { label: 'Scope', value: 'Network' },
    ],
  },
  {
    id: 'healthcare-ransomware',
    title: 'Healthcare Ransomware',
    category: 'Incident Handler Journal',
    description:
      'Structured incident-response journal documenting the initial triage of a ransomware attack initiated through phishing.',
    longDescription:
      'Forensic-grade documentation of a ransomware incident following the 5W methodology. Covers initial triage, attack-vector identification, business impact assessment, containment strategy and technical documentation for forensic investigation.',
    tags: ['Ransomware', 'Phishing', 'Incident Response', '5W Methodology', 'Impact Analysis'],
    highlights: [
      'Initial incident triage & 5W analysis',
      'Phishing and social-engineering vectors',
      'Business-impact assessment',
      'Containment & recovery analysis',
      'Forensic documentation standards',
    ],
    githubUrl: 'https://github.com/pep-vnd/Security-Audits',
    accentColor: '#F97316',
    icon: 'alert',
    metrics: [
      { label: 'Vector', value: 'Phishing' },
      { label: 'Method', value: '5W' },
      { label: 'Sector', value: 'Health' },
    ],
  },
];
