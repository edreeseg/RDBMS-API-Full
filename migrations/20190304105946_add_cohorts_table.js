const knex = require('knex');

exports.up = (knex, Promise) => {
  return knex.schema.createTable('cohorts', tbl => {
    tbl.increments();
    tbl.string('name', 255).notNullable();
    tbl.timestamp('createdAt').defaultTo(knex.fn.now());
  });
};

exports.down = (knex, Promise) => knex.schema.dropTableIfExists('cohorts');
