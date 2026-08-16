import { skillClusters } from '../../data/skills';
import { useInView } from '../../hooks/useInView';
import styles from './Skills.module.css';

export default function Skills() {
  const [ref, inView] = useInView(0.05);

  return (
    <section id="skills" className="section">
      <div className="container">
        <div className="section-label">Technical Profile</div>
        <h2 className="section-title">
          Skills &amp; <span className="accent">Competencies</span>
        </h2>
        <p className="section-subtitle">
          Grouped by domain — no artificial percentage bars.
        </p>

        <div ref={ref} className={`${styles.grid} ${inView ? styles.visible : ''}`}>
          {skillClusters.map((cluster, ci) => {
            const r = parseInt(cluster.color.slice(1, 3), 16);
            const g = parseInt(cluster.color.slice(3, 5), 16);
            const b = parseInt(cluster.color.slice(5, 7), 16);
            return (
              <div
                key={cluster.id}
                className={styles.cluster}
                style={{
                  '--cluster-r': r,
                  '--cluster-g': g,
                  '--cluster-b': b,
                  '--cluster-color': cluster.color,
                  '--ci': ci,
                } as React.CSSProperties}
              >
                <div className={styles.clusterHeader}>
                  <span className={styles.clusterNum}>{cluster.number}</span>
                  <h3 className={styles.clusterLabel}>{cluster.label}</h3>
                </div>
                <div className={styles.tags}>
                  {cluster.skills.map((skill) => (
                    <span key={skill} className={styles.tag}>{skill}</span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
