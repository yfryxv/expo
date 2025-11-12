const pool = require('../config/db');

function mapOffer(row) {
  if (!row) return null;
  return {
    id: row.id,
    companyId: row.company_id,
    title: row.title,
    description: row.description,
    location: row.location,
    salaryRange: row.salary_range,
    employmentType: row.employment_type,
    requirements: row.requirements ? JSON.parse(row.requirements) : null,
    accessibilityFeatures: row.accessibility_features ? JSON.parse(row.accessibility_features) : null,
    remoteAvailable: !!row.remote_available,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function createOffer({
  companyId,
  title,
  description,
  location = null,
  salaryRange = null,
  employmentType = null,
  requirements = null,
  accessibilityFeatures = null,
  remoteAvailable = false,
}) {
  const [result] = await pool.execute(
    `INSERT INTO job_offers
      (company_id, title, description, location, salary_range, employment_type, requirements, accessibility_features, remote_available)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      companyId,
      title,
      description,
      location,
      salaryRange,
      employmentType,
      requirements ? JSON.stringify(requirements) : null,
      accessibilityFeatures ? JSON.stringify(accessibilityFeatures) : null,
      remoteAvailable ? 1 : 0,
    ]
  );

  return findById(result.insertId);
}

async function findById(id) {
  const [rows] = await pool.execute('SELECT * FROM job_offers WHERE id = ?', [id]);
  return mapOffer(rows[0]);
}

async function findByIdAndCompany(id, companyId) {
  const [rows] = await pool.execute('SELECT * FROM job_offers WHERE id = ? AND company_id = ?', [id, companyId]);
  return mapOffer(rows[0]);
}

async function listOffers({ location, remote, limit = 20, offset = 0 } = {}) {
  const clauses = [];
  const params = [];

  if (location) {
    clauses.push('location LIKE ?');
    params.push(`%${location}%`);
  }

  if (typeof remote === 'boolean') {
    clauses.push('remote_available = ?');
    params.push(remote ? 1 : 0);
  }

  const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';

  params.push(Number(limit));
  params.push(Number(offset));

  const [rows] = await pool.execute(
    `SELECT * FROM job_offers ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
    params
  );

  return rows.map(mapOffer);
}

async function updateOffer(id, companyId, data) {
  const fields = [];
  const params = [];

  const mappers = {
    title: 'title',
    description: 'description',
    location: 'location',
    salaryRange: 'salary_range',
    employmentType: 'employment_type',
    requirements: 'requirements',
    accessibilityFeatures: 'accessibility_features',
    remoteAvailable: 'remote_available',
  };

  Object.entries(mappers).forEach(([key, column]) => {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      let value = data[key];
      if (['requirements', 'accessibilityFeatures'].includes(key) && value) {
        value = JSON.stringify(value);
      } else if (key === 'remoteAvailable' && typeof value === 'boolean') {
        value = value ? 1 : 0;
      }

      fields.push(`${column} = ?`);
      params.push(value);
    }
  });

  if (!fields.length) {
    return findByIdAndCompany(id, companyId);
  }

  params.push(id);
  params.push(companyId);

  await pool.execute(
    `UPDATE job_offers SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND company_id = ?`,
    params
  );

  return findByIdAndCompany(id, companyId);
}

async function deleteOffer(id, companyId) {
  const [result] = await pool.execute('DELETE FROM job_offers WHERE id = ? AND company_id = ?', [id, companyId]);
  return result.affectedRows > 0;
}

module.exports = {
  createOffer,
  findById,
  findByIdAndCompany,
  listOffers,
  updateOffer,
  deleteOffer,
};


