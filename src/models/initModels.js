const pool = require('../config/db');

async function initializeDatabase() {
  const connection = await pool.getConnection();

  try {
    await connection.query('SET NAMES utf8mb4;');
    await connection.query('SET time_zone = "+00:00";');

    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        full_name VARCHAR(150) NOT NULL,
        email VARCHAR(150) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        role ENUM('empresa', 'candidato') NOT NULL,
        company_name VARCHAR(150),
        profile_summary TEXT,
        skills TEXT,
        accessibility_needs TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS job_offers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        company_id INT NOT NULL,
        title VARCHAR(200) NOT NULL,
        description TEXT NOT NULL,
        location VARCHAR(200),
        salary_range VARCHAR(100),
        employment_type VARCHAR(100),
        requirements TEXT,
        accessibility_features TEXT,
        remote_available TINYINT(1) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT fk_job_offers_company FOREIGN KEY (company_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS applications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        offer_id INT NOT NULL,
        candidate_id INT NOT NULL,
        cover_letter TEXT,
        status ENUM('postulado', 'en_revision', 'entrevista', 'oferta', 'rechazado') DEFAULT 'postulado',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT fk_applications_offer FOREIGN KEY (offer_id) REFERENCES job_offers(id) ON DELETE CASCADE,
        CONSTRAINT fk_applications_candidate FOREIGN KEY (candidate_id) REFERENCES users(id) ON DELETE CASCADE,
        CONSTRAINT uq_applications UNIQUE (offer_id, candidate_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
  } finally {
    connection.release();
  }
}

module.exports = {
  initializeDatabase,
};


