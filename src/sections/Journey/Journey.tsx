import { useInView } from '../../hooks/useInView';
import styles from './Journey.module.css';

const ITEMS = [
  {
    time: 'NOW',
    items: [
      { text: 'Computer Engineering @ Universidad de Cádiz', active: true },
      { text: 'Cybersecurity training & security projects', active: true },
      { text: 'Founder & Developer @ conil.com', active: true },
      { text: 'Hack The Box hands-on labs', active: false, note: 'in progress' },
    ],
  },
];

export default function Journey() {
  const [ref, inView] = useInView(0.1);

  return (
    <section className="section" aria-labelledby="journey-heading">
      <div className="container">
        <div className="section-label">Timeline</div>
        <h2 id="journey-heading" className="section-title">
          Current <span className="accent">Journey</span>
        </h2>
        <p className="section-subtitle">
          Building experience one project at a time — learning constantly, staying honest.
        </p>

        <div ref={ref} className={`${styles.timeline} ${inView ? styles.visible : ''}`}>
          {ITEMS.map((block, bi) => (
            <div key={bi} className={styles.block}>
              <div className={styles.timeLabel}>{block.time}</div>
              <div className={styles.items}>
                {block.items.map((item, ii) => (
                  <div
                    key={ii}
                    className={`${styles.item} ${item.active ? styles.itemActive : styles.itemInProgress}`}
                    style={{ transitionDelay: `${ii * 80}ms` }}
                  >
                    <div className={styles.dot}>
                      {item.active
                        ? <span className={styles.dotActive} />
                        : <span className={styles.dotPending} />
                      }
                    </div>
                    <div className={styles.itemContent}>
                      <span className={styles.itemText}>{item.text}</span>
                      {'note' in item && item.note && (
                        <span className={styles.itemNote}>{item.note}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
