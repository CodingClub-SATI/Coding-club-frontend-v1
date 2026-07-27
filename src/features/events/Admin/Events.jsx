import { useMemo, useState } from 'react';
import { useLoaderData, useRevalidator } from 'react-router';
import { Plus, Calendar, AlertTriangle } from 'lucide-react';
import AdminTitle from '@/components/admin/AdminTitle';
import Button from '@/components/shared/Button';
import { Toggle } from '@/components/shared/Toggle';
import EmptyState from '@/components/shared/EmptyState';
import EventFormModal from '@/features/events/admin/EventFormModal';
import EventDetailPanel from '@/features/events/admin/EventDetailPanel';
import { EVENT_CATEGORIES } from '@/features/events/constants';
import filterBarStyles from '@/components/admin/FilterBar.module.css';
import controlStyles from '@/components/admin/FormControl.module.css';
import tableStyles from '@/components/admin/Table.module.css';
import badgeStyles from '@/components/admin/Badge.module.css';
import styles from './Events.module.css';

export default function Events() {
  const { events, error } = useLoaderData();
  const revalidator = useRevalidator();

  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showArchived, setShowArchived] = useState(false);
  const [selected, setSelected] = useState(null);
  const [editing, setEditing] = useState(null); // null | 'new' | event object

  const counts = useMemo(() => {
    const byCategory = {};
    EVENT_CATEGORIES.forEach((c) => {
      byCategory[c] = events.filter((e) => e.type === c && !e.archived).length;
    });
    return byCategory;
  }, [events]);

  const activeTotal = events.filter((e) => !e.archived).length;

  const filtered = events.filter((e) => {
    if (!showArchived && e.archived) return false;
    if (statusFilter !== 'all' && e.status !== statusFilter) return false;
    if (categoryFilter !== 'all' && e.type !== categoryFilter) return false;
    return true;
  });

  const openNew = () => setEditing('new');

  const openEditFromDetail = () => {
    const target = selected;
    setSelected(null);
    setEditing(target);
  };

  const handleSaved = () => {
    setEditing(null);
    setSelected(null);
    revalidator.revalidate();
  };

  const handleDetailChanged = (updated) => {
    setSelected(updated);
    revalidator.revalidate();
  };

  const handleDetailDeleted = () => {
    setSelected(null);
    revalidator.revalidate();
  };

  const handleRowKeyDown = (e, event) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setSelected(event);
    }
  };

  return (
    <div>
      <AdminTitle
        title="Events"
        subtitle={`${activeTotal} total · ${EVENT_CATEGORIES.map((c) => `${counts[c]} ${c}`).join(' · ')}`}
      >
        <Button onClick={openNew}><Plus size={16} aria-hidden="true" /> Add New Event</Button>
      </AdminTitle>

      <div className={filterBarStyles.filterBar}>
        <select
          className={controlStyles.select}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          aria-label="Filter by status"
        >
          <option value="all">All Statuses</option>
          <option value="upcoming">Upcoming</option>
          <option value="completed">Completed</option>
        </select>
        <select
          className={controlStyles.select}
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          aria-label="Filter by category"
        >
          <option value="all">All Categories</option>
          {EVENT_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <Toggle checked={showArchived} onChange={setShowArchived} label="Show archived" />
      </div>

      {error ? (
        <EmptyState icon={AlertTriangle} title={error} subtitle="Try refreshing the page in a moment." />
      ) : filtered.length === 0 ? (
        <EmptyState icon={Calendar} title="No events match these filters" subtitle="Try clearing a filter or add a new event." />
      ) : (
        <div className={tableStyles.tableWrap}>
          <table className={tableStyles.table} aria-label="Events">
            <thead>
              <tr>
                <th className={tableStyles.th}>Event</th>
                <th className={tableStyles.th}>Category</th>
                <th className={tableStyles.th}>Date</th>
                <th className={tableStyles.th}>Status</th>
                <th className={tableStyles.th}>Views</th>
                <th className={tableStyles.th}>Registrations</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((event) => (
                <tr
                  key={event.id}
                  className={tableStyles.tr}
                  onClick={() => setSelected(event)}
                  onKeyDown={(e) => handleRowKeyDown(e, event)}
                  role="button"
                  tabIndex={0}
                  aria-label={`View details for ${event.title}`}
                >
                  <td className={tableStyles.td}>
                    {event.title}
                    {event.featured && (
                      <span className={`${badgeStyles.badge} ${badgeStyles.featured} ${styles.inlineBadge}`}>Featured</span>
                    )}
                    {event.archived && (
                      <span className={`${badgeStyles.badge} ${badgeStyles.archived} ${styles.inlineBadge}`}>Archived</span>
                    )}
                  </td>
                  <td className={tableStyles.td}>{event.type}</td>
                  <td className={tableStyles.td}>{event.date}</td>
                  <td className={tableStyles.td}>
                    <span className={`${badgeStyles.badge} ${badgeStyles[event.status] || ''}`}>{event.status}</span>
                  </td>
                  <td className={tableStyles.td}>{event.viewCount ?? 0}</td>
                  <td className={tableStyles.td}>{event.registerClickCount ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <EventDetailPanel
          event={selected}
          onClose={() => setSelected(null)}
          onEdit={openEditFromDetail}
          onChanged={handleDetailChanged}
          onDeleted={handleDetailDeleted}
        />
      )}

      {editing && (
        <EventFormModal
          mode={editing === 'new' ? 'new' : 'edit'}
          event={editing === 'new' ? null : editing}
          onClose={() => setEditing(null)}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}
