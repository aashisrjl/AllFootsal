module.exports = {
  pitch: (code) => `
    CREATE TABLE IF NOT EXISTS pitch_${code} (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      pitch_type ENUM('5A','6A','7A') NOT NULL,
      surface_type VARCHAR(50),
      dimensions VARCHAR(50),
      price_per_hour DECIMAL(10,2) NOT NULL,
      lighting BOOLEAN DEFAULT FALSE,
      indoor BOOLEAN DEFAULT FALSE,
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB;
  `,

  timeslot: (code) => `
    CREATE TABLE IF NOT EXISTS timeslot_${code} (
      id INT AUTO_INCREMENT PRIMARY KEY,
      pitch_id INT NOT NULL,
      day_of_week TINYINT NOT NULL COMMENT '0=Sun,6=Sat',
      start_time TIME NOT NULL,
      end_time TIME NOT NULL,
      price DECIMAL(10,2) NOT NULL,
      is_available BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_pitch_day (pitch_id, day_of_week)
    ) ENGINE=InnoDB;
  `,

  booking: (code) => `
    CREATE TABLE IF NOT EXISTS booking_${code} (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      pitch_id INT NOT NULL,
      timeslot_id INT NOT NULL,
      booking_date DATE NOT NULL,
      amount DECIMAL(10,2) NOT NULL,
      status ENUM('pending','confirmed','cancelled','completed') DEFAULT 'pending',
      notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_user (user_id),
      INDEX idx_pitch_date (pitch_id, booking_date),
      INDEX idx_status (status),
      UNIQUE KEY no_double_book (pitch_id, timeslot_id, booking_date)
    ) ENGINE=InnoDB;
  `,

payment: (code) => `
  CREATE TABLE IF NOT EXISTS payment_${code} (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    user_id INT NOT NULL,
    gateway ENUM('cash','khalti','esewa','bank_transfer') NOT NULL,
    provider_order_id VARCHAR(255) DEFAULT NULL,
    provider_txn_id VARCHAR(255) DEFAULT NULL,
    amount DECIMAL(10,2) NOT NULL,
    status ENUM('pending','success','failed','refunded') DEFAULT 'pending',
    raw_response JSON DEFAULT NULL,
    verified_at TIMESTAMP NULL DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_booking (booking_id),
    INDEX idx_user (user_id),
    INDEX idx_status (status),
    INDEX idx_provider_order (provider_order_id),
    UNIQUE KEY uq_provider_txn (gateway, provider_txn_id)
  ) ENGINE=InnoDB;
`,

  rating: (code) => `
    CREATE TABLE IF NOT EXISTS rating_${code} (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      rating TINYINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
      review TEXT,
      sentiment_score DECIMAL(5,4),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY one_rating_per_user (user_id)
    ) ENGINE=InnoDB;
  `,

  location: (code) => `
    CREATE TABLE IF NOT EXISTS location_${code} (
      id INT AUTO_INCREMENT PRIMARY KEY,
      district VARCHAR(100),
      address TEXT NOT NULL,
      city VARCHAR(100),
      postal_code VARCHAR(20),
      latitude DECIMAL(10,7),
      longitude DECIMAL(10,7),
      full_address TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB;
  `,

  contact: (code) => `
    CREATE TABLE IF NOT EXISTS contact_${code} (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100),
      email VARCHAR(150),
      phone VARCHAR(20),
      message TEXT,
      is_read BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB;
  `,

  analytics: (code) => `
    CREATE TABLE IF NOT EXISTS analytics_${code} (
      id INT AUTO_INCREMENT PRIMARY KEY,
      total_bookings INT DEFAULT 0,
      total_revenue DECIMAL(12,2) DEFAULT 0.00,
      avg_rating DECIMAL(3,2) DEFAULT 0.00,
      month DATE NOT NULL COMMENT 'First day of month',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY unique_month (month)
    ) ENGINE=InnoDB;
  `,

  info: (code) => `
    CREATE TABLE IF NOT EXISTS info_${code} (
      id INT AUTO_INCREMENT PRIMARY KEY,
      established_year YEAR,
      facilities JSON,
      operating_hours JSON,
      social_links JSON,
      website_url VARCHAR(500),
      parking_info TEXT,
      additional_info TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB;
  `,
  media: (code) => `
    CREATE TABLE IF NOT EXISTS media_${code} (
      id INT AUTO_INCREMENT PRIMARY KEY,
      type ENUM('image','video') NOT NULL,
      category ENUM('home','pitch','facility','event','other') NOT NULL,
      url VARCHAR(500) NOT NULL,
      description TEXT,
      pitch_id INT,
      foreign key (pitch_id) references pitch_${code}(id) on delete set null,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB;
  `
};