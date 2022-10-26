const router = require('express').Router();
const axios = require('axios');

const authenticateUser = require('./verifyToken');

router.get('/', authenticateUser, async (req, res) => {
  const results = await axios.get(
    'http://dev3.dansmultipro.co.id/api/recruitment/positions.json'
  );

  res.send(results?.data);
});

router.get('/:jobId/details', authenticateUser, async (req, res) => {
  const jobId = req.params.jobId;

  const results = await axios.get(
    'http://dev3.dansmultipro.co.id/api/recruitment/positions/' + jobId
  );

  res.send(results?.data);
});

module.exports = router;
