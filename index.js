const express = require('express');
const knex = require('knex');
const knexConfig = require('./knexfile');
const db = knex(knexConfig.development);
const server = express();

const port = 5000;
const cohortRoutes = require('./routes/cohortRoutes');

server.use(express.json());
server.use('/api/cohorts', cohortRoutes);

server.listen(port, () => console.log(`Server listening on port ${port}.`));
