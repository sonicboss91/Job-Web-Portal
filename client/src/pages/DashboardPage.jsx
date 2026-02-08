import { useEffect, useMemo, useState } from 'react';
import { api } from '../api/api';
import { useAuth } from '../context/AuthContext';

export function DashboardPage() {
  const { token } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .getJobs(token)
      .then(setJobs)
      .catch((err) => setError(err.message));
  }, [token]);

  const grouped = useMemo(() => {
    return jobs.reduce((acc, job) => {
      const day = job.jobDate;
      acc[day] = acc[day] || [];
      acc[day].push(job);
      return acc;
    }, {});
  }, [jobs]);

  return (
    <section>
      <h1>Daily Schedule Board</h1>
      {error && <p className="error">{error}</p>}
      {Object.keys(grouped).length === 0 && <p className="card">No jobs scheduled yet.</p>}
      <div className="grid two">
        {Object.entries(grouped).map(([day, entries]) => (
          <article className="card" key={day}>
            <h3>{day}</h3>
            <ul>
              {entries.map((job) => (
                <li key={job.id}>
                  <strong>{job.jobReference}</strong> — {job.customerName}
                  <br />
                  {job.windowStart && job.windowEnd ? `${job.windowStart} - ${job.windowEnd}` : 'Anytime'} · {job.address}, {job.postcode}
                  <br />
                  {job.estimatedVolumeYd3} yd³
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
