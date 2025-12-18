/**
 * Initial database schema migration
 * Creates all tables matching Sequelize models exactly
 */

exports.up = async function (knex) {
  // USERS TABLE
  const hasUsers = await knex.schema.hasTable('users');
  if (!hasUsers) {
    await knex.schema.createTable('users', function (table) {
      table.increments('id').primary();
      table.string('username').notNullable();
      table.string('email').notNullable().unique();
      table.string('password');
      table.string('googleId');
      table.string('profile_image');
      table.integer('currentOrgNumber').defaultTo(0);
      table.enum('role', ['user']).defaultTo('user');
      table.boolean('is_active').defaultTo(true);
      table.boolean('isVerified').defaultTo(false);
      table.timestamps(true, true);
    });
  }

  // FOOTSALS TABLE
  const hasFootsals = await knex.schema.hasTable('footsals');
  if (!hasFootsals) {
    await knex.schema.createTable('footsals', function (table) {
      table.increments('id').primary();
      table.integer('footsalCode').defaultTo(0);
      table.string('email').notNullable().unique();
      table.string('password');
      table.string('googleId');
      table.string('username').notNullable();
      table.string('footsalName').notNullable();
      table.string('phoneNumber').notNullable();
      table.text('description');
      table.json('images');
      table.string('contact_phone');
      table.string('contact_email');
      table.string('qr_payment_url');
      table.boolean('is_active').defaultTo(false);
      table.timestamps(true, true);
    });
  }

  // FOOTSAL_LOCATIONS TABLE
  const hasLocations = await knex.schema.hasTable('footsal_locations');
  if (!hasLocations) {
    await knex.schema.createTable('footsal_locations', function (table) {
      table.integer('footsal_id').primary();
      table.string('district').notNullable();
      table.string('address').notNullable();
      table.decimal('latitude', 10, 7);
      table.decimal('longitude', 10, 7);
      table.text('full_address');
      table.string('city');
      table.string('postal_code');
      table.timestamps(true, true);
      table
        .foreign('footsal_id')
        .references('id')
        .inTable('footsals')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');
    });
  }

  // FOOTSAL_ANALYTICS TABLE
  const hasAnalytics = await knex.schema.hasTable('footsal_analytics');
  if (!hasAnalytics) {
    await knex.schema.createTable('footsal_analytics', function (table) {
      table.integer('footsal_id').primary();
      table.float('avg_rating').defaultTo(0);
      table.integer('total_bookings').defaultTo(0);
      table.decimal('total_revenue', 10, 2).defaultTo(0);
      table.text('review_summary');
      table.timestamp('last_booking_date');
      table.timestamps(true, true);
      table
        .foreign('footsal_id')
        .references('id')
        .inTable('footsals')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');
    });
  }

  // FOOTSAL_INFOS TABLE
  const hasInfos = await knex.schema.hasTable('footsal_infos');
  if (!hasInfos) {
    await knex.schema.createTable('footsal_infos', function (table) {
      table.integer('footsal_id').primary();
      table.integer('established_year');
      table.json('facilities');
      table.json('operating_hours');
      table.json('social_links');
      table.string('website_url');
      table.text('parking_info');
      table.text('additional_info');
      table.text('note');
      table.timestamps(true, true);
      table
        .foreign('footsal_id')
        .references('id')
        .inTable('footsals')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');
    });
  }

  // FOOTSAL_SUBSCRIPTIONS TABLE
  const hasSubscriptions = await knex.schema.hasTable('footsal_subscriptions');
  if (!hasSubscriptions) {
    await knex.schema.createTable('footsal_subscriptions', function (table) {
      table.increments('id').primary();
      table.integer('footsal_id').notNullable();
      table
        .enum('subscription_plan', ['monthly', 'half-yearly', 'yearly'])
        .defaultTo('monthly');
      table.timestamp('subscription_start');
      table.timestamp('subscription_end');
      table.decimal('subscription_fee', 10, 2);
      table
        .enum('status', ['pending', 'active', 'expired', 'cancelled'])
        .defaultTo('pending');
      table.boolean('auto_renew').defaultTo(false);
      table.timestamps(true, true);
      table
        .foreign('footsal_id')
        .references('id')
        .inTable('footsals')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');
    });
  }

  // FOOTSAL_PAYMENTS TABLE
  const hasPayments = await knex.schema.hasTable('footsal_payments');
  if (!hasPayments) {
    await knex.schema.createTable('footsal_payments', function (table) {
      table.increments('id').primary();
      table.integer('footsal_id').notNullable();
      table.integer('subscription_id');
      table.decimal('amount', 10, 2).notNullable();
      table
        .timestamp('payment_date')
        .defaultTo(knex.fn.now());
      table
        .enum('payment_method', [
          'cash',
          'card',
          'online',
          'qr',
          'bank_transfer',
        ])
        .notNullable();
      table.string('transaction_id');
      table
        .enum('status', ['pending', 'completed', 'failed', 'refunded'])
        .defaultTo('pending');
      table.text('notes');
      table.timestamps(true, true);
      table
        .foreign('footsal_id')
        .references('id')
        .inTable('footsals')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');
      table
        .foreign('subscription_id')
        .references('id')
        .inTable('footsal_subscriptions')
        .onDelete('SET NULL')
        .onUpdate('CASCADE');
    });
  }

  // FOOTSAL_PITCHES TABLE
  const hasPitches = await knex.schema.hasTable('footsal_pitches');
  if (!hasPitches) {
    await knex.schema.createTable('footsal_pitches', function (table) {
      table.increments('id').primary();
      table.integer('footsal_id').notNullable();
      table.string('name').notNullable();
      table.string('pitch_type').notNullable();
      table.string('surface_type').notNullable();
      table.string('dimensions');
      table.boolean('lighting').defaultTo(false);
      table.boolean('indoor').defaultTo(false);
      table.timestamps(true, true);
      table
        .foreign('footsal_id')
        .references('id')
        .inTable('footsals')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');
    });
  }

  // FOOTSAL_TIME_SLOTS TABLE
  const hasTimeSlots = await knex.schema.hasTable('footsal_time_slots');
  if (!hasTimeSlots) {
    await knex.schema.createTable('footsal_time_slots', function (table) {
      table.increments('id').primary();
      table.integer('footsal_id').notNullable();
      table.integer('pitch_id').notNullable();
      table.integer('day_of_week').notNullable();
      table.time('start_time').notNullable();
      table.time('end_time').notNullable();
      table.decimal('price', 10, 2).notNullable();
      table.timestamps(true, true);
      table
        .foreign('footsal_id')
        .references('id')
        .inTable('footsals')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');
      table
        .foreign('pitch_id')
        .references('id')
        .inTable('footsal_pitches')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');
    });
  }

  // FOOTSAL_RATINGS TABLE
  const hasRatings = await knex.schema.hasTable('footsal_ratings');
  if (!hasRatings) {
    await knex.schema.createTable('footsal_ratings', function (table) {
      table.increments('id').primary();
      table.integer('footsal_id').notNullable();
      table.integer('user_id').notNullable();
      table.integer('rating').notNullable();
      table.text('review');
      table.timestamp('review_date').defaultTo(knex.fn.now());
      table.timestamps(true, true);
      table
        .foreign('footsal_id')
        .references('id')
        .inTable('footsals')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');
      table
        .foreign('user_id')
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');
      // Unique constraint: one rating per user per footsal
      table.unique(['footsal_id', 'user_id']);
    });
  }

  // FOOTSAL_BOOKINGS TABLE
  const hasBookings = await knex.schema.hasTable('footsal_bookings');
  if (!hasBookings) {
    await knex.schema.createTable('footsal_bookings', function (table) {
      table.increments('id').primary();
      table.integer('footsal_id').notNullable();
      table.integer('pitch_id').notNullable();
      table.integer('user_id').notNullable();
      table.integer('time_slot_id').notNullable();
      table.date('booking_date').notNullable();
      table
        .enum('status', ['pending', 'confirmed', 'cancelled', 'completed'])
        .defaultTo('pending');
      table.decimal('total_amount', 10, 2).notNullable();
      table
        .enum('payment_status', ['pending', 'paid', 'failed', 'refunded'])
        .defaultTo('pending');
      table.integer('payment_id');
      table.text('notes');
      table.timestamps(true, true);
      table
        .foreign('footsal_id')
        .references('id')
        .inTable('footsals')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');
      table
        .foreign('pitch_id')
        .references('id')
        .inTable('footsal_pitches')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');
      table
        .foreign('user_id')
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');
      table
        .foreign('time_slot_id')
        .references('id')
        .inTable('footsal_time_slots')
        .onDelete('RESTRICT')
        .onUpdate('CASCADE');
      table
        .foreign('payment_id')
        .references('id')
        .inTable('footsal_payments')
        .onDelete('SET NULL')
        .onUpdate('CASCADE');
    });
  }
};

exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists('footsal_bookings')
    .dropTableIfExists('footsal_ratings')
    .dropTableIfExists('footsal_time_slots')
    .dropTableIfExists('footsal_pitches')
    .dropTableIfExists('footsal_payments')
    .dropTableIfExists('footsal_subscriptions')
    .dropTableIfExists('footsal_infos')
    .dropTableIfExists('footsal_analytics')
    .dropTableIfExists('footsal_locations')
    .dropTableIfExists('footsals')
    .dropTableIfExists('users');
};

