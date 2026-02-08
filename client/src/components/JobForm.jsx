import { useEffect, useState } from 'react';

const EMPTY_FORM = {
  jobReference: '',
  customerName: '',
  address: '',
  postcode: '',
  jobDate: '',
  windowStart: '',
  windowEnd: '',
  estimatedVolumeYd3: '',
  priceExVat: '',
  vatAmount: '',
  totalPriceIncVat: '',
  notes: ''
};

export function JobForm({ initialValues, onSubmit, onCancel, submitLabel = 'Save Job' }) {
  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => {
    if (initialValues) {
      setForm({ ...EMPTY_FORM, ...initialValues });
    } else {
      setForm(EMPTY_FORM);
    }
  }, [initialValues]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => {
      const next = { ...prev, [name]: value };

      if (name === 'priceExVat') {
        const exVat = Number(value || 0);
        const vat = Number((exVat * 0.2).toFixed(2));
        next.vatAmount = String(vat);
        next.totalPriceIncVat = String(Number((exVat + vat).toFixed(2)));
      }

      return next;
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(form);
  };

  return (
    <form className="card form" onSubmit={handleSubmit}>
      <h3>{submitLabel}</h3>
      <label>
        Job reference / internal ID
        <input name="jobReference" value={form.jobReference} onChange={handleChange} required />
      </label>
      <label>
        Customer name
        <input name="customerName" value={form.customerName} onChange={handleChange} required />
      </label>
      <label>
        Address
        <input name="address" value={form.address} onChange={handleChange} required />
      </label>
      <label>
        Postcode
        <input name="postcode" value={form.postcode} onChange={handleChange} required />
      </label>
      <label>
        Job date
        <input name="jobDate" type="date" value={form.jobDate} onChange={handleChange} required />
      </label>
      <div className="inline-grid">
        <label>
          Window start (optional)
          <input name="windowStart" type="time" value={form.windowStart} onChange={handleChange} />
        </label>
        <label>
          Window end (optional)
          <input name="windowEnd" type="time" value={form.windowEnd} onChange={handleChange} />
        </label>
      </div>
      <label>
        Estimated volume (yd³)
        <input name="estimatedVolumeYd3" type="number" step="0.1" min="0" value={form.estimatedVolumeYd3} onChange={handleChange} required />
      </label>
      <div className="inline-grid">
        <label>
          Price (ex VAT)
          <input name="priceExVat" type="number" step="0.01" min="0" value={form.priceExVat} onChange={handleChange} required />
        </label>
        <label>
          VAT amount
          <input name="vatAmount" type="number" step="0.01" min="0" value={form.vatAmount} onChange={handleChange} required />
        </label>
      </div>
      <label>
        Total price (inc VAT)
        <input name="totalPriceIncVat" type="number" step="0.01" min="0" value={form.totalPriceIncVat} onChange={handleChange} required />
      </label>
      <label>
        Notes
        <textarea name="notes" rows="3" value={form.notes} onChange={handleChange} />
      </label>

      <div className="form-actions">
        <button type="submit">{submitLabel}</button>
        {onCancel && (
          <button type="button" className="secondary" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
