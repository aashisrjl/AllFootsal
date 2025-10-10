/**
 * Initial database schema migration
 * Creates all tables with proper foreign key relationships
 */

exports.up = function(knex) {
  return knex.schema
    // Create users table
    .createTable('users', function(table) {
      table.increments('id').primary();
      table.string('username').notNullable();
      table.string('email').notNullable().unique();
      table.string('password');
      table.string('googleId');
      table.string('phoneNumber').notNullable();
      table.timestamps(true, true);
    })
    
    // Create footsals table (main table)
    .createTable('footsals', function(table) {
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
    })
    
    // Create footsal_locations table
    .createTable('footsal_locations', function(table) {
      table.integer('footsal_id').primary();
      table.string('district').notNullable();
      table.string('address').notNullable();
      table.decimal('latitude', 10, 7);
      table.decimal('longitude', 10, 7);
      table.text('full_address');
      table.string('city');
      table.string('postal_code');
      table.timestamps(true, true);
      
      table.foreign('footsal_id')
        .references('id')
        .inTable('footsals')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');
    })
    
    // Create footsal_analytics table
    .createTable('footsal_analytics', function(table) {
      table.integer('footsal_id').primary();
      table.float('avg_rating').defaultTo(0);
      table.integer('total_bookings').defaultTo(0);
      table.decimal('total_revenue', 10, 2).defaultTo(0);
      table.text('review_summary');
      table.timestamp('last_booking_date');
      table.timestamps(true, true);
      
      table.foreign('footsal_id')
        .references('id')
        .inTable('footsals')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');
    })
    
    // Create footsal_subscriptions table
    .createTable('footsal_subscriptions', function(table) {
      table.increments('id').primary();
      table.integer('footsal_id').notNullable();
      table.enum('subscription_plan', ['monthly', 'half-yearly', 'yearly']).defaultTo('monthly');
      table.timestamp('subscription_start');
      table.timestamp('subscription_end');
      table.decimal('subscription_fee', 10, 2);
      table.enum('status', ['pending', 'active', 'expired', 'cancelled']).defaultTo('pending');
      table.boolean('auto_renew').defaultTo(false);
      table.timestamps(true, true);
      
      table.foreign('footsal_id')
        .references('id')
        .inTable('footsals')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');
    })
    
    // Create footsal_payments table
    .createTable('footsal_payments', function(table) {
      table.increments('id').primary();
      table.integer('footsal_id').notNullable();
      table.integer('subscription_id');
      table.decimal('amount', 10, 2).notNullable();
      table.timestamp('payment_date').defaultTo(knex.fn.now());
      table.enum('payment_method', ['cash', 'card', 'online', 'qr', 'bank_transfer']).notNullable();
      table.string('transaction_id');
      table.enum('status', ['pending', 'completed', 'failed', 'refunded']).defaultTo('pending');
      table.text('notes');
      table.timestamps(true, true);
      
      table.foreign('footsal_id')
        .references('id')
        .inTable('footsals')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');
        
      table.foreign('subscription_id')
        .references('id')
        .inTable('footsal_subscriptions')
        .onDelete('SET NULL')
        .onUpdate('CASCADE');
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('footsal_payments')
    .dropTableIfExists('footsal_subscriptions')
    .dropTableIfExists('footsal_analytics')
    .dropTableIfExists('footsal_locations')
    .dropTableIfExists('footsals')
    .dropTableIfExists('users');
};
