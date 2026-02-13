module.exports = {
  location: (code) => `
    CREATE TABLE IF NOT EXISTS location_${code} (
      id INT AUTO_INCREMENT PRIMARY KEY,
      latitude DECIMAL(10,7),
      longitude DECIMAL(10,7),
      address TEXT,
      city VARCHAR(100),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `,

  pitch: (code) => `
    CREATE TABLE IF NOT EXISTS pitch_${code} (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100),
      pitch_type ENUM('5A','6A','7A'),
      price_per_hour DECIMAL(10,2),
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `,

  timeslot: (code) => `
    CREATE TABLE IF NOT EXISTS timeslot_${code} (
      id INT AUTO_INCREMENT PRIMARY KEY,
      pitch_id INT NOT NULL,
      start_time TIME,
      end_time TIME,
      is_available BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `,

  booking: (code) => `
    CREATE TABLE IF NOT EXISTS booking_${code} (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      pitch_id INT NOT NULL,
      booking_date DATE,
      start_time TIME,
      end_time TIME,
      amount DECIMAL(10,2),
      payment_status ENUM('pending','paid','cancelled') DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
  `,

  payment: (code) => `
    CREATE TABLE IF NOT EXISTS payment_${code} (
      id INT AUTO_INCREMENT PRIMARY KEY,
      booking_id INT NOT NULL,
      payment_method ENUM('cash','qr','online'),
      transaction_id VARCHAR(255),
      amount DECIMAL(10,2),
      status ENUM('pending','success','failed'),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `,

  rating: (code) => `
    CREATE TABLE IF NOT EXISTS rating_${code} (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      rating INT CHECK (rating BETWEEN 1 AND 5),
      review TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `,

  contact: (code) => `
    CREATE TABLE IF NOT EXISTS contact_${code} (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100),
      email VARCHAR(150),
      message TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `,

  analytics: (code) => `
    CREATE TABLE IF NOT EXISTS analytics_${code} (
      id INT AUTO_INCREMENT PRIMARY KEY,
      total_bookings INT DEFAULT 0,
      total_revenue DECIMAL(12,2) DEFAULT 0,
      month YEAR,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `
};
