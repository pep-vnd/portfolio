import { useRef, useState } from 'react';
import { ExternalLink, Shield, Wifi, AlertTriangle, Database, Lock, Activity } from 'lucide-react';
import type { Project } from '../../data/projects';
import styles from './ProjectCard.module.css';

const ICONS = {
  shield:   Shield,
  network:  Wifi,
  database: Database,
  lock:     Lock,
  alert:    AlertTriangle,
  activity: Activity,
};

interface Props {
  project: Project;
  index: number;
}

export default function ProjectCard({ project, index }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [spotlightPos, setSpotlightPos] = useState({ x: 50, y: 50 });
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const Icon = ICONS[project.icon];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setSpotlightPos({ x, y });

    // Tilt
    const tiltX = ((e.clientY - rect.top) / rect.height - 0.5) * -6;
    const tiltY = ((e.clientX - rect.left) / rect.width - 0.5) * 6;
    setTilt({ x: tiltX, y: tiltY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  };

  // Unique visual identity per project
  const accentRgb = hexToRgb(project.accentColor);

  return (
    <div
      ref={cardRef}
      className={`${styles.card} ${isHovered ? styles.hovered : ''}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        '--accent-r': accentRgb.r,
        '--accent-g': accentRgb.g,
        '--accent-b': accentRgb.b,
        '--accent-hex': project.accentColor,
        '--tilt-x': `${tilt.x}deg`,
        '--tilt-y': `${tilt.y}deg`,
        '--spot-x': `${spotlightPos.x}%`,
        '--spot-y': `${spotlightPos.y}%`,
        '--index': index,
      } as React.CSSProperties}
    >
      {/* Spotlight overlay */}
      <div className={styles.spotlight} aria-hidden="true" />

      {/* Border glow */}
      <div className={styles.borderGlow} aria-hidden="true" />

      {/* Card content */}
      <div className={styles.inner}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.iconWrap}>
            <Icon size={22} strokeWidth={1.5} />
          </div>
          <div className={styles.meta}>
            <span className={styles.category}>{project.category}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className={styles.title}>{project.title}</h3>
        <p className={styles.description}>{project.description}</p>

        {/* Metrics */}
        {project.metrics && (
          <div className={styles.metrics}>
            {project.metrics.map((m) => (
              <div key={m.label} className={styles.metric}>
                <span className={styles.metricValue}>{m.value}</span>
                <span className={styles.metricLabel}>{m.label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Highlights */}
        <ul className={styles.highlights}>
          {project.highlights.slice(0, 3).map((h, i) => (
            <li key={i} className={styles.highlight}>
              <span className={styles.bullet}>▸</span>
              {h}
            </li>
          ))}
        </ul>

        {/* Tags */}
        <div className={styles.tags}>
          {project.tags.map((tag) => (
            <span key={tag} className={styles.tag}>{tag}</span>
          ))}
        </div>

        {/* CTA */}
        <a
          href={project.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.cta}
          aria-label={`View ${project.title} on GitHub`}
        >
          <span>View on GitHub</span>
          <ExternalLink size={14} />
        </a>
      </div>
    </div>
  );
}

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}
