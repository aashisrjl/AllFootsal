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
      payment_status ENUM('pending','paid','failed','refunded') DEFAULT 'pending',
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
      payment_method ENUM('cash','qr','online','bank_transfer') NOT NULL,
      transaction_id VARCHAR(255),
      amount DECIMAL(10,2) NOT NULL,
      status ENUM('pending','success','failed','refunded') DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_booking (booking_id),
      INDEX idx_status (status)
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
  `
};