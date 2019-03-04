const express = require('express');
const knex = require('knex');
const knexConfig = require('../knexfile');
const db = knex(knexConfig.development);
const router = express.Router();

router.get('/', (req, res) => {
  db('cohorts')
    .then(cohorts => res.json({ cohorts }))
    .catch(error => res.status(500).json({ error }));
}); // This route will return an array of all cohorts.

router.post('/', (req, res) => {
  const { name } = req.body;
  if (!name)
    return res.status(400).json({ error: 'Request must include a name key.' });
  db.insert({ name })
    .into('cohorts')
    .then(id => res.status(201).json({ id: id[0] }))
    .catch(error => res.status(500).json({ error }));
}); // This route should save a new cohort to the database.

router.get('/:id', (req, res) => {
  const { id } = req.params;
  db('cohorts')
    .where({ id })
    .then(cohort => {
      if (cohort.length) return res.json({ cohort: cohort[0] });
      else
        return res.status(404).json({ error: 'No cohort with that ID found.' });
    })
    .catch(error => res.status(500).json({ error }));
}); // This route will return the cohort with the matching id.

router.get('/:id/students', (req, res) => {
  const { id } = req.params;
  db('cohorts')
    .where({ id })
    .then(cohort => {
      if (cohort.length)
        return db('students').where({ cohort_id: cohort[0].id });
      else
        return res.status(404).json({ error: 'No cohort with that ID found.' });
    })
    .then(students => {
      if (students.length) return res.json({ students });
      return res.status(404).json({ error: 'No cohort with that ID found.' });
    })
    .catch(error => res.status(500).json({ error }));
}); // returns all students for the cohort with the specified id.

router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  if (!name)
    return res.status(400).json({ error: 'Request must include a name key.' });
  db('cohorts')
    .where({ id })
    .update({ name })
    .then(count => {
      if (count) return res.json({ success: 'Entry successfully updated.' });
      else
        return res.status(404).json({ error: 'No cohort with that ID found.' });
    })
    .catch(error => res.status(500).json({ error }));
}); // This route will update the cohort with the matching id using information sent in the body of the request.

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  db('cohorts')
    .where({ id })
    .del()
    .then(count => {
      if (count) return res.json({ success: 'Entry successfully deleted.' });
      else
        return res.status(404).json({ error: 'No cohort with that ID found.' });
    })
    .catch(error => res.status(500).json({ error }));
}); // This route should delete the specified cohort.

module.exports = router;
