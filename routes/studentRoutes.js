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
  let object = null;
  db('students')
    .where({ id })
    .then(results => {
      if (results.length) {
        object = results[0];
        return db('cohorts').where({ id: object.cohort_id });
      } else
        return res
          .status(404)
          .json({ error: 'No student with this ID found.' });
    })
    .then(cohort => {
      if (cohort.length) {
        object.cohort = cohort[0].name;
        delete object.cohort_id;
        return res.json({ student: object });
      } else {
        object.warning = 'Student belongs to a cohort that does not exist!';
        return res.json({ student: object });
      }
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
