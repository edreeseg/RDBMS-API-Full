const express = require('express');
const knex = require('knex');
const knexConfig = require('../knexfile');
const db = knex(knexConfig.development);
const router = express.Router();

router.get('/', (req, res) => {
  db('students')
    .then(students => res.json({ students }))
    .catch(error => res.status(500).json({ error }));
}); // This route will return an array of all students.

router.post('/', (req, res) => {
  const { name, cohort_id } = req.body;
  if (!name || !cohort_id)
    return res
      .status(400)
      .json({ error: 'Request must include name and cohort_id keys.' });
  db.insert({ name, cohort_id })
    .into('students')
    .then(id => res.status(201).json({ id: id[0] }))
    .catch(error => res.status(500).json({ error }));
});

router.get('/:id', (req, res) => {
  const { id } = req.params;
  db.select(
    // Way to exclude just one column from SELECT * ?
    'students.id AS id',
    'students.name AS name',
    'cohorts.name AS cohort_name',
    'students.createdAt AS createdAt'
  )
    .from('students')
    .where({ 'students.id': id })
    .innerJoin('cohorts', 'students.cohort_id', 'cohorts.id')
    .then(student => {
      if (!student.length)
        return res
          .status(404)
          .json({ error: 'No student found with that ID.' });
      else res.json({ student: student[0] });
    })
    .catch(error => res.status(500).json({ error }));
});

router.put('/:id', (req, res) => {
  const { name, cohort_id } = req.body;
  const { id } = req.params;
  if (!name && !cohort_id)
    return res
      .status(400)
      .json({ error: 'Request must include a name or cohort_id key.' });
  const update = {};
  if (name) update.name = name;
  if (cohort_id) update.cohort_id = cohort_id;
  db('students')
    .where({ id })
    .update(update)
    .then(count => {
      if (count) return res.json({ success: 'Entry successfully updated.' });
      else
        return res
          .status(404)
          .json({ error: 'No student with that ID found.' });
    })
    .catch(error => res.status(500).json({ error }));
});

router.delete('/:id', (req, res) => {
  const { id } = req.body;
  db('students')
    .where({ id })
    .del()
    .then(count => {
      if (count) return res.json({ success: 'Entry successfully deleted.' });
      else
        return res
          .status(404)
          .json({ error: 'No student with that ID found.' });
    })
    .catch(error => res.status(500).json({ error }));
});

module.exports = router;
