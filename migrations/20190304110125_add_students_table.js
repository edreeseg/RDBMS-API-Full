exports.up = function(knex, Promise) {
  return knex.schema.createTable('students', tbl => {
    tbl.increments();
    tbl.string('name', 255).notNullable();
    tbl
      .integer('cohort_id')
      .references('id')
      .inTable('cohorts');
    tbl.timestamp('createdAt').defaultTo(knex.fn.now());
  });
};

exports.down = (knex, Promise) => knex.schema.dropTableIfExists('students');
