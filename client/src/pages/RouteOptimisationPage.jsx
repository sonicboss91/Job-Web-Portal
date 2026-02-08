import { useEffect, useMemo, useState } from 'react';
import { api } from '../api/api';
import { useAuth } from '../context/AuthContext';

function mapsLink(address, postcode) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${address}, ${postcode}`)}`;
}

export function RouteOptimisationPage() {
  const { token } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .getJobs(token)
      .then(setJobs)
      .catch((err) => setError(err.message));
  }, [token]);

  const orderedJobs = useMemo(() => {
    return [...jobs].sort((a, b) => {
      const aKey = `${a.jobDate}T${a.windowStart || '23:59'}`;
      const bKey = `${b.jobDate}T${b.windowStart || '23:59'}`;
      return aKey.localeCompare(bKey);
    });
  }, [jobs]);

  return (
    <section>
      <h1>Route Optimisation</h1>
      <p className="muted">Jobs ordered by job date and optional time window.</p>
      {error && <p className="error">{error}</p>}
      <ol className="card route-list">
        {orderedJobs.map((job) => (
          <li key={job.id}>
            <h3>
              {job.jobReference} · {job.customerName}
            </h3>
            <p>
              {job.jobDate} {job.windowStart && job.windowEnd ? `(${job.windowStart} - ${job.windowEnd})` : '(Anytime)'}
            </p>
            <p>
              {job.address}, {job.postcode}
            </p>
            <a href={mapsLink(job.address, job.postcode)} target="_blank" rel="noreferrer">
              Open in Google Maps
            </a>
          </li>
        ))}
        {orderedJobs.length === 0 && <li>No jobs available for route planning.</li>}
      </ol>
    </section>
  );
}
