/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('bank_accounts', (table) => {
        table.increments('id').primary(); // auto-increment ID
        table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE'); // foreign key reference to users
        table.string('unique_account_number').unique().notNullable(); // Unique account number
        table.decimal('balance', 14, 2).defaultTo(0); // initial balance set to 0
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('bank_accounts');
};
