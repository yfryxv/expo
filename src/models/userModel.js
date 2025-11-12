const pool = require('../config/db');

function mapUser(row) {
  if (!row) return null;
  return {
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    role: row.role,
    companyName: row.company_name,
    profileSummary: row.profile_summary,
    skills: row.skills ? JSON.parse(row.skills) : null,
    accessibilityNeeds: row.accessibility_needs,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function createUser({
  fullName,
  email,
  passwordHash,
  role,
  companyName = null,
  profileSummary = null,
  skills = null,
  accessibilityNeeds = null,
}) {
  const skillsValue = skills ? JSON.stringify(skills) : null;
  const [result] = await pool.execute(
    `INSERT INTO users (full_name, email, password_hash, role, company_name, profile_summary, skills, accessibility_needs)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [fullName, email, passwordHash, role, companyName, profileSummary, skillsValue, accessibilityNeeds]
  );

  return findById(result.insertId);
}

async function findByEmail(email) {
  const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
  return mapUser(rows[0]);
}

async function findByEmailWithPassword(email) {
  const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
  const row = rows[0];
  if (!row) return null;
  return {
    user: mapUser(row),
    passwordHash: row.password_hash,
  };
}

async function findById(id) {
  const [rows] = await pool.execute('SELECT * FROM users WHERE id = ?', [id]);
  return mapUser(rows[0]);
}

module.exports = {
  createUser,
  findByEmail,
  findByEmailWithPassword,
  findById,
};


