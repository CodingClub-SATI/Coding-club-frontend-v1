import { useState } from 'react';
import { useLoaderData } from 'react-router';
import { AlertTriangle, Users } from 'lucide-react';
import Reveal from '@/components/shared/Reveal';
import Tabs from '@/components/shared/Tabs';
import Glasscard from '@/components/shared/Glasscard';
import EmptyState from '@/components/shared/EmptyState';
import TeamSection from '@/features/teams/components/TeamSection';
import MemberProfileModal from '@/features/teams/components/MemberProfileModal';
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
          {error ? (
            <EmptyState icon={AlertTriangle} title={error} subtitle="Try refreshing the page in a moment." />
          ) : years.length === 0 ? (
            <Glasscard className={styles.emptyState}>
              <EmptyState icon={Users} title="No team roster yet" subtitle="Check back soon to meet the team." />
            </Glasscard>
          ) : (
            <>
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

              {!yearGroups ? (
                <p className={styles.noRoster}>No roster available for {safeActiveYear}.</p>
              ) : (
                <div>
                  {yearGroups.coreTeam?.length > 0 && (
                    <TeamSection title="Core Team" members={yearGroups.coreTeam} onSelectMember={setSelectedMember} />
                  )}
                  {yearGroups.mentors?.length > 0 && (
                    <TeamSection title="Mentors" members={yearGroups.mentors} onSelectMember={setSelectedMember} />
                  )}
                  {yearGroups.developers?.length > 0 && (
                    <TeamSection
                      title="Developers & Designers"
                      members={yearGroups.developers}
                      onSelectMember={setSelectedMember}
                    />
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {selectedMember && (
        <MemberProfileModal member={selectedMember} onClose={() => setSelectedMember(null)} />
      )}
    </div>
  );
}
