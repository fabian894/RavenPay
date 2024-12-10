/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('users', (table) => {
        table.increments('id').primary(); // Auto-incrementing ID
        table.string('name').notNullable(); // User's name
        table.string('email').unique().notNullable(); // User's email
        table.string('password').notNullable(); // Encrypted password
        table.timestamps(true, true); // created_at and updated_at
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('users');
};
