import { useEffect, useState } from 'react';
import { api } from '../api/api';
import { JobForm } from '../components/JobForm';
import { useAuth } from '../context/AuthContext';

function formatGBP(value) {
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(Number(value || 0));
}

export function JobsPage() {
  const { token } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState('');

  const fetchJobs = async () => {
    try {
      const data = await api.getJobs(token);
      setJobs(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleCreate = async (form) => {
    try {
      await api.createJob(token, form);
      await fetchJobs();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdate = async (form) => {
    if (!editing) return;
    try {
      await api.updateJob(token, editing.id, form);
      setEditing(null);
      await fetchJobs();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.deleteJob(token, id);
      await fetchJobs();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="jobs-layout">
      <div>
        <h1>Daily Job Scheduling</h1>
        {error && <p className="error">{error}</p>}
        <div className="card table-wrap">
          <table>
            <thead>
              <tr>
                <th>Ref</th>
                <th>Customer</th>
                <th>Address</th>
                <th>Date</th>
                <th>Window</th>
                <th>Volume</th>
                <th>Ex VAT</th>
                <th>VAT</th>
                <th>Total</th>
                <th>Notes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.id}>
                  <td>{job.jobReference}</td>
                  <td>{job.customerName}</td>
                  <td>
                    {job.address}
                    <br />
                    <small>{job.postcode}</small>
                  </td>
                  <td>{job.jobDate}</td>
                  <td>{job.windowStart && job.windowEnd ? `${job.windowStart} - ${job.windowEnd}` : 'Anytime'}</td>
                  <td>{job.estimatedVolumeYd3} yd³</td>
                  <td>{formatGBP(job.priceExVat)}</td>
                  <td>{formatGBP(job.vatAmount)}</td>
                  <td>{formatGBP(job.totalPriceIncVat)}</td>
                  <td>{job.notes || '-'}</td>
                  <td>
                    <button type="button" onClick={() => setEditing(job)}>
                      Edit
                    </button>{' '}
                    <button type="button" className="danger" onClick={() => handleDelete(job.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {jobs.length === 0 && (
                <tr>
                  <td colSpan="11">No jobs yet. Use the form to add your first job.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div>
        <JobForm onSubmit={handleCreate} submitLabel="Add Job" />
        {editing && (
          <JobForm
            initialValues={editing}
            onSubmit={handleUpdate}
            onCancel={() => setEditing(null)}
            submitLabel="Update Job"
          />
        )}
      </div>
    </section>
  );
}
