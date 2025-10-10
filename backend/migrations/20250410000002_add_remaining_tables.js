/**
 * Migration to add remaining footsal-related tables
 * Creates info, pitches, time_slots, ratings, and bookings tables
 */

exports.up = function(knex) {
  return knex.schema
    // Create footsal_infos table
    .createTable('footsal_infos', function(table) {
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
      
      table.foreign('footsal_id')
        .references('id')
        .inTable('footsals')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');
    })
    
    // Create footsal_pitches table
    .createTable('footsal_pitches', function(table) {
      table.increments('id').primary();
      table.integer('footsal_id').notNullable();
      table.string('name').notNullable();
      table.string('pitch_type').notNullable();
      table.string('surface_type').notNullable();
      table.string('dimensions');
      table.boolean('lighting').defaultTo(false);
      table.boolean('indoor').defaultTo(false);
      table.timestamps(true, true);
      
      table.foreign('footsal_id')
        .references('id')
        .inTable('footsals')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');
    })
    
    // Create footsal_time_slots table
    .createTable('footsal_time_slots', function(table) {
      table.increments('id').primary();
      table.integer('footsal_id').notNullable();
      table.integer('pitch_id').notNullable();
      table.integer('day_of_week').notNullable();
      table.time('start_time').notNullable();
      table.time('end_time').notNullable();
      table.decimal('price', 10, 2).notNullable();
      table.timestamps(true, true);
      
      table.foreign('footsal_id')
        .references('id')
        .inTable('footsals')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');
        
      table.foreign('pitch_id')
        .references('id')
        .inTable('footsal_pitches')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');
        
      // Constraint to ensure day_of_week is between 0-6
      table.check('day_of_week >= 0 AND day_of_week <= 6');
    })
    
    // Create footsal_ratings table
    .createTable('footsal_ratings', function(table) {
      table.increments('id').primary();
      table.integer('footsal_id').notNullable();
      table.integer('user_id').notNullable();
      table.integer('rating').notNullable();
      table.text('review');
      table.timestamp('review_date').defaultTo(knex.fn.now());
      table.timestamps(true, true);
      
      table.foreign('footsal_id')
        .references('id')
        .inTable('footsals')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');
        
      table.foreign('user_id')
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');
        
      // Constraint to ensure rating is between 1-5
      table.check('rating >= 1 AND rating <= 5');
      
      // Unique constraint: one rating per user per footsal
      table.unique(['footsal_id', 'user_id']);
    })
    
    // Create footsal_bookings table
    .createTable('footsal_bookings', function(table) {
      table.increments('id').primary();
      table.integer('footsal_id').notNullable();
      table.integer('pitch_id').notNullable();
      table.integer('user_id').notNullable();
      table.integer('time_slot_id').notNullable();
      table.date('booking_date').notNullable();
      table.enum('status', ['pending', 'confirmed', 'cancelled', 'completed']).defaultTo('pending');
      table.decimal('total_amount', 10, 2).notNullable();
      table.enum('payment_status', ['pending', 'paid', 'failed', 'refunded']).defaultTo('pending');
      table.integer('payment_id');
      table.text('notes');
      table.timestamps(true, true);
      
      table.foreign('footsal_id')
        .references('id')
        .inTable('footsals')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');
        
      table.foreign('pitch_id')
        .references('id')
        .inTable('footsal_pitches')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');
        
      table.foreign('user_id')
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');
        
      table.foreign('time_slot_id')
        .references('id')
        .inTable('footsal_time_slots')
        .onDelete('RESTRICT')
        .onUpdate('CASCADE');
        
      table.foreign('payment_id')
        .references('id')
        .inTable('footsal_payments')
        .onDelete('SET NULL')
        .onUpdate('CASCADE');
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('footsal_bookings')
    .dropTableIfExists('footsal_ratings')
    .dropTableIfExists('footsal_time_slots')
    .dropTableIfExists('footsal_pitches')
    .dropTableIfExists('footsal_infos');
};
