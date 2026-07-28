import { useState } from 'react';
import { useLoaderData } from 'react-router';
import { AlertTriangle, Users } from 'lucide-react';
import Reveal from '@/components/shared/Reveal';
import Tabs from '@/components/shared/Tabs';
import Glasscard from '@/components/shared/Glasscard';
import EmptyState from '@/components/shared/EmptyState';
import TeamSection from '@/features/teams/components/TeamSection';
import MemberProfileModal from '@/features/teams/components/MemberProfileModal';
import { TEAM_GROUPS } from '@/features/teams/constants';
import styles from './Teams.module.css';

export default function Teams() {
  const { years, byYear, currentYear, error } = useLoaderData();
  const [activeYear, setActiveYear] = useState(currentYear ?? years[0] ?? null);
  const [selectedMember, setSelectedMember] = useState(null);

  const safeActiveYear = years.includes(activeYear) ? activeYear : years[0];
  const yearGroups = safeActiveYear ? byYear[safeActiveYear] : null;

  return (
    <div>
      <section className="section">
        <div className="container">
          <Reveal Component="h1" className="section-title">
            Our <span className="text-primary-glow">Team</span>
          </Reveal>
          <p className="section-subtitle">Meet the passionate individuals who make the club thrive.</p>
        </div>
      </section>

      <section className={`section ${styles.rosterSection}`}>
        <div className="container">
          {years.length > 1 && (
            <Tabs
              className={styles.yearTabs}
              items={years.map((year) => ({
                value: year,
                label: year === currentYear ? `${year} (Current)` : year,
              }))}
              value={safeActiveYear}
              onChange={setActiveYear}
            />
          )}

          {error ? (
            <Glasscard className={styles.emptyState}>
              <EmptyState 
                icon={AlertTriangle} 
                title={error} 
                subtitle="Try refreshing the page in a moment." 
              />
            </Glasscard>
          ) : years.length === 0 ? (
            <Glasscard className={styles.emptyState}>
              <EmptyState 
                icon={Users} 
                title="No team roster yet" 
                subtitle="Check back soon to meet the team." 
              />
            </Glasscard>
          ) : !yearGroups ? (
            <Glasscard className={styles.emptyState}>
              <EmptyState 
                icon={Users} 
                title="No roster available" 
                subtitle={`No roster data found for ${safeActiveYear}.`} 
              />
            </Glasscard>
          ) : (
            <div>
              {TEAM_GROUPS.map(({ key, label }) => (
                yearGroups[key]?.length > 0 && (
                  <TeamSection
                    key={key}
                    title={label}
                    members={yearGroups[key]}
                    onSelectMember={setSelectedMember}
                  />
                )
              ))}
            </div>
          )}
        </div>
      </section>

      {selectedMember && (
        <MemberProfileModal member={selectedMember} onClose={() => setSelectedMember(null)} />
      )}
    </div>
  );
}