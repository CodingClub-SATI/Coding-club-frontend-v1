import { Link, useLoaderData } from 'react-router';
import { Users, Calendar, FolderGit2, AlertTriangle, Mail } from 'lucide-react';
import AdminTitle from '@/components/admin/AdminTitle';
import EmptyState from '@/components/shared/EmptyState';
import { formatDate } from '@/utils/date';
import tableStyles from '@/components/admin/Table.module.css';
import badgeStyles from '@/components/admin/Badge.module.css';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const {
    stats, statsError,
    recentEvents, eventsError,
    recentContacts, contactsError,
  } = useLoaderData();

  const statCards = [
    {
      label: 'Total Events',
      sub: null,
      value: stats.totalEvents,
      icon: Calendar,
      tone: styles.toneSecondary,
    },
    {
      label: 'Total Projects',
      sub: null,
      value: stats.totalProjects,
      icon: FolderGit2,
      tone: styles.tonePrimary,
    },
    {
      label: 'New Contact Messages',
      sub: null,
      value: stats.newContactMessages,
      icon: Mail,
      tone: styles.toneGold,
    },
    {
      label: 'Total Member Count',
      sub: null,
      value: stats.totalMembers,
      icon: Users,
      tone: styles.toneAccent,
    },
  ];

  return (
    <div>
      <AdminTitle
        title="Overview Dashboard"
        subtitle="Live counts pulled from Events, Team, and Projects — no manual editing needed."
      />

      {statsError ? (
        <EmptyState icon={AlertTriangle} title="Couldn't load stats" subtitle="Try refreshing the page in a moment." />
      ) : (
        <div className={styles.statGrid}>
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className={styles.statCard}>
                <div className={`${styles.statIcon} ${stat.tone}`}>
                  <Icon size={22} />
                </div>
                <div>
                  <div className={styles.statValue}>{stat.value}</div>
                  <div className={styles.statLabel}>{stat.label}</div>
                  {stat.sub && <div className={styles.statSub}>{stat.sub}</div>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className={styles.panelGrid}>
        {/* Recent Events */}
        <section className={styles.panel}>
          <div className={styles.panelHead}>
            <h2 className={styles.panelTitle}>Recent Events</h2>
            <Link to="/admin/events" className={styles.panelLink}>View all →</Link>
          </div>

          {eventsError ? (
            <EmptyState icon={AlertTriangle} title="Couldn't load events" />
          ) : recentEvents.length === 0 ? (
            <EmptyState icon={Calendar} title="No events yet" subtitle="Create your first event to see it here." />
          ) : (
            <div className={tableStyles.tableWrap}>
              <table className={tableStyles.table} aria-label="Recent events">
                <thead>
                  <tr>
                    <th className={tableStyles.th}>Event</th>
                    <th className={tableStyles.th}>Category</th>
                    <th className={tableStyles.th}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentEvents.map((event) => (
                    <tr key={event.id} className={tableStyles.tr}>
                      <td className={tableStyles.td}>
                        {event.title}
                        {event.featured && (
                          <span className={`${badgeStyles.badge} ${badgeStyles.featured} ${styles.inlineBadge}`}>
                            Featured
                          </span>
                        )}
                      </td>
                      <td className={tableStyles.td}>{event.type}</td>
                      <td className={tableStyles.td}>
                        <span className={`${badgeStyles.badge} ${badgeStyles[event.status] || ''}`}>
                          {event.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Recent Contact Requests */}
        <section className={styles.panel}>
          <div className={styles.panelHead}>
            <h2 className={styles.panelTitle}>Recent Contact Requests</h2>
            <Link to="/admin/inbox" className={styles.panelLink}>View all →</Link>
          </div>

          {contactsError ? (
            <EmptyState icon={AlertTriangle} title="Couldn't load messages" />
          ) : recentContacts.length === 0 ? (
            <EmptyState icon={Mail} title="No messages yet" />
          ) : (
            <ul className={styles.contactList}>
              {recentContacts.map((contact) => (
                <li key={contact.id} className={styles.contactRow}>
                  <div className={styles.contactHead}>
                    <strong>{contact.name}</strong>
                    <span
                      className={`${badgeStyles.badge} ${badgeStyles[contact.status.toLowerCase()] || ''}`}
                    >
                      {contact.status}
                    </span>
                  </div>
                  <div className={styles.contactMeta}>{contact.requestType} · {formatDate(contact.createdAt)}</div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}