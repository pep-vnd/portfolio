import ProjectCard from '../../components/ProjectCard/ProjectCard';
import { projects } from '../../data/projects';
import { useInView } from '../../hooks/useInView';
import styles from './Projects.module.css';

export default function Projects() {
  const [ref, inView] = useInView(0.05);

  return (
    <section id="projects" className="section">
      <div className="container">
        <div className={`${styles.header} ${inView ? styles.visible : ''}`} ref={ref}>
          <div className="section-label">Security Work</div>
          <h2 className="section-title">Selected Security Work</h2>
          <p className="section-subtitle">
            Security audits, incident analysis and risk assessment — applied to real-world scenarios.
          </p>
        </div>

        <div className={styles.grid}>
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>

        <div className={styles.footer}>
          <a
            href="https://github.com/pep-vnd/Security-Audits"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost"
          >
            View all on GitHub →
          </a>
        </div>
      </div>
    </section>
  );
}
