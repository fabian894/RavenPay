/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('transactions', (table) => {
        table.increments('transaction_id').primary(); // Set transaction_id as auto-increment
        table.integer('user_id').unsigned().notNullable();
        table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
        table.string('transaction_type').notNullable(); // deposit or transfer
        table.decimal('amount', 15, 2).notNullable(); // Amount with 2 decimal places
        table.string('recipient_account').nullable(); // Only for transfers
        table.string('status').defaultTo('pending'); // Transaction status
        table.timestamp('created_at').defaultTo(knex.fn.now()); // Timestamp
    });
};
  

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('transactions');
};
