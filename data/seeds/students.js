exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('students')
    .del()
    .then(function() {
      // Inserts seed entries
      return knex('students').insert([
        { id: 1, name: 'Harry Potter', cohort_id: 2 },
        { id: 2, name: 'Ron Weasley', cohort_id: 2 },
        { id: 3, name: 'Hermione Granger', cohort_id: 2 },
        { id: 4, name: 'Colin Creevey', cohort_id: 3 },
        { id: 5, name: 'Ginny Weasley', cohort_id: 3 },
        { id: 6, name: 'Fred Weasley', cohort_id: 1 },
        { id: 7, name: 'George Weasley', cohort_id: 1 },
        { id: 8, name: 'Cho Chang', cohort_id: 1 },
        { id: 9, name: 'Draco Malfoy', cohort_id: 2 },
        { id: 10, name: 'Cedric Diggory', cohort_id: 1 },
      ]);
    });
};
