import express from 'express';
import db from '../db.js';

const router = express.Router();

function validateJobPayload(payload) {
  const requiredFields = ['jobReference', 'customerName', 'address', 'postcode', 'jobDate'];

  for (const field of requiredFields) {
    if (!payload[field]) {
      return `${field} is required.`;
    }
  }

  if (payload.windowStart && payload.windowEnd && payload.windowStart > payload.windowEnd) {
    return 'windowStart cannot be later than windowEnd.';
  }

  return null;
}

function mapJob(row) {
  return {
    id: row.id,
    jobReference: row.jobReference,
    customerName: row.customerName,
    address: row.address,
    postcode: row.postcode,
    jobDate: row.jobDate,
    windowStart: row.windowStart,
    windowEnd: row.windowEnd,
    estimatedVolumeYd3: row.estimatedVolumeYd3,
    priceExVat: row.priceExVat,
    vatAmount: row.vatAmount,
    totalPriceIncVat: row.totalPriceIncVat,
    notes: row.notes
  };
}

router.get('/', (req, res) => {
  const jobs = db
    .prepare(
      `SELECT
         id,
         job_reference AS jobReference,
         customer_name AS customerName,
         address,
         postcode,
         job_date AS jobDate,
         window_start AS windowStart,
         window_end AS windowEnd,
         estimated_volume_yd3 AS estimatedVolumeYd3,
         price_ex_vat AS priceExVat,
         vat_amount AS vatAmount,
         total_price_inc_vat AS totalPriceIncVat,
         notes
       FROM jobs
       WHERE user_id = ?
       ORDER BY job_date ASC, COALESCE(window_start, '23:59') ASC`
    )
    .all(req.user.id)
    .map(mapJob);

  return res.json(jobs);
});

router.post('/', (req, res) => {
  const {
    jobReference,
    customerName,
    address,
    postcode,
    jobDate,
    windowStart,
    windowEnd,
    estimatedVolumeYd3,
    priceExVat,
    vatAmount,
    totalPriceIncVat,
    notes
  } = req.body;

  const validationError = validateJobPayload(req.body);
  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  const result = db
    .prepare(
      `INSERT INTO jobs (
         user_id,
         job_reference,
         customer_name,
         address,
         postcode,
         job_date,
         window_start,
         window_end,
         estimated_volume_yd3,
         price_ex_vat,
         vat_amount,
         total_price_inc_vat,
         notes,
         title,
         scheduled_at,
         volume
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      req.user.id,
      jobReference,
      customerName,
      address,
      postcode,
      jobDate,
      windowStart || null,
      windowEnd || null,
      Number(estimatedVolumeYd3 || 0),
      Number(priceExVat || 0),
      Number(vatAmount || 0),
      Number(totalPriceIncVat || 0),
      notes || '',
      jobReference,
      `${jobDate}T${windowStart || '00:00'}`,
      `${estimatedVolumeYd3 || 0} yd³`
    );

  return res.status(201).json({
    id: result.lastInsertRowid,
    jobReference,
    customerName,
    address,
    postcode,
    jobDate,
    windowStart: windowStart || '',
    windowEnd: windowEnd || '',
    estimatedVolumeYd3: Number(estimatedVolumeYd3 || 0),
    priceExVat: Number(priceExVat || 0),
    vatAmount: Number(vatAmount || 0),
    totalPriceIncVat: Number(totalPriceIncVat || 0),
    notes: notes || ''
  });
});

router.put('/:id', (req, res) => {
  const { id } = req.params;
  const {
    jobReference,
    customerName,
    address,
    postcode,
    jobDate,
    windowStart,
    windowEnd,
    estimatedVolumeYd3,
    priceExVat,
    vatAmount,
    totalPriceIncVat,
    notes
  } = req.body;

  const validationError = validateJobPayload(req.body);
  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  const result = db
    .prepare(
      `UPDATE jobs
       SET job_reference = ?,
           customer_name = ?,
           address = ?,
           postcode = ?,
           job_date = ?,
           window_start = ?,
           window_end = ?,
           estimated_volume_yd3 = ?,
           price_ex_vat = ?,
           vat_amount = ?,
           total_price_inc_vat = ?,
           notes = ?,
           title = ?,
           scheduled_at = ?,
           volume = ?,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = ? AND user_id = ?`
    )
    .run(
      jobReference,
      customerName,
      address,
      postcode,
      jobDate,
      windowStart || null,
      windowEnd || null,
      Number(estimatedVolumeYd3 || 0),
      Number(priceExVat || 0),
      Number(vatAmount || 0),
      Number(totalPriceIncVat || 0),
      notes || '',
      jobReference,
      `${jobDate}T${windowStart || '00:00'}`,
      `${estimatedVolumeYd3 || 0} yd³`,
      id,
      req.user.id
    );

  if (result.changes === 0) {
    return res.status(404).json({ message: 'Job not found.' });
  }

  return res.json({
    id: Number(id),
    jobReference,
    customerName,
    address,
    postcode,
    jobDate,
    windowStart: windowStart || '',
    windowEnd: windowEnd || '',
    estimatedVolumeYd3: Number(estimatedVolumeYd3 || 0),
    priceExVat: Number(priceExVat || 0),
    vatAmount: Number(vatAmount || 0),
    totalPriceIncVat: Number(totalPriceIncVat || 0),
    notes: notes || ''
  });
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;

  const result = db.prepare('DELETE FROM jobs WHERE id = ? AND user_id = ?').run(id, req.user.id);

  if (result.changes === 0) {
    return res.status(404).json({ message: 'Job not found.' });
  }

  return res.status(204).send();
});

export default router;
