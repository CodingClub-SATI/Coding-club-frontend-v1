import { useState } from 'react';
import { useLoaderData } from 'react-router';
import { AlertTriangle, Users } from 'lucide-react';
import Reveal from '@/components/shared/Reveal';
import Tabs from '@/components/shared/Tabs';
import Glasscard from '@/components/shared/Glasscard';
import EmptyState from '@/components/shared/EmptyState';
import TeamSection from '@/features/teams/components/TeamSection';
import MemberCard from '@/features/teams/components/MemberCard';
import MemberProfileModal from '@/features/teams/components/MemberProfileModal';
import { LEADERSHIP_SECTIONS } from '@/features/teams/constants';
import styles from './Teams.module.css';

export default function Teams() {
  const { leadership, batches, error } = useLoaderData();
  const [activeBatch, setActiveBatch] = useState(batches[0]?.batch ?? null);
  const [selectedMember, setSelectedMember] = useState(null);

  // The backend is expected to return batches newest-first with archived
  // batches already excluded — we just render whatever comes back.
  const safeActiveBatch = batches.some((b) => b.batch === activeBatch) ? activeBatch : batches[0]?.batch ?? null;
  const currentBatch = batches.find((b) => b.batch === safeActiveBatch) ?? null;

  // Leadership sections: the API groups these for us (leadership.convenor,
  // leadership.coConvenor, leadership.departmentLeads) — we only turn that
  // into the { title, members[] } shape TeamSection expects.
  const leadershipGroups = LEADERSHIP_SECTIONS.map(({ key, label }) => ({
    key,
    label,
    members: key === 'departmentLeads'
      ? leadership?.departmentLeads || []
      : leadership?.[key]
        ? [leadership[key]]
        : [],
  })).filter((group) => group.members.length > 0);

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

      {leadershipGroups.length > 0 && (
        <section className={`section ${styles.leadershipSection}`}>
          <div className="container">
            {leadershipGroups.map((group) => (
              <TeamSection
                key={group.key}
                title={group.label}
                members={group.members}
                onSelectMember={setSelectedMember}
              />
            ))}
          </div>
        </section>
      )}

      <section className={`section ${styles.rosterSection}`}>
        <div className="container">
          {batches.length > 1 && (
            <Tabs
              className={styles.batchTabs}
              items={batches.map((batch) => ({ value: batch.batch, label: batch.batch }))}
              value={safeActiveBatch}
              onChange={setActiveBatch}
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
          ) : batches.length === 0 ? (
            <Glasscard className={styles.emptyState}>
              <EmptyState
                icon={Users}
                title="No team roster yet"
                subtitle="Check back soon to meet the team."
              />
            </Glasscard>
          ) : !currentBatch || currentBatch.members.length === 0 ? (
            <Glasscard className={styles.emptyState}>
              <EmptyState
                icon={Users}
                title="No members yet"
                subtitle={`No members found for batch ${safeActiveBatch}.`}
              />
            </Glasscard>
          ) : (
            <div className={styles.memberGrid}>
              {currentBatch.members.map((member) => (
                <MemberCard key={member.id} member={member} onClick={setSelectedMember} />
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
