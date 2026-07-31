import { useEffect, useState } from 'react';
import { Link, useLoaderData, useLocation, useSearchParams, useNavigation } from 'react-router';
import { CalendarX, AlertTriangle } from 'lucide-react';
import Reveal from '@/components/shared/Reveal';
import Glasscard from '@/components/shared/Glasscard';
import Tabs from '@/components/shared/Tabs';
import Button from '@/components/shared/Button';
import EmptyState from '@/components/shared/EmptyState';
import Pagination from '@/components/shared/Pagination';
import { BoltPath } from '@/components/shared/Icons';
import EventCard from '@/features/events/components/EventCard';
import FeaturedCarousel from '@/features/events/components/FeaturedCarousel';
import EventDetailsModal from '@/features/events/components/EventDetailsModal';
import styles from './Events.module.css';

const TAB_ITEMS = [
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'completed', label: 'Completed' },
  { value: 'all', label: 'All Events' },
];

const TYPES = ['All', 'Workshop', 'Hackathon', 'Competition', 'Seminar'];

export default function Events() {
  const { events, featuredEvents, page, totalPages, error } = useLoaderData();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const navigation = useNavigation();
  const location = useLocation();
  const isFiltering = navigation.state === 'loading';

  const tab = searchParams.get('status') || 'upcoming';
  const filter = searchParams.get('type') || 'All';

  const updateParam = (key, value, defaultValue) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value === defaultValue) next.delete(key);
      else next.set(key, value);
      next.delete('page');
      return next;
    }, { replace: true, preventScrollReset: true });
  };

  const setTab = (value) => updateParam('status', value, 'upcoming');
  const setFilter = (value) => updateParam('type', value, 'All');

  const setPage = (nextPage) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (nextPage <= 1) next.delete('page');
      else next.set('page', String(nextPage));
      return next;
    }, { replace: true, preventScrollReset: true });
  };

  useEffect(() => {
    if (location.hash === '#all-events') {
      document.getElementById('all-events')?.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={`container ${styles.heroGrid}`}>
          <div>
            <p className={styles.eyebrow}>✦ INNOVATE ✦ COMPETE ✦ COLLABORATE</p>
            <h1 className={styles.heroTitle}>
              <span className="text-primary-glow">EVENTS</span>
              <span className={styles.heroTitleMuted}> &amp;</span>
              <br />
              <span>WORKSHOPS</span>
            </h1>
            <p className={styles.heroDesc}>
              Explore workshops, hackathons, competitions, and seminars organized by Coding Club SATI.
              Transform your skills through hands-on learning experiences.
            </p>
            <div className={styles.heroCtas}>
              <Button
                onClick={() => {
                  setTab('upcoming');
                  document.getElementById('all-events')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Explore Upcoming →
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setTab('completed');
                  document.getElementById('all-events')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                View Past Events
              </Button>
            </div>
          </div>
          <div className={styles.heroMascot}>
            <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="var(--brand-accent)" strokeWidth="0.8">
              <circle cx="12" cy="12" r="11" strokeDasharray="6 3" />
              <BoltPath strokeWidth="1.5" />
            </svg>
          </div>
        </div>
      </section>

      {/* Featured carousel */}
      {!error && featuredEvents.length > 0 && (
        <section className="section">
          <div className="container">
            <h2 className="section-title">Featured <span className="text-secondary-glow">Events</span></h2>
            <FeaturedCarousel items={featuredEvents} onSelect={setSelectedEvent} />
          </div>
        </section>
      )}

      {/* All events */}
      <section className="section" id="all-events">
        <div className="container">
          <div className={styles.filterBar}>
            <h2 className={`section-title ${styles.filterBarTitle}`}>All Events</h2>
            <div className={styles.controls}>
              <Tabs items={TAB_ITEMS} value={tab} onChange={setTab} />
              <select
                className={styles.filterSelect}
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                aria-label="Filter events by type"
              >
                {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          {error ? (
            <Glasscard className={styles.emptyState}>
              <EmptyState icon={AlertTriangle} title={error} subtitle="Try refreshing the page in a moment." />
            </Glasscard>
          ) : events.length === 0 ? (
            <Glasscard className={styles.emptyState}>
              <EmptyState icon={CalendarX} title="No events found" subtitle="Try a different filter or check back later." />
            </Glasscard>
          ) : (
            <>
              <div
                className={`grid-3 ${styles.eventsGrid}`}
                aria-busy={isFiltering}
                style={isFiltering ? { opacity: 0.5, transition: 'opacity 150ms ease' } : undefined}
              >
                {events.map((event, i) => (
                  <Reveal key={event.id} delay={i * 80}>
                    <EventCard event={event} onClick={setSelectedEvent} />
                  </Reveal>
                ))}
              </div>
              <Pagination page={page} totalPages={totalPages} onChange={setPage} />
            </>
          )}
        </div>
      </section>

      {/* Host CTA */}
      <section className="section">
        <div className="container">
          <Glasscard className={styles.hostCta}>
            <h2>Want to Host an Event?</h2>
            <p>Have an idea for a workshop or event? We're always looking for passionate individuals to share their knowledge with the community.</p>
            <Button Component={Link} to="/contact">Get In Touch</Button>
          </Glasscard>
        </div>
      </section>

      {selectedEvent && <EventDetailsModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />}
    </div>
  );
}