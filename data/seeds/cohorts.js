exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('cohorts')
    .del()
    .then(function() {
      // Inserts seed entries
      return knex('cohorts').insert([
        { id: 1, name: 'Test Cohort 1' },
        { id: 2, name: 'Test Cohort 2' },
        { id: 3, name: 'Test Cohort 3' },
      ]);
    });
};
