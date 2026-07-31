import { useState } from 'react';
import { Map } from 'lucide-react';
import Reveal from '@/components/shared/Reveal';
import Glasscard from '@/components/shared/Glasscard';
import EmptyState from '@/components/shared/EmptyState';
import ResourceCard from '@/features/learning/components/ResourceCard';
import RoadmapCard from '@/features/learning/components/RoadmapCard';
import { LEARNING_RESOURCES, ROADMAPS } from '@/features/learning/data';
import styles from './Learning.module.css';

export default function Learning() {
  const [activeCategory, setActiveCategory] = useState(LEARNING_RESOURCES[0]?.id ?? null);
  const activeData = LEARNING_RESOURCES.find((r) => r.id === activeCategory);
  const activeRoadmap = ROADMAPS.find((r) => r.categoryId === activeCategory);

  return (
    <div>
      {/* Intro */}
      <section className="section">
        <div className="container">
          <Reveal Component="h1" className="section-title">
            Learning <span className="text-primary-glow">Hub</span>
          </Reveal>
          <p className="section-subtitle">
            Curated resources and structured roadmaps to master modern technologies.
          </p>
        </div>
      </section>

      {/* Resources */}
      <section className="section">
        <div className="container">
          <div className={styles.filterBar} role="tablist" aria-label="Resource categories">
            {LEARNING_RESOURCES.map((r) => (
              <button
                key={r.id}
                type="button"
                role="tab"
                aria-selected={activeCategory === r.id}
                className={`${styles.filterChip} ${activeCategory === r.id ? styles.active : ''}`}
                onClick={() => setActiveCategory(r.id)}
              >
                <span aria-hidden="true">{r.icon}</span> {r.category}
              </button>
            ))}
          </div>

          {activeData && (
            <div className="grid-3">
              {activeData.items.map((item) => (
                <ResourceCard key={item.title} resource={item} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Roadmaps */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">
            Guided <span className="text-secondary-glow">Roadmaps</span>
          </h2>
          <p className="section-subtitle">
            Step-by-step pathways to build your foundational knowledge.
          </p>

          <div className={styles.roadmapWrap}>
            {activeRoadmap ? (
              <RoadmapCard key={activeRoadmap.id} roadmap={activeRoadmap} />
            ) : (
              <Glasscard>
                <EmptyState
                  icon={Map}
                  title="Roadmap coming soon"
                  subtitle="This track doesn't have a guided roadmap yet — check back later."
                />
              </Glasscard>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
