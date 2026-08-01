import { useMemo, useState } from 'react';
import { useLoaderData, useRevalidator } from 'react-router';
import { AlertTriangle, Mail } from 'lucide-react';
import AdminTitle from '@/components/admin/AdminTitle';
import EmptyState from '@/components/shared/EmptyState';
import { Toggle } from '@/components/shared/Toggle';
import InboxDetailPanel from '@/features/contact/admin/InboxDetailPanel';
import { REQUEST_TYPES } from '@/features/contact/constants';
import { formatDate } from '@/utils/date';
import statStripStyles from '@/components/admin/StatStrip.module.css';
import filterBarStyles from '@/components/admin/FilterBar.module.css';
import controlStyles from '@/components/admin/FormControl.module.css';
import tableStyles from '@/components/admin/Table.module.css';
import badgeStyles from '@/components/admin/Badge.module.css';
import styles from './Inbox.module.css';

export default function Inbox() {
  const { contacts, error } = useLoaderData();
  const revalidator = useRevalidator();

  const [typeFilter, setTypeFilter] = useState('all');
  const [showArchived, setShowArchived] = useState(false);
  const [selected, setSelected] = useState(null);

  const breakdown = useMemo(() => {
    const counts = {};
    REQUEST_TYPES.forEach((t) => { counts[t] = 0; });
    contacts.forEach((c) => {
      if (c.status !== 'Archived') counts[c.requestType] = (counts[c.requestType] || 0) + 1;
    });
    return counts;
  }, [contacts]);

  const newCount = contacts.filter((c) => c.status === 'New').length;

  const filtered = contacts.filter((c) => {
    if (!showArchived && c.status === 'Archived') return false;
    if (typeFilter !== 'all' && c.requestType !== typeFilter) return false;
    return true;
  });

  const handleChanged = (updated) => {
    setSelected(updated);
    revalidator.revalidate();
  };

  const handleDeleted = () => {
    setSelected(null);
    revalidator.revalidate();
  };

  const handleRowKeyDown = (e, contact) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setSelected(contact);
    }
  };

  return (
    <div>
      <AdminTitle title="Inbox" subtitle={`${contacts.length} total · ${newCount} new`} />

      <div className={statStripStyles.statStrip}>
        {REQUEST_TYPES.map((t) => (
          <div key={t} className={statStripStyles.statPill}>
            <div className={statStripStyles.statValue}>{breakdown[t] || 0}</div>
            <div className={statStripStyles.statLabel}>{t}</div>
          </div>
        ))}
      </div>

      <div className={filterBarStyles.filterBar}>
        <select
          className={controlStyles.select}
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          aria-label="Filter by request type"
        >
          <option value="all">All Types</option>
          {REQUEST_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <Toggle checked={showArchived} onChange={setShowArchived} label="Show archived" />
      </div>

      {error ? (
        <EmptyState icon={AlertTriangle} title={error} subtitle="Try refreshing the page in a moment." />
      ) : filtered.length === 0 ? (
        <EmptyState icon={Mail} title="No requests match this filter" subtitle="Try clearing the filter to see all requests." />
      ) : (
        <div className={tableStyles.tableWrap}>
          <table className={tableStyles.table} aria-label="Contact requests">
            <thead>
              <tr>
                <th className={tableStyles.th}>Name</th>
                <th className={tableStyles.th}>Type</th>
                <th className={tableStyles.th}>Date</th>
                <th className={tableStyles.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((contact) => (
                <tr
                  key={contact.id}
                  className={tableStyles.tr}
                  onClick={() => setSelected(contact)}
                  onKeyDown={(e) => handleRowKeyDown(e, contact)}
                  role="button"
                  tabIndex={0}
                  aria-label={`View details for ${contact.name}`}
                >
                  <td className={tableStyles.td}>
                    {contact.name}
                    <div className={styles.emailMeta}>{contact.email}</div>
                  </td>
                  <td className={tableStyles.td}>{contact.requestType}</td>
                  <td className={tableStyles.td}>{formatDate(contact.submittedAt)}</td>
                  <td className={tableStyles.td}>
                    <span className={`${badgeStyles.badge} ${badgeStyles[contact.status.toLowerCase()] || ''}`}>
                      {contact.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <InboxDetailPanel
          contact={selected}
          onClose={() => setSelected(null)}
          onChanged={handleChanged}
          onDeleted={handleDeleted}
        />
      )}
    </div>
  );
}
