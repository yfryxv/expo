const pool = require('../config/db');

function mapApplication(row) {
  if (!row) return null;
  return {
    id: row.id,
    offerId: row.offer_id,
    candidateId: row.candidate_id,
    coverLetter: row.cover_letter,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function createApplication({ offerId, candidateId, coverLetter = null }) {
  const [result] = await pool.execute(
    `INSERT INTO applications (offer_id, candidate_id, cover_letter)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE cover_letter = VALUES(cover_letter), updated_at = CURRENT_TIMESTAMP`,
    [offerId, candidateId, coverLetter]
  );

  const id = result.insertId || result.lastInsertId;

  return findByOfferAndCandidate(offerId, candidateId, id);
}

async function findByOfferAndCandidate(offerId, candidateId, fallbackId = null) {
  if (fallbackId) {
    const [rows] = await pool.execute('SELECT * FROM applications WHERE id = ?', [fallbackId]);
    if (rows[0]) return mapApplication(rows[0]);
  }

  const [rows] = await pool.execute(
    'SELECT * FROM applications WHERE offer_id = ? AND candidate_id = ?',
    [offerId, candidateId]
  );
  return mapApplication(rows[0]);
}

async function listByCandidate(candidateId) {
  const [rows] = await pool.execute(
    `SELECT a.*, o.title, o.company_id, o.location
     FROM applications a
     JOIN job_offers o ON o.id = a.offer_id
     WHERE a.candidate_id = ?
     ORDER BY a.created_at DESC`,
    [candidateId]
  );

  return rows.map((row) => ({
    ...mapApplication(row),
    offerTitle: row.title,
    companyId: row.company_id,
    location: row.location,
  }));
}

async function listApplicantsByOffer(offerId) {
  const [rows] = await pool.execute(
    `SELECT a.*, u.full_name, u.email, u.skills, u.accessibility_needs
     FROM applications a
     JOIN users u ON u.id = a.candidate_id
     WHERE a.offer_id = ?
     ORDER BY a.created_at DESC`,
    [offerId]
  );

  return rows.map((row) => ({
    ...mapApplication(row),
    candidate: {
      fullName: row.full_name,
      email: row.email,
      skills: row.skills ? JSON.parse(row.skills) : null,
      accessibilityNeeds: row.accessibility_needs,
    },
  }));
}

module.exports = {
  createApplication,
  findByOfferAndCandidate,
  listByCandidate,
  listApplicantsByOffer,
};


